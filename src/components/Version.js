import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

import { updatePageById } from '../apicli';

class Version extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show || false,
            restoreError: false
        };
    }

    showVersion() {
        const state = {...this.state};
        this.setState({
            show: !state.show
        });
    }

    generateArchivedDetailsList() {
        let detailsArray = [];
        this.props.version.details.forEach(detail => {
            detailsArray.push(<p className="Version_property"><span>{detail.label}: {detail.value}</span></p>)
        });
        return detailsArray;
    }

    generateArchivedOtherImagesList() {
        let otherImagesArray = [];
        this.props.version.images.other.forEach(image => {
            otherImagesArray.push(<p><Link to={"/image/?i=" + image}>{image}</Link></p>);
        });
        return otherImagesArray;
    }

    restore() {
        let version = this.props.version;
        version.last_updated = new Date().toString();
        const update = updatePageById(this.props.version.id, this.props.version);
        if (update) {
            this.props.history.push({
                pathname: '/view/' + this.props.version.url,
                search: '?restored=true'
            });
        } else {
            this.setState({ restoreError: true });
            setTimeout(() => {
                this.setState({ restoreError: false });
            }, 3000);
        }
    }

    render() {
        return(
            <div onClick={this.showVersion.bind(this)}
                className={"Version" + (this.state.show ? ' selected' : '')}
            >
                <p className="Version_title">{this.props.version.last_updated}</p>
                <div className={"Version_content" + (!this.state.show ? ' u-hidden' : '')}>
                    <p className="Version_property">Category: <span>{this.props.version.category}</span></p>
                    <p className="Version_property">Subcategory: <span>{this.props.version.subcategory}</span></p>
                    {this.props.version.details.length > 0 &&
                        <div>
                            <p>Details</p>
                            {this.generateArchivedDetailsList()}
                        </div>
                    }
                    {this.props.version.images.main.length > 0 &&
                        <p className="Version_property">Main Image: <span><Link to={"/image/?i=" + this.props.version.images.main}>{this.props.version.images.main}</Link></span></p>
                    }
                    {this.props.version.images.other.length > 0 &&
                        <p className="Version_property">Other images: <span>{this.generateArchivedOtherImagesList()}</span></p>
                    }
                    {this.props.version.preface.length > 0 &&
                        <div className="Version_html">
                            <p className="Version_property">Preface:</p>
                            <span>{ReactHtmlParser(this.props.version.preface)}</span>
                        </div>
                    }
                    <div className="Version_html">
                        <p className="Version_property">Body:</p>
                        <span>{ReactHtmlParser(this.props.version.body)}</span>
                    </div>

                    {this.props.restore &&
                        <div>
                            <div className="u-div"></div>
                            <button 
                                className="StyledButton"
                                onClick={this.restore.bind(this)}
                            >Restore</button>
                            <p
                                style={{ color: "#790101"}}
                                className={!this.state.restoreError ? 'u-hidden': 'u-inline-block'}
                            >Error Restoring.</p>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Version);