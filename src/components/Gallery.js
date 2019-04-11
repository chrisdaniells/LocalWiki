import React from 'react';
import { Link } from 'react-router-dom';

import * as consts from '../consts';

export default class Gallery extends React.Component {
    constructor(props) {
        super(props);
    }

    generateGallery() {
        let galleryImages = [];
        this.props.images.forEach(image => {
            const path = "/image/?i=" + image + (this.props.id ? "&id=" + this.props.id : "") + (this.props.from ? "&from=" + this.props.from : "");
            galleryImages.push(
                <li>
                    <Link to={path}>
                        <img src={consts.IMGS + image} />
                    </Link>
                </li>
            );
        });
        return (
            <div className="Gallery">
                <span>Image Gallery</span>
                <ul>{galleryImages}</ul>
            </div>
        );
    }

    render() {
        return(
            <div>
                {this.generateGallery()}
            </div>
        )
    }
}