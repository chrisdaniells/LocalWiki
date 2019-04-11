import React from 'react';
import queryString from 'query-string';

import BackButton from './BackButton';

import { getPageById } from '../apicli';
import * as consts from '../consts';

export default class ImageViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: false,
            image: "",
            gallery: false,
            from: false
        }
    }

    componentDidMount() {
        if (this.props.location.search.length) {
            let parsed = queryString.parse(this.props.location.search);

            if (parsed.id) {
                this.getImagesById(parsed.id, parsed.i);
            } else if (parsed.i) {
                this.setState({ image: parsed.i });
            } 

            if (parsed.from) {
                this.setState({
                    from: parsed.from
                });
            }
        }
    }

    getImagesById(id, selectedImage) {
        const page = getPageById(id);
        this.setState({
            id: page.id,
            gallery: page.images.other.length > 1 ? page.images.other : false,
            image: selectedImage
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props == prevProps || !this.state.id) return;

        if (this.props.location.search.length) {
            let parsed = queryString.parse(this.props.location.search);
            if (parsed.i) {
                this.setState({ image: parsed.i });
            } 
        }

    }

    handleGalleryLoop(e) {
        const target = e.currentTarget;
        const state = {...this.state};
        let newSelectedImageKey = 0;
        const i = this.state.gallery.indexOf(this.state.image);

        switch (target.dataset.type) {
            case "prev":
                    // If "i" is first element in array, go to the last element
                    if (i == 0) {
                        newSelectedImageKey = state.gallery.length-1;
                    } else {
                        newSelectedImageKey = i-1;
                    }
                break;
            case "next":
                    // If "i" is last element in array, go to the first element
                    if (i == state.gallery.length-1) {
                        newSelectedImageKey = 0;
                    } else {
                        newSelectedImageKey = i+1;
                    }
                break;
        }

        let parsed = queryString.parse(this.props.location.search);
        parsed.i = state.gallery[newSelectedImageKey];
        
        this.props.history.push({
            search: "?" + queryString.stringify(parsed)
        });
    }

    render() {
        return(
            <div className="Page u-card">
                {this.state.image &&
                    <div className="ImageViewer">
                        <BackButton 
                            label="Back"
                            override={this.state.from}
                        />
                        {this.state.gallery &&
                            <div>
                                <button 
                                    className="StyledButton"
                                    style={{
                                        marginRight: "20px"
                                    }}
                                    data-type="prev"
                                    onClick={this.handleGalleryLoop.bind(this)}
                                >Previous
                                </button>
                                <button 
                                    className="StyledButton"
                                    data-type="next"
                                    onClick={this.handleGalleryLoop.bind(this)}
                                >Next
                                </button>
                                <div className="u-div"></div>
                            </div>
                        }
                        <img src={consts.IMGS + this.state.image} />
                    </div>
                }
                {!this.state.image && 
                    <p>Image Not Found</p>
                }
            </div>
        )
    }
}