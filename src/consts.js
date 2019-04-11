
const path = window.require('path');

export const PAGE_PATH = path.normalize(path.resolve(__dirname, 'json/pages')) + "\\";
export const ARCHIVE_PATH = path.normalize(path.resolve(__dirname, 'json/archive/pages')) + "\\";
export const IMGS =  path.normalize(path.resolve(__dirname,'images')) + "\\";
export const THUMBS = IMGS + 'thumbnails';

export const CATEGORIES = {
    category1 : [  // parent category title
        "biographies", // child subcategory title
        "linguistics",
        "theology"
    ],
    category2: [
        "architecture",
        "clothing",
        "food and drink",
    ],

};