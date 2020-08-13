import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { CreateJob } from '../CreateJob/CreateJob.jsx';
import moment from 'moment';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';



export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            jobData: [],
            error: null,
            loaderData: loader,

            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            currentPageNumber: 1,
            activeIndex: "",
            totalCount: 1,
            limit: 3


        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.getJobList = this.getJobList.bind(this);
        this.handleClick = this.handleClick.bind(this);

    };

    init() {

        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData, });//comment this
        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)


    }

    componentDidMount() {
        
        this.loadData();
        this.getJobList();
    };

    loadData(callback) {


        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talenttalentmicroservice.azurewebsites.net/listing/listing/getSortedEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) { }.bind(this),
            error: function (res) {
                //console.log(res.status)
            }
        })
        this.init()
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader,

                })
            })
        });
    }
    handleClick(e, data) {
       
        console.log("pageInfo", data.activePage)
        this.getJobList(data.activePage);
       

    };

    getJobList(activePage) {
        var cookies = Cookies.get('talentAuthToken');
        let p = new URLSearchParams();
        p.append('activePage', activePage || 1);
        
        $.ajax({
            url: 'https://talenttalentmicroservice.azurewebsites.net/listing/listing/getSortedEmployerJobs?' + p,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log("res", res)
                if (res.success == true) {

                    this.setState({
                        jobData: res.myJobs,
                        currentPageNumber: res.currentPageNumber,
                        totalCount: res.totalCount,
                        limit: res.limit
                       

                    })

                }

            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })


    }

    render() {
        let totalpages = Math.ceil(this.state.totalCount / this.state.limit)
        const { jobData, activePage } = this.state;
        //console.log("jobData.date", jobData.expiryDate)
       
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">

                        <div className="column">
                            <div className="sixteen wide  padded column">
                                <h1>Lists Of Jobs</h1>
                            </div>
                        </div><br />
                        <div className="row">
                            <div className="four wide  padded column">
                                <span>
                                    <i className="filter icon"></i>
                                        Filter:&nbsp;
                                        <Dropdown text='Choose filter'
                                        inline
                                        options={null}
                                        defaultValue={null}
                                    />
                                </span>
                                <span>

                                    <i className="calendar alternate  icon"></i>
                                        Sort By Date:&nbsp;
                                        <Dropdown text= 'Newest first'
                                        inline
                                       

                                    />
                                </span>

                            </div>
                        </div><br />
                        {
                            jobData.length === 0 &&
                            <div>Loading.............</div>
                        }
                        

                        <div className="ui cards">
                            {jobData.length > 0 &&
                                jobData.map((item) => (
                                    <div className="card" key={item.id}>
                                        <div className="content">
                                            <div className="ui black right ribbon label">
                                                <i className="user icon"></i> 0
                                           </div>
                                            <div className="header">{item.title}</div>
                                        </div>
                                        <div className="content">
                                            <h4 className="ui sub header"></h4>
                                            <div className="ui small feed">
                                                <div className="event">
                                                    <div className="content">
                                                        <div className="location">
                                                            {item.location.country},&nbsp; {item.location.city}
                                                        </div>
                                                        <div className="summary">{item.summary}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="extra content">
                                            <span className="left floated">
                                                <button className="ui red button">Expired</button>
                                            </span>
                                            <span className="right floated">

                                                <div className="ui buttons">
                                                    <button className="ui blue basic button"> <i className="ban icon"></i>Close</button>
                                                    <button className="ui blue basic button"><i className="edit icon"></i>Edit</button>
                                                    <button className="ui blue basic button"><i className="copy icon"></i>Copy</button>
                                                </div>

                                            </span>
                                        </div>

                                    </div>

                                ))
                            }
                        </div>

                        {this.state.error && <h3>{this.state.error}</h3>}<br />

                    </div>


                    <Pagination
                        activePage={this.state.currentPageNumber}
                        totalPages={totalpages}
                        onPageChange={this.handleClick}
                    />

                </section>

            </BodyWrapper>
        )
    }
}