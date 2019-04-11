const fs = window.require('fs');
const path = window.require('path');

const consts = require('./consts');

export function getFiles() {
    let pages = [];

    fs.readdirSync(consts.PAGE_PATH, {withFileTypes: true}).forEach(file => {
        if (path.extname(file.name).toLowerCase() == '.json') {
            const data = JSON.parse(fs.readFileSync(consts.PAGE_PATH + file.name));
            pages.push(data);
        }
    });

    return pages;
}

export function getFileById(id, filepath = consts.PAGE_PATH) {
    if (!id) return false;
    const files = fs.readdirSync(filepath, {withFileTypes: true});
    let data = null;

    files.forEach(file => {
        if (path.extname(file.name).toLowerCase() == '.json' && path.basename(file.name, '.json').toLowerCase() == id.toLowerCase()) {
            data = JSON.parse(fs.readFileSync(filepath + file.name, 'utf8'));
        }
    });

    if (data === null) {
        return false;
    }

    console.log("Retreived " + id + ".json");

    return data;
}

export function getFilesByAttribute(attribute, value) {
    let pages = [];

    fs.readdirSync(consts.PAGE_PATH, {withFileTypes: true}).forEach(file => {
        if (path.extname(file.name).toLowerCase() == '.json') {
            const obj = JSON.parse(fs.readFileSync(consts.PAGE_PATH + file.name));
            pages.push(obj);
        }
    });

    return pages.filter(file => {
        if(file.hasOwnProperty(attribute)){
            return file[attribute] === value.toLowerCase();
        }
    });
}

export function deleteFileById(id) {
    if (!id) return false;
    const fileToDelete = consts.PAGE_PATH + id + '.json';
    const fileToArchive = consts.ARCHIVE_PATH + id + '-' + Date.now() + '.json';

    if (!fs.existsSync(fileToDelete)) {
        console.log("ALERT: Delete file requested, no file found: ", fileToDelete);
        return false;
    } else {
        deleteFile(fileToDelete);

        if (fs.existsSync(fileToDelete)) {
            console.log("ERROR: File failed to delete: ", fileToDelete);
            return false;
        }

        return true;
    }
}

export function updateFileById(id, data) {
    if (!id || !data) return false;
    const newTitle = data.title !== id;

    let fileToUpdate = consts.PAGE_PATH + id + '.json';

    if (fs.existsSync(fileToUpdate)) {
        deleteFile(fileToUpdate);

        if (fs.existsSync(fileToUpdate)) {
            console.log("ERROR: File failed to Delete during Update: ", fileToUpdate)
            return false;
        }
    }

    if (newTitle) {
        fileToUpdate = consts.PAGE_PATH + data.url + '.json';
        data.id = data.url;
    }

    fs.writeFileSync(fileToUpdate, JSON.stringify(data));

    archiveFile(data);

    return true;
}

function archiveFile(data) {
    // Path of Archive File
    const filePath = consts.ARCHIVE_PATH + data.id + '.json';
    // Existing Archive File
    let archiveData = [];

    if (fs.existsSync(filePath)) {
        const currentData = getFileById(data.id, consts.ARCHIVE_PATH);
        if (currentData) archiveData = currentData;
    }
    archiveData.push(data);
    
    fs.writeFileSync(filePath, JSON.stringify(archiveData));
    

    if (!fs.existsSync(filePath)) {
        console.log("ERROR: File failed to Archive during Update: ", filePath)
        return false;
    }

    console.log("File Archived: :" + filePath);
    return true;
}

function deleteFile(file) {
    fs.unlinkSync(file)
}

export function getArchive(id) {
    if (!id) return false;
    const files = fs.readdirSync(consts.ARCHIVE_PATH, {withFileTypes: true});
    let data = null;

    files.forEach(file => {
        if (path.extname(file.name).toLowerCase() == '.json' && path.basename(file.name, '.json').toLowerCase() == id.toLowerCase()) {
            data = JSON.parse(fs.readFileSync(consts.ARCHIVE_PATH + file.name, 'utf8'));
        }
    });

    if (data === null) {
        return false;
    }

    console.log("Retreived Version History Archive for " + id + ".json");

    return data;
}

export function uploadImages(images) {
    let filenames = [];
    images.forEach(image => {
        const base = path.basename(image);
        const ext = path.extname(base);
        const filename = base + "-" + Date.now() + ext;
        filenames.push(filename);
        fs.copyFileSync(image, consts.IMGS + filename);
    });

    return filenames;
}