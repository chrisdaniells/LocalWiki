import React from 'react';
import { Link } from 'react-router-dom';

import * as templates from '../templates';

export default class CratePageButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    generateTemplateList() {
        let templateArray = [];
        templates.predefined.forEach(template => {
            let path = "/edit/";
            path = path + (this.props.create ? "?create=" + this.props.create : "");
            path = path + ((this.props.create ? "&template=" : "?template=" ) + template.name);
            templateArray.push(
                <li>
                    <Link to={path}>{template.name}</Link>
                </li>);
        });
        return <ul>{templateArray}</ul>;
    }

    showList() {
        const state = {...this.state};
        this.setState({
            show: !state.show
        });
    }

    render() {
        return(
            <div className="CreatePageButton">
                <Link to={"/edit/" + (this.props.create ? "?create=" + this.props.create : "")}><button className="StyledButton">Create Page</button></Link>
                <button className="CreatePageButton_Arrow StyledButton" onClick={this.showList.bind(this)}>V</button>
                <div className={"CreatePageButton_Dropdown" + (!this.state.show ? " u-hidden" : "")}>
                    {this.generateTemplateList()}
                </div>
            </div>
        )
    }
}