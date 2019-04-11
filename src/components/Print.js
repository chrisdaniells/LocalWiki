import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { getPageById } from '../apicli';

import Details from './Details';

export default class Print extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            page: null
        }
    }

    componentDidMount() {
        document.body.style.backgroundColor = "white";
        document.getElementsByTagName('header')[0].style.display = "none";
        document.getElementsByTagName('section')[0].setAttribute("style", "min-width: 100%; max-width: none");
        this.fetchPage();
    }

    componentDidUpdate() {
        if (this.props.match.params.id !== this.state.id) {
            this.fetchPage();
        }
    }

    fetchPage() {
        const page = getPageById(this.props.match.params.id);
        if (page) {
            this.setState({
                id: this.props.match.params.id,
                page: res
            });
        }
    }

    render() {
        return(
            <div>
                {this.state.page &&
                    <div className="Page Page_Print">
                        <span 
                            className="Page_title"
                            style={{
                                fontSize: "36px"
                            }}
                        >{this.state.page.title}</span>
                        <div className="u-div"></div>
                        
                        <span className="Page_category">CATEGORY: <b>{this.state.page.category.toUpperCase()}</b> / SUBCATEGORY: <b>{this.state.page.subcategory.toUpperCase()}</b></span>
                        <div className="u-div"></div>
                        
                        {this.state.page.details.length > 0 &&
                            <Details details={this.state.page.details} />
                        }
                        <div className="u-div"></div>

                        {this.state.page.preface.length > 0 &&
                            <div className="Page_preface">
                                <p>{ReactHtmlParser(this.state.page.preface)}</p>
                            </div>
                        }
                        <div className="Page_content">{ReactHtmlParser(this.state.page.body)}</div>
                    </div>
                }
            </div>
        )
    }
}