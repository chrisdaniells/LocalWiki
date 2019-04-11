/* Do not edit .page */
export const page = {
    id: "",
    url: "",
    title: "",
    category: "",
    subcategory: "",
    images: {
        main: "",
        other: []
    },
    details: [],
    body: "",
    preface: "",
    date_created: "",
    last_updated: ""
}

/* Can be edited */
export const predefined = [
    /* Template Categories and Subcategories must match ones defined
       in consts.js. If not, they will not be included as part of the
       pre-populated fields when creating a new page */
    {
        name: "Example Person", // Template Name
        category: "category1", // Category (must be lower case)
        subcategory: "biographies", // Sub Category (must be lower case)
        details: [
            { label: "Date of Birth", value: "" },
            { label: "Place of Birth", value: "" },
            { label: "Occupations", value: "" },
            { label: "Parents", value: "" },
            { label: "Relatives", value: "" },
            { label: "Height", value: "" },
            { label: "Build", value: "" },
            { label: "Eye Colour", value: "" }
        ],
        body: "<h1>Early Life</h1><h1>Personal Life</h1>", // Body in simple HTML. Must adhere to Quill Editor.
    },
    {
        name: "Example City",
        category: "geography",
        subcategory: "cities",
        details: [
            { label: "Region", value: "" },
            { label: "Founded", value: "" },
            { label: "Government", value: "" },
            { label: "Government Type", value: "" },
            { label: "Population", value: "" },
            { label: "Size", value: "" }
        ],
        body: "<h1>History</h1><h2>Early History</2><h1>Geography</h1><h2>Climate</h2><h1>Demography</h1><h1>Economy</h1><h1>Transport</h1><h1>Culture</h1>",
    }
]