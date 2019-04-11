import React from 'react';
import { Link } from 'react-router-dom';

import SearchResult from './components/SearchResult';
import Version from './components/Version';

import * as consts from './consts';

export function categorySelectOptions() {
    let categories = [];
    for (let key in consts.CATEGORIES) {
        if (!consts.CATEGORIES.hasOwnProperty(key)) continue;
        categories.push(<option value={key}>{key.toUpperCase()}</option>);
    }
    return categories;
}

export function subcategorySelectOptions(category) {
    if (!category.length || !consts.CATEGORIES.hasOwnProperty(category)) return;
    let subcategories = [];
    
    consts.CATEGORIES[category].forEach(sub => {
        subcategories.push(<option value={sub}>{sub.toUpperCase()}</option>);
    });

    return subcategories;
}

export function generatePageId(title) {
    return title.trim().replace(/\s+/g, '_');
}

export function generateDetailsTable(details) {
    let detailsArray = [];
    details.forEach(detail => {
        detailsArray.push(
            <li>
                <span>{detail.label}:</span>
                <span><Link to={"/view/" + detail.value}>{detail.value}</Link></span>
            </li>
            ); 
    });
    return <ul className="Details">{detailsArray}</ul>;
}

export function generateCategoryListing() {
    let listingsArray = [];
    for (let key in consts.CATEGORIES) {
        if (!consts.CATEGORIES.hasOwnProperty(key)) continue;
        listingsArray.push(
            <li className="Listing_category">
                <Link to={"/list/category/" + key}>{key}</Link>
            </li>
           
        );
        consts.CATEGORIES[key].forEach(subcategory => {
            listingsArray.push(      
                <li className="Listing_subcategory">-&nbsp;
                    <Link to={"/list/subcategory/" + subcategory}>{subcategory}</Link>
                </li>
            );
        });
    }
    return <div className="Listing">
                <p className="f-title">Categories</p>
                <ul>
                    {listingsArray}
                </ul>
            </div>;
}
export function generatePageList(list=[], title="") {
    let pageList = [];
    list.map(page => {
        pageList.push(<SearchResult page={page} />)
    });

    if (!pageList.length) return;

    return <div>
                {title.length > 0 &&
                    <p className="f-title">{title}</p>
                }
                {pageList}
            </div>;
}

export function generatePrefacePreview(preface) {
    let text = "";
    const div = document.createElement("div");
    div.innerHTML = preface;
    const paragraphs = div.getElementsByTagName('p');
    for (let p of paragraphs) {
        const trimmed = p.innerText.trim();
        if (trimmed.length) {
            text = text + p.innerText + (trimmed[trimmed.length-1] !== "." ? '.' : '') + " ";
        }
    }
    text = text.substr(0,299) + (text.length > 300 ? '...' : '');

    return text;
}

export function generateVersionHistory(history) {
    if (history === null) return;

    let historyArray = [];

    history.forEach(version => {
        historyArray.push(<Version version={version} restore={true} />);
    });

    return <div>{historyArray}</div>
}