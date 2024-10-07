var oldelem = document.querySelector('script#replace_with_charge_table');

let newelem = document.createElement("div");
newelem.id = "charge-table";
newelem.innerHTML += `<div class="row header">
                <div class="ex-img">Image</div>
                <div class="name">Name</div>
                <div class="options">Options</div>
                <div class="value">Value</div>
                <div class="usage">Usage</div>
            </div>`

const charges = await fetch("/blazon-docs/design/charge_table.json")
    .then((res) => res.text())
    .then((text) => {
        return text;
})

const chargeJson = JSON.parse(charges);
const numRows = chargeJson.length;

for(var i = 0; i < numRows; i++) {
    const rowData = chargeJson[i]

    var usageOverridesFormatted = "";
    if(rowData.UsageOverride !== undefined){
        for(var u = 0; u < rowData.UsageOverride.length; u++) {
            usageOverridesFormatted += `<p>${rowData.UsageOverride[u]}</p>`;
        } 
    } 

    var charValue = null;
    if(rowData.Value > 9 && rowData.Value < 1000){
        if(rowData.Value == 10){
            charValue = "Newline"
        } else if (rowData.Value == 32) {
            charValue = "Space"
        } else {
            charValue = String.fromCharCode(rowData.Value)
        }
    }
    
    
    newelem.innerHTML += `<div id="${rowData.ImgName}" class="row">
                <div class="ex-img">
                    <img src="/blazon-docs/assets/charge_chart/${rowData.ImgName}.png">
                </div>
                <div class="name">${rowData.DisplayName}</div>
                <div class="options">
                    <p><span>Specify Charge Tincture: </span>${rowData.SpecifyTincture ? "Yes" : "No"}</p>
                    <p><span>Supported Quantities: </span>${rowData.SupportQuantities ? "1-3" : "1"}</p>
                </div>
                <div class="value">
                    <p><span>Integer: </span>${rowData.Value}</p>
                    ${charValue ? `<p><span>Character: </span>${charValue}</p>` : ""}
                </div>
                <div class="usage">
                    ${
                        rowData.UsageOverride ? usageOverridesFormatted : 
                        `<p>Gules, ${rowData.NoArticle ? "" : "a "}${rowData.DisplayName.toLowerCase()}${rowData.SpecifyTincture ? " or" : ""}.</p>
                        ${rowData.SupportQuantities ?
                         `<p>Argent, three ${rowData.PluralName? rowData.PluralName.toLowerCase() : rowData.DisplayName.toLowerCase() + "s"}${rowData.SpecifyTincture ? " sable" : ""}.</p>`
                         : ""}`
                    }
                </div>
            </div>`
}

newelem.innerHTML += `<div id="quarterly_of_eight"  class="row">
                <div class="ex-img">
                    <img src="/blazon-docs/assets/charge_chart/quarterly_of_eight.png">
                </div>
                <div class="name">Quarterly of Eight</div>
                <div class="options">
                    <p><span>Specify Charge Tincture: </span>Specify 8 tinctures, representing an 8-bit positive integer. 
                        Metals = 1, Colors = 2. The field wil be completely covered and the specified field tincture will be
                        irrelevant from a visual standpoint.</p>
                    <p><span>Supported Quantities: </span>1</p>
                </div>
                <div class="value">
                    <p><span>Integer: </span>0-255</p>
                    <p><span>Character: </span>Many possible</p>
                </div>
                <div class="usage">
                    <p>Gules, quarterly of eight: sable, or, gules, sable, or, gules, sable, or.</p>
                </div>
            </div>`


oldelem.parentNode.replaceChild(newelem,oldelem);

if(window.location.href.includes("#")){
    // a very hacky soft reload so that the targeted div will get the right css
    // send me to computer jail for this one
    window.location.href = window.location.href
}