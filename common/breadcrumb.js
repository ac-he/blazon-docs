
var oldelem = document.querySelector('script#replace_with_breadcrumb');

let newelem = document.createElement("div");
newelem.id = "breadcrumb-container";

let prettyTitle = oldelem.getAttribute("data-pretty-title")

let crumbs = [];
let uri =  document.documentURI
let pathSubstring = uri.substring(uri.lastIndexOf("//") + 2);
pathSubstring = pathSubstring.substring(pathSubstring.indexOf("/") );

// trim trailing '/'
if(pathSubstring[pathSubstring.length - 1] == '/') {
    pathSubstring = pathSubstring.substring(0, pathSubstring.length - 1);
}

// get breadcrumbs
while (pathSubstring.includes("/")){
    console.log(pathSubstring);
    let cd = await fetch("/blazon-docs" + pathSubstring)
    .then((res) => res.text())
    .then((text) => {
        let crumbDoc = new DOMParser().parseFromString(text, 'text/html');
        let crumbTitle = crumbDoc.querySelector('script#replace_with_breadcrumb').getAttribute("data-pretty-title")
        return {'title': crumbTitle, "path": pathSubstring};
    })
    crumbs = [cd, ...crumbs];
    pathSubstring = pathSubstring.substring(0, pathSubstring.lastIndexOf("/") )
};
crumbs = [{'title': "Home", "path": "/blazon-docs/"}, ...crumbs];

var html = "<div id='breadcrumbs'><p>";
for(var i = 0; i < crumbs.length - 1; i++){ // DON'T SUBTRACT 1 HERE TO INCLUDE CUR PAGE IN BREADCRUMB
    html += `<a href='${crumbs[i].path}'>${crumbs[i].title}</a>`;
    if((i) != (crumbs.length - 1)){ // DON'T SUBTRACT 1 HERE TO INCLUDE CUR PAGE IN BREADCRUMB
        html += " ⮚ ";
    }
}
html += "</p></div>"
html += `<h2 id="page-title">${prettyTitle}</h2>`
newelem.innerHTML = html;

oldelem.parentNode.replaceChild(newelem,oldelem);