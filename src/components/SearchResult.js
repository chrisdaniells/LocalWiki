import React from 'react';
import { Link } from 'react-router-dom';

import { IMGS } from '../consts';
import { generatePrefacePreview } from '../generate'

export default class SearchResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Link className="SearchResult" to={"/view/" + this.props.page.url}>
                <div className="SearchResult_ImageContainer">
                    {this.props.page.images.main.length > 0 &&
                        <img 
                            src={IMGS + this.props.page.images.main} 
                            className="image-confine"
                        />
                    }
                    </div>            
                <div className="SearchResult_wrapper">
                    <p className="SearchResult_title">{this.props.page.title}</p>
                    {(this.props.page.preface.length && !this.props.hidePreface) > 0 &&
                        <p className="SearchResult_preface">{generatePrefacePreview(this.props.page.preface)}</p>
                    }
                </div>
                <div class="u-clear"></div>
            </Link>
        )
    }
}