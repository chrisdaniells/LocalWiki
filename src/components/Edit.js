import React from 'react';
const { dialog } = require('electron').remote;

import BodyEditor, { Quill } from 'react-quill';
import queryString from 'query-string';

import BackButton from './BackButton';

import * as apicli from '../apicli';
import * as jsontemplates from '../templates';
import * as consts from '../consts';
import { 
    generatePageId, 
    categorySelectOptions, 
    subcategorySelectOptions
} from '../generate';

export default class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id || "",
            page: null,
            showError: false,
            errorMsg: [],
            loading: false,
            selectedFiles: {
                main: null,
                other: null
            }
        }

        this.onChangeInput = this.onChangeInput.bind(this);
    }

    componentDidMount() {
        // Add event list for Ctrl + S
        document.addEventListener('keydown', this.keydownHandler.bind(this));

        // If Loading Existing Page
        if (this.state.id.length) {
            this.setState({ page : apicli.getPageById(this.state.id) });
        } else {
            // New Page
            let page = {...jsontemplates.page};
            // If "create" instruciton passed, prefill title & id
            if (this.props.location.search.length) {
                let parsed = queryString.parse(this.props.location.search);
                if (parsed.create) {
                    page.title = parsed.create;
                    page.id = generatePageId(page.title);
                }
                if (parsed.template) {
                    let template = jsontemplates.predefined.find(tmp => {
                        return tmp.name.toLowerCase() == parsed.template.toLowerCase();
                    });
                    if (!template) return;
                    if (template.category && consts.CATEGORIES[template.category]) { page.category = template.category };
                    if (template.subcategory 
                        && consts.CATEGORIES[template.category]
                        && consts.CATEGORIES[template.category].includes(template.subcategory)) { page.subcategory = template.subcategory };
                    if (template.details) page.details = template.details;
                    if (template.body) page.body = template.body;
                }
            }
            this.setState({ 
                id: page.id,
                page
             });
        }
  
        this.sanitizeQuill();
    }

    componentWillUnmount(){
        document.removeEventListener('keydown', this.keydownHandler);
    }

    keydownHandler(e){
        if (!(e.key === 's' && e.ctrlKey)) return true;
        e.preventDefault();
        // If Ctrl+S, trigger onClickSave()
        this.onClickSave();
        e.preventDefault()
        return false;
    }

    sanitizeQuill() {
        const QuillLink = class QuillLink extends Quill.import('formats/link') {
            static create(value) {
                let node = super.create(value);
                value = this.sanitize(value);
                node.setAttribute('href', value);
                if(value.startsWith("#")) {
                    node.removeAttribute('target');
                  }
                return node;
            }
            static sanitize(url) {
                if (url[0] == "#") { 
                    url = url.replace("#", "");
                    url = url.replace("/view/", "");
                    url = "#/view/" + generatePageId(url);
                };
                return url;
            }
        };

        Quill.register(QuillLink);
    }

    generateImageOtherThumbnails() {
        let images = [];
        this.state.page.images.other.map((img, index) => {
            images.push(
                <li>
                    <img 
                        src={consts.IMGS + img} 
                        className="image-confine"
                    />
                    <span 
                        className="remove_link"
                        onClick={() => this.onClickRemoveImage(index)}
                    >Remove</span>
                </li>
            );
        });

        return <ul className="Edit_OtherImagesPreview">{images}</ul>;
    }

    generateDetailsInputs() {
        let details = []

        this.state.page.details.map((detail, index) => {
            details.push(
                <div className="Edit_DetailsPair" 
                    onDragStart={e => this.onDetailDrag(e, index)} 
                    onDragOver={(e) => this.onDetailDragOver(e, index)}
                    onDrop={this.onDetailDragEnd.bind(this)}
                    draggable
                >
                    <input 
                        type="text"
                        data-type="detailLabel"
                        data-index={index}
                        className="StyledInput"
                        onChange={this.onChangeInput}
                        value={detail.label}
                    />
                    <input 
                        type="text" 
                        data-type="detailValue"
                        data-index={index}
                        className="StyledInput"
                        onChange={this.onChangeInput}
                        value={detail.value}
                    />

                    <div className="u-clear"></div>
                    <span className="remove_link" onClick={() => this.onClickRemoveDetail(index)}>Remove</span>
                </div>
            );
        });

        return details;
    }
    onDetailDrag(e, index) {
        e.dataTransfer.setData("index", index);
        e.dataTransfer.effectAllowed = "move";

        this.draggedItem = index;
    }

    onDetailDragOver(e, index) {
        e.preventDefault();
        if (this.draggedItem == index) return;

        this.dropPosition = index;
    }

    onDetailDragEnd() {
        let details = this.state.page.details.filter((detail, index) => {
            return index !== this.draggedItem;
        });
        
        details.splice(this.dropPosition, 0, this.state.page.details[this.draggedItem]);

        let page = {...this.state.page};
        page.details = details;
        this.setState({
            page
        });
    }

    onChangeInput(e) {
        const target = e.currentTarget;
        let page = {...this.state.page};
        let selectedFiles = {...this.state.selectedFiles};

        switch(target.dataset.type) {
            case "category":
                page.category = target.value;
                page.subcategory = "";
                break;
            case "subcategory":
                page.subcategory = target.value;
                break;
            case "imageMain":
                selectedFiles.main = target.files[0];
                break;
            case "imageMain":
                selectedFiles.other = target.files;
                break;
            case "image":
                page.images.other[target.dataset.index] = target.value;
                break;
            case "detailLabel":
                page.details[target.dataset.index].label = target.value;
                break;
            case "detailValue":
                page.details[target.dataset.index].value = target.value;
                break;
            default:
                page[target.dataset.type] = target.value;
                break;
        }

        this.setState({ page });
    }

    onChangeBodyEditor(value) {
        let page = {...this.state.page};
        page.body = value;
        this.setState({ page });
    }
    onChangePrefaceEditor(value) {
        let page = {...this.state.page};
        page.preface = value;
        this.setState({ page });
    }

    onClickAddImage() {
        let page = {...this.state.page};
        page.images.other.push("");
        this.setState({ page });
    }

    onClickRemoveMainImage() {
        let page = {...this.state.page};
        page.images.main = "";
        this.setState({ page });
    }

    onClickRemoveImage(index) {
        let page = {...this.state.page};
        page.images.other.splice(index, 1);
        this.setState({ page });
    }

    onClickAddDetail() {
        let page = {...this.state.page};
        page.details.push({ label: "", value: "" });
        this.setState({ page });
    }

    onClickRemoveDetail(index) {
        let page = {...this.state.page};
        page.details.splice(index, 1);
        this.setState({ page });
    }

    selectFiles(e) {
        const target = e.currentTarget;
        const selectedFiles = {...this.state.selectedFiles};

        switch(target.dataset.type) {
            case "imageMain":
            selectedFiles.main = dialog.showOpenDialog({
                    properties: ["openFile"], 
                    filters: [
                        {
                            name: "Images",
                            extensions: ["jpg", "jpeg", "png"]
                        }
                    ]
                });
                break;
            case "imageOther":
            selectedFiles.other = dialog.showOpenDialog({
                    properties: ["openFile", "multiSelections"], 
                    filters: [
                        {
                            name: "Images",
                            extensions: ["jpg", "jpeg", "png"]
                        }
                    ]
                });
                break;
        }
        this.setState({ selectedFiles });
    }

    uploadImage(e) {
        const target = e.currentTarget;
        const state = {...this.state};
        let files = [];

        switch(target.dataset.type) {
            case "imageMain":
                if (this.state.selectedFiles.main === null) return;
                files = state.selectedFiles.main;
                break;
            case "imageOther":
                if (this.state.selectedFiles.other === null) return;
                files = state.selectedFiles.other;
                break;
        }

        this.setState({ loading: true });
        document.body.classList.add("is-loading");

        const upload = apicli.uploadFiles(files);

        if (upload) {
            let page = {...this.state.page};
            let selectedFiles = {...this.state.selectedFiles};
            switch(target.dataset.type) {
                case "imageMain":
                    page.images.main = upload;
                    selectedFiles.main =  null;
                    break;
                case "imageOther":
                    page.images.other = page.images.other.concat(upload);
                    selectedFiles.other = null;
                    break;
            }

            this.setState({
                loading: false,
                page,
                selectedFiles
            });
            document.body.classList.remove("is-loading");
        } else {
            this.setState({ 
                errorMsg: [<p>Image(s) Failed to Upload</p>],
                showError: true
            });
            setTimeout(() => {
                this.setState({ showError: false });
            }, 3000);
        }
    }

    onClickSave() {
        let resetDateCreatedOnFail = false;

        const validateMessages = this.validateSave();
        if (!validateMessages.length) {
            let page = {...this.state.page};
            // If no ID, set one
            if (!this.state.id.length) {
                page.id = generatePageId(this.state.page.title).trim();
            }
            // Remove Empty Details Fields (requires both key pairs to be populated)
            page.details = page.details.map(detail => {
                if (detail.label.length > 0 && detail.value.length > 0)
                    return { label: detail.label.trim(), value: detail.value.trim() }
            });
            // Trim preface
            page.preface = page.preface.trim();
            // Set URL as URL'd Title
            page.url = generatePageId(this.state.page.title);
            // Updated Last Updated
            page.last_updated = new Date().toString();
            // If no creation date set, set one
            if (!page.date_created.length) {
                page.date_created = new Date().toString();
                resetDateCreatedOnFail = true;
            }
            // Update Trimmed Page State & then Save
            this.setState({ page }, () => { this.save(resetDateCreatedOnFail) });
        } else {
            this.setState({ 
                errorMsg: err,
                showError: true
            });
            setTimeout(() => {
                this.setState({ showError: false });
            }, 3000);
        }
    }

    validateSave() {
        let messages = [];
        let checkPageExists = false;
        if (!this.state.page.id.length && this.state.page.title.length) {
            checkPageExists = apicli.checkPageIdExists(generatePageId(this.state.page.title));
        }
        if (checkPageExists) messages.push(<p>A Page with this Title already exists</p>);

        if (!this.state.page.title.length) messages.push(<p>Title Required.</p>);
        if (!this.state.page.category.length) messages.push(<p>Category Required.</p>);
        if (!this.state.page.subcategory.length) messages.push(<p>Subcategory Required.</p>);
        if (!this.state.page.body.length) messages.push(<p>Body Required.</p>);
        if (this.state.selectedFiles.main !== null  && this.state.selectedFiles.other !== null) messages.push(<p>Selected Images have not yet been upload</p>);

        return messages;
    }

    save(resetDateCreatedOnFail) {
        const update = apicli.updatePageById(this.state.page.id, this.state.page);

        if (update) {
            this.props.history.push({
                pathname: '/view/' + this.state.page.url,
                search: '?saved=true'
            });
        } else {
            this.setState({ errorMsg: [<p>Unable to Save Page</p>] });
            this.setState({ showError: true });
            setTimeout(() => {
                this.setState({ showError: false });
            }, 3000);

            if(resetDateCreatedOnFail) {
                let page = {...this.state.page};
                page.date_created = "";
                this.setState({ page });
            }
        }
    }

    onClickDeletePage() {
        let confirm = window.confirm("Are you sure you want to delete this page?");
        if (confirm) {
            apicli.deletePageById(this.state.id);
            this.props.history.push({
                pathname: '/'
            });
            location.reload(true);
        }
    }

    render() {
        const SF = {...this.state.selectedFiles};
        const miLabel = (SF.main !== null ? "Main Image Selected" : "Select Main Image");
        const oiLabel = (SF.other !== null ? SF.other.length + " Other Images Selected" : "Select Other Images");

        return(
            <div className="Edit u-card">
                <div className={"LoadingModal" + (!this.state.loading ? ' u-hidden' : '')}><img src="public/loader.gif" /></div>
                <div className={"Edit_Error" + (!this.state.showError ? ' u-hidden' : '')}>{this.state.errorMsg}</div>

                { this.state.page &&
                    <div>
                        <BackButton label="Cancel" />

                        {/* MAIN */}
                        <div>
                            <label>Title</label>
                            <input 
                                type="text"
                                data-type="title"
                                className="StyledInput"
                                value={this.state.page.title}
                                onChange={this.onChangeInput}
                            />
                            
                            <label>Category</label>
                            <select 
                                data-type="category"
                                className="StyledInput"
                                value={this.state.page.category}
                                onChange={this.onChangeInput}
                            >
                                <option value="">Select Category</option>
                                {categorySelectOptions()}
                            </select>
                            <label>Subcategory</label>
                            <select 
                                data-type="subcategory"
                                className="StyledInput"
                                value={this.state.page.subcategory}
                                onChange={this.onChangeInput}
                            >
                                <option value="">Select Subcategory</option>
                                {subcategorySelectOptions(this.state.page.category)}
                            </select>
                        </div>
                        <div className="u-div"></div>

                        {/* IMAGES */}
                        <div>
                            <label>Main Image</label>
                            {this.state.page.images.main.length > 0 &&
                                <div className="Edit_MainImagePreview">
                                    <img 
                                        src={consts.IMGS + this.state.page.images.main}
                                        className="image-confine"
                                    />
                                    <span 
                                        className="remove_link"
                                        onClick={this.onClickRemoveMainImage.bind(this)}
                                    >Remove</span>
                                </div>
                            }
                            <div 
                                data-type="imageMain"
                                className={"Edit_ImageInput StyledInput" + (SF.main !== null ? " u-border-selected" : "")}
                                id="imageMain"
                                onClick={this.selectFiles.bind(this)}
                            >{miLabel}</div>
                            <button 
                                data-type="imageMain"
                                className="Edit_UploadButton StyledButton"
                                onClick={e => this.uploadImage(e)}
                            >Upload</button>

                            <div className="u-clear"></div>
                            
                            <label>Other Images</label>
                            <div
                                data-type="imageOther"
                                className={"Edit_ImageInput StyledInput" + (SF.other !== null ? " u-border-selected" : "")}
                                id="imageOther"
                                onClick={this.selectFiles.bind(this)}
                                multiple
                            >{oiLabel}</div>
                            <button 
                                data-type="imageOther"
                                className="Edit_UploadButton StyledButton"
                                onClick={e => this.uploadImage(e)}
                            >Upload</button>
                            {this.state.page.images.other.length > 0 &&
                                this.generateImageOtherThumbnails()
                            }
                        </div>
                        <div className="u-div"></div>

                        {/* DETAILS */}
                        <div>
                            <label>Details</label>
                            <div 
                                className="Edit_DetailsContainer"
                            >
                                {this.generateDetailsInputs()}
                            </div>
                            <button 
                                onClick={this.onClickAddDetail.bind(this)}
                                className="StyledButton"
                            >Add Detail</button>
                            <div className="u-div"></div>
                        </div>


                        {/* CONTENT */}
                        <label>Preface</label>
                        <BodyEditor
                            data-type="preface"
                            className="quill-preface"
                            value={this.state.page.preface}
                            onChange={this.onChangePrefaceEditor.bind(this)}
                            modules={{
                                clipboard: {
                                    matchVisual: false,
                                }
                            }}
                            formats={[
                                'bold', 'italic', 'underline', 'strike', 'blockquote', 'indent', 'link', 'image'
                            ]}
                        />
                        <div className="u-div"></div>

                        <label>Body</label>
                        <BodyEditor
                            className="quill-body"
                            data-type="body"
                            value={this.state.page.body}
                            onChange={this.onChangeBodyEditor.bind(this)}
                            modules={{
                                clipboard: {
                                    matchVisual: false,
                                },
                            }}
                        />

                        <button 
                            className="Edit_SaveButton StyledButton" 
                            onClick={this.onClickSave.bind(this)}
                            disabled={this.state.loading}
                        >Save</button>

                        {this.props.match.params.id &&
                            <div>
                                <div className="u-div"></div>
                                <p 
                                    onClick={this.onClickDeletePage.bind(this)}
                                    className="u-cursor u-hover-text"
                                    style={{ display: "inline-block" }}
                                >Delete Page</p>
                            </div>
                        }
                        
                    </div>
                }

                { !this.state.page &&
                    <div>
                        <BackButton label="Back" />
                        
                        <p>No Page Found for this Id</p>
                    </div>
                    }
            </div> 
        )
    }
}

