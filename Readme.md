# About
I was searching for a local wikipedia-style software but was unable to find one that ticked all the boxes of my overly-particular criteria. I wanted it to be easy to setup and run from any computer, and even to allow it to be run when stored on cloud storage services such as Dropbox and Google Drive. LocalWiki was originally made using an Express API to serve the flat file JSON files, but this required two processes running in the background whenever it was launched: the express server and the client http server. 

I got rid of the Express Server and, after making the required changes, bundled it up into Electron to allow it to run natively anywhere - including cloud storage. There is still a lot to refactor as it was all written on the fly.

Currently only available on Windows.

# Setup
1) Run `npm install`
2) Customise 'consts.js' `.CATEGORIES` properties to your liking. *(I have purposefully made them fixed to suit my needs).*
3) Customise 'templates.js' `.predefined` property to your liking.
4) Run `npm run packager`
5) Open `/LocalWiki-win32-x64/LocalWiki.exe` and create your first page!

**NOTE:** `/LocalWiki-win32-x64/` can be renamed and moved to any directory.

# Built With...
- React
- React Router (HashRouter)
- Webpack
- Electron

# Built Using...
- Quill Editor
- Fuzzy-Search

# Functionality
- Create, Edit and View Pages
- Create Page By Template (Person, City, Animal, etc.)
- WYSIWYG Editor for Preface & Body (Quill)
- Add auto-generated local links using a "#" prefix
- Drag & Drop Reorder Details Table Elements
- Upload Main Page Image and Unlimited Additional Images
- Search Bar (Fuzzy-Search)
- List Pages by Category or Subcategory
- Automatic Archiving of Page on Save
- Restore any previous version of a page, even when it's been deleted

# TODO
- Refactor React Components (Particularly Edit.js!)
- Restyle "Create Page" template dropdown
- Make Search Results absolute to float over page content
- Standardise variable & function names
- Allow for varied template property text case