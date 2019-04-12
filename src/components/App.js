import React from 'react';

import CategoryListing from './CategoryListing';
import ToggleList from './ToggleList';
import SearchBar from './SearchBar';
import CreatePageButton from './CreatePageButton';

import * as apicli from '../apicli';

export default class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            pages: [],
            recentPages: []
        }
    }

    componentDidMount() {
        // Get JSON files
        const pages = apicli.getAllPages();

        const recentPages = pages.sort(function(obj1, obj2){
            if (obj1.last_updated > obj2.last_updated) return -1;
            else if (obj1.last_updated < obj2.last_updated) return +1;
            else return 0;
        }).slice(0, 5);
        
        this.setState({ pages, recentPages });
    }

    render() {
        return(
            <div style={{ position: "relative" }}>
                <div className="u-card">
                    Welcome to Heruvia Encyclopedia. This online resource has been created to archive and organise all known information about the Heruvian Saga. 
                </div>
                <div className="u-card" style={{ position: "absolute", width: "100%", zIndex: "998" }}>
                    <SearchBar hidePreface={false}/>
                </div>
                
                <div className="u-div"></div>
                
                <div style={{ textAlign: "right" }}>
                    <CreatePageButton />
                </div>

                <div className="u-div"></div>
                
                {this.state.pages.length > 0 &&
                    <div>
                        <ToggleList
                            header="View Recently Updated Pages"
                            pages={this.state.recentPages} 
                        />
                        <ToggleList
                            header="View All Pages"
                            pages={this.state.pages} 
                        />
                        <div className="u-div"></div>
                    </div>
                }

                <div className="u-card">
                    <CategoryListing />
                </div>
            </div> 
        )
    }
}