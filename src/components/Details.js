import React from 'react';

import { generateDetailsTable } from '../generate';

export default class Details extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                {generateDetailsTable(this.props.details)}
            </div>
        )
    }
}