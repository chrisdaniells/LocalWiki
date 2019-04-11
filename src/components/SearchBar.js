import React from 'react';
import FuzzySearch from 'fuzzy-search';

import SearchResult from './SearchResult';

import { getAllPages } from '../apicli';

export default class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: null,
            searchTerm: "",
            searchResults: null
        }
    }

    componentDidMount() {
        if (this.state.pages == null) {
            const pages = getAllPages();
            this.setState({
                pages,
                searchTerm: ""
            }, () => {
                this.searcher = new FuzzySearch(this.state.pages, ['title'], {sort: true});
            });
        }
    }

    onInput(e) {
        const value = e.currentTarget.value;
        
        let result = null;
        if (value.length >= 2) {
            result = this.searcher.search(value).slice(0,4);
        }

        this.setState({
            searchTerm: value,
            searchResults: result
        });
    }

    generateSearchResults() {
        let resultArray = [];
        this.state.searchResults.forEach(result => {
            resultArray.push(<li><SearchResult page={result} hidePreface={this.props.hidePreface}/></li>);
        });
        return resultArray;
    }

    render() {
        return(
            <div>
                {this.state.pages &&
                    <div className="SearchBar">
                        <input 
                            type="text"
                            className="SearchBar_Input StyledInput"
                            value={this.state.searchTerm}
                            onChange={this.onInput.bind(this)}
                            placeholder="Search"
                        />
                        {this.state.searchResults !== null &&
                            <ul className="SearchBar_Results">
                                {this.generateSearchResults()}
                            </ul>
                        }
                        {(this.state.searchTerm.length > 2 && this.state.searchResults == null) &&
                            <p>No Results</p>
                        }
                    </div>
                }
            </div>


        )
    }
}