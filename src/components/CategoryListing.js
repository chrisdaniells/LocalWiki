import React from 'react';

import { generateCategoryListing } from '../generate';

export default class CategoryListing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                {generateCategoryListing()}
            </div>
        )
    }
}