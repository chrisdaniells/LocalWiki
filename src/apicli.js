import * as api from './api';

export function getAllPages() {
    return api.getFiles();
}

export function getPageById(id) {
    if (!id) return false;

    const res = api.getFileById(id);

    if (res) return res;
    return false;
}

export function getPagesByAttribute(attribute, value) {
    if (!attribute || !value) return false;

    return api.getFilesByAttribute(attribute, value);
}

export function deletePageById(id) {
    if (!id) return false;

    const res = api.deleteFileById(id);
    if (res) return true;
    return false;
}

export function updatePageById(id, data) {
    if (!id || !data) return false;

    const res = api.updateFileById(id, data);
    if (res) return true;
    return false;
}

export function checkPageIdExists(id) {
    if (!id) return false;

    const res = api.getFileById(id);

    if (res) return true;
    return false;
}

export function uploadFiles(data) {
    if (!data.length) return false;

    const res = api.uploadImages(data);
    if (res.length) return res;
    return false;
}

export function getVersionHistory(id) {
    if(!id) return false;

    const res = api.getArchive(id);
    if (res) return res;
    return false;
}