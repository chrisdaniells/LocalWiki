import React from 'react';

import { generatePageList } from '../generate';

export default class ToggleList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    handleClickHeader() {
        const show = !this.state.show;
        this.setState({ show });
    }

    render() {
        return (
            <div className={"ToggleList u-card-x-padding" + (this.state.show ? " u-hovered-card u-hovered-text" : " u-hover-card u-hover-text")}>
                <span 
                    className="ToggleList_header"
                    onClick={this.handleClickHeader.bind(this)}
                >{this.props.header}</span>
                <div className={"ToggleList_list" + (!this.state.show ? ' u-hidden' : '')}>
                    {this.props.pages.length > 0 &&
                        generatePageList(this.props.pages)
                    }
                        
                </div>
            </div>
        )
    }
}