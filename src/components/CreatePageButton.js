import React from 'react';
import { Link } from 'react-router-dom';

import * as templates from '../templates';

export default class CratePageButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
          this.setState({ show: false });
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
            <div className="CreatePageButton" ref={this.setWrapperRef}>
                <Link to={"/edit/" + (this.props.create ? "?create=" + this.props.create : "")}><button className="StyledButton">Create Page</button></Link>
                <button className="CreatePageButton_Arrow StyledButton" onClick={this.showList.bind(this)}>V</button>
                <div className={"CreatePageButton_Dropdown" + (!this.state.show ? " u-hidden" : "")}>
                    {this.generateTemplateList()}
                </div>
            </div>
        )
    }
}