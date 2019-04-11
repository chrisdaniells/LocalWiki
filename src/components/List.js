import React from 'react';

import BackButton from './BackButton';

import { getPagesByAttribute } from '../apicli';
import{ generatePageList } from '../generate';

export default class List extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            pages: []
        }
    }

    componentDidMount() {
        const params = this.props.match.params;
        // Get JSON files
        const pages = getPagesByAttribute(params.attribute, params.value);
            this.setState({ pages });
    }

    render() {
        return(
            <div>
                <div className="List u-card">
                    <div>
                        <BackButton label="Back"/>
                    </div>
                    {this.state.pages.length > 0 &&
                        <div>
                            {generatePageList(this.state.pages, this.props.match.params.value)}
                        </div>
                    }
                    {!this.state.pages.length > 0 &&
                        <p>There are no Pages for this List</p>
                    }
                </div>
            </div> 
        )
    }
}