import React from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import ReactHtmlParser from 'react-html-parser';

import Details from './Details';
import Gallery from './Gallery';
import BackButton from './BackButton';
import CreatePageButton from './CreatePageButton';

import * as apicli from '../apicli';
import { IMGS } from '../consts';
import { generateVersionHistory } from '../generate';

export default class View extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            page: null,
            showSaved: false,
            showRestored: false,
            history: null,
        }
    }

    componentDidMount() {
        this.fetchPageData();

        // If QueryString Present
        if (this.props.location.search.length) {
            let parsed = queryString.parse(this.props.location.search);
            
            if (parsed.saved) {
                this.setState({ showSaved: true });
                setTimeout(() => {
                    this.setState({ showSaved: false });
                }, 3000);

                delete parsed.saved;

                this.props.history.push({
                    search: '?' + queryString.stringify(parsed)
                });
            }
      
            if (parsed.restored) {
                this.setState({ showRestored: true });
                setTimeout(() => {
                    this.setState({ showRestored: false });
                }, 3000);

                delete parsed.restored;
            }


        }
    }

    componentDidUpdate() {
        if (this.props.location.search.length) {
            let parsed = queryString.parse(this.props.location.search);
            if (parsed.restored) {
                this.setState({ showRestored: true });
                setTimeout(() => {
                    this.setState({ showRestored: false });
                }, 3000);

                delete parsed.restored;

                this.props.history.push({
                    search: '?' + queryString.stringify(parsed)
                });

                this.fetchPageData();
            }
        }

        if (this.props.match.params.id !== this.state.id) {
            this.fetchPageData();
        }
    }

    fetchPageData() {      
        const pageResult = apicli.getPageById(this.props.match.params.id);
        const versionHistory = apicli.getVersionHistory(this.props.match.params.id);
        let id = this.props.match.params.id;
        let page = pageResult ? pageResult : null;
        let history = versionHistory ? versionHistory : null

        this.setState({
            id,
            page,
            history
        });
    }

    showHistory() {
        const show = this.state.showHistory;
        this.setState({
            showHistory: !show
        });
    }

    render() {
        return(
            <div className="Page u-card">
                <div className={"Page_Saved" + (!this.state.showSaved ? ' u-hidden' : '')}>Saved!</div>
                <div className={"Page_Saved" + (!this.state.showRestored ? ' u-hidden' : '')}>Restored!</div>
                { this.state.page &&
                    <div style={{ textAlign: "right"}}>
                        <Link 
                            to={"/edit/" + this.state.id}
                            className="Edit u-float-right"
                        >
                            <button className="StyledButton">Edit</button>
                        </Link>
                    </div>
                }

                { this.state.page &&
                    <div>
                        <span className="Page_title">{this.state.page.title}</span>
                        <div className="u-div"></div>
                        <span className="Page_category">CATEGORY: <b><Link to={"/list/category/" + this.state.page.category}>{this.state.page.category.toUpperCase()}</Link></b> / SUBCATEGORY: <b><Link to={"/list/subcategory/" + this.state.page.subcategory}>{this.state.page.subcategory.toUpperCase()}</Link></b></span>
                        <div className="u-div"></div>

                        {this.state.page.images.main.length > 0 &&
                            <div>
                                <div className="MainImage">
                                    <Link to={"/image/?i=" + this.state.page.images.main}>
                                        <img src={IMGS + this.state.page.images.main} />
                                    </Link>
                                </div>
                                <div className="u-div"></div>
                            </div>
                        }

                        {/* If Preface OR Details */}
                        {(this.state.page.preface.length > 0 || this.state.page.details.length > 0) && !(this.state.page.preface.length > 0 && this.state.page.details.length > 0) &&
                            <div>
                                {this.state.page.details.length > 0 &&
                                    <Details details={this.state.page.details} />
                                }
                                {this.state.page.preface.length > 0 &&
                                    <div className="Page_preface">
                                        <p>{ReactHtmlParser(this.state.page.preface)}</p>
                                    </div>
                                }
                            </div>
                        }

                        {/* If Preface AND Details */}
                        {this.state.page.preface.length > 0 && this.state.page.details.length > 0 &&
                            <div>
                                <div className="Page_preface">
                                    <p>                           
                                        <div className="Details_floated">
                                            <Details details={this.state.page.details} />
                                        </div>
                                    {ReactHtmlParser(this.state.page.preface)}</p>
                                </div>
                                <div className="u-clear"></div>
                            </div>
                        }


                        <div className="Page_content">{ReactHtmlParser(this.state.page.body)}</div>
                        
                        {this.state.page.images.other.length > 0 &&
                            <div>
                                <div className="u-div"></div>
                                <Gallery 
                                    images={this.state.page.images.other} 
                                    id={this.state.page.images.other.length > 1 ? this.state.id : false}
                                    from={this.props.history.location.pathname + this.props.history.location.search}
                                />
                            </div>
                        }
                        
                    </div>
                }

                { !this.state.page &&
                    <div>
                        <BackButton label="Back" />
                        <p>This page "<span className="u-capitalise">{this.props.match.params.id}</span>" has not been created yet. Would you like to create it now?</p>
                        <CreatePageButton create={this.props.match.params.id} />
                        {this.state.history !== null &&
                            <div>
                                <div className="u-div"></div>
                                <p className="f-title">There are Archived versions of this page</p>
                                {generateVersionHistory(this.state.history)}
                            </div>
                        }
                    </div>
                    }
            </div> 
        )
    }
}