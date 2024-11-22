var oldelem = document.querySelector('script#replace_with_demo');

let newelem = document.createElement("div");

let table = oldelem.getAttribute("data-table")

let inner = ""
inner += `<div class="demo-header-row">
                <div class="demo-column-index">#</div>
                <div class="demo-column-statement">Statement</div>
                <div class="demo-column-img">Image</div>
                <div class="demo-column-pseudocode">Pseudocode</div>
                <div class="demo-column-state">State</div>
                <div class="demo-column-notes">Notes</div>
            </div>`

const statements = await fetch(`/blazon-docs/getting_started/demos/${table}.json`)
    .then((res) => res.text())
    .then((text) => {
        return text;
})
const statementJson = JSON.parse(statements);
const numRows = statementJson.length;

const charges = await fetch("/blazon-docs/design/charge_table.json")
        .then((res) => res.text())
        .then((text) => {
            return text;
    })
const chargeJson = JSON.parse(charges);
const numJsonRows = chargeJson.length;

function getChargeValue(charge) {
    for(var c = 0; c < numJsonRows; c++){
        const curRow = chargeJson[c];
        if(charge == curRow.DisplayName){
            return {"curValue": curRow.Value, "curLink": curRow.ImgName};
        }
    }
}

function getChargeEvaluationTable(charges) {
    let cet = `<div class="charge-evaluation-table">
                <div class="row header">
                    <div class="charge">Charge</div>
                    <div class="value">Value</div>
                    <div class="quantity">Quantity</div>
                    <div class="result">Result</div>
                </div>`
    for(var c = 0; c < charges.length; c++){
        var curCharge = charges[c].charge
        var curQuantity = charges[c].quantity === undefined ? 1 : charges[c].quantity

        if(curCharge === "Quarterly of Eight"){
            cet += `<div class="row">
                    <div class="charge">
                        <a href="/blazon-docs/design/charges#quarterly_of_eight" target="_blank">${curCharge}</a>
                    </div>
                    <div class="value">${curQuantity}</div>
                    <div class="quantity">in binary</div>
                    <div class="result">= ${curQuantity}</div>
                </div>`
        }else if(curCharge != null && curQuantity != null){
            var info = getChargeValue(curCharge);
            var curResult = Math.pow(info.curValue, Number(curQuantity));

            cet += `<div class="row">
                    <div class="charge">
                        <a href="/blazon-docs/design/charges#${info.curLink}" target="_blank">${curCharge}</a>
                    </div>
                    <div class="value">${info.curValue}</div>
                    <div class="quantity">^ ${curQuantity}</div>
                    <div class="result">= ${curResult}</div>
                </div>`
        }
    }
    cet += `</div>`
    return cet
}

function isMetal(tincture) {
    if(tincture === "or" || tincture === "argent") return true;
    return false;
}

function getCompOp(tincture) {
    switch (tincture) {
        case "argent":
            return `<`;
        case "or":
            return `>`;
        case "sable":
            return `==`;
        case "gules":
            return `!=`;
        case "purpure":
            return `<=`;
        case "azure":
            return `>=`;
        case "vert":
            return `==`;
    }
}

function getArithOp(tincture) {
    switch (tincture) {
        case "argent":
            return `+`;
        case "or":
            return `-`;
        case "sable":
            return `*`;
        case "gules":
            return `/`;
        case "purpure":
            return `%`;
        case "azure":
            return `^`;
        case "vert":
            return `√`;
    }
}

function getDivisionInfo(divisions) {
    let divInfo = ""
    switch(divisions?.div){
        case "Per bend":
            var detail = "character"
            if(isMetal(divisions.tinctures[0])){
                detail = "number"
            }

            divInfo = `<a href='/blazon-docs/logic/output#variable'>Per Bend</a>. 
                        <br>Chief tincture <span class="italic">${divisions.tinctures[0]}</span> ➺ print variable as a ${detail}.`
            break;
        case "Per bend sinister":
            var detail = "character"
            if(isMetal(divisions.tinctures[0])){
                detail = "number"
            }

            divInfo = `<a href='/blazon-docs/logic/output#value'>Per Bend Sinister</a>. 
                        <br>Chief tincture <span class="italic">${divisions.tinctures[0]}</span> ➺ print variable as a ${detail}.`
            break;
        case "Per chevron":
            var detail = "random number"
            if(isMetal(divisions.tinctures[1])){
                detail = "input from user"
            }

            divInfo = `<a href='/blazon-docs/logic/input'>Per Chevron</a>. 
                        <br>Chief tincture <span class="italic">${divisions.tinctures[1]}</span> ➺ get ${detail}.`
            break;
        case "Per cross":
            divInfo = `<a href='/blazon-docs/logic/branching#two-variables'>Quarterly</a>. 
                        <br>Dexter chief tincture <span class="italic">${divisions.tinctures[0]}</span> ➺ branch with ${
                            getCompOp(divisions.tinctures[0])} operator.`
            break;
        case "Per fess":
            divInfo = `<a href='/blazon-docs/logic/variables#from-variable'>Per Fess</a>.`
            break;
        case "Per fess escutcheon":
            divInfo = `<a href='/blazon-docs/logic/arithmetic#two-variables'>Per Fess Escutcheon</a>. 
                        <br>Dexter chief tincture <span class="italic">${divisions.tinctures[2]}</span> ➺ use ${
                            getArithOp(divisions.tinctures[2])} operator.`
            break;
        case "Per pale":
            divInfo = `<a href='/blazon-docs/logic/variables#from-number'>Per Pale</a>.`
            break;
        case "Per pall":
            divInfo = `<a href='/blazon-docs/logic/arithmetic#variable-and-number'>Per Pall</a>. 
                        <br>Dexter chief tincture <span class="italic">${divisions.tinctures[0]}</span> ➺ use ${
                            getArithOp(divisions.tinctures[0])} operator.`
            break;
        case "Per saltire":
            divInfo = `<a href='/blazon-docs/logic/branching#variable-and-number'>Per Saltire</a>. 
                        <br>Chief tincture <span class="italic">${divisions.tinctures[0]}</span> ➺ branch with ${
                            getCompOp(divisions.tinctures[0])} operator.`
            break;
        case "None":
            divInfo = `<a href='/blazon-docs/logic/branching#label'>[No division]</a>.`
            break;
    }
    return `<div class="demo-division">${divInfo}</div>`
}

for(var i = 0; i < numRows; i++) {
    let s = statementJson[i]
    inner += `<div class="demo-row">
                <div class="demo-column-index">${i + 1}</div>
                <div class="demo-column-statement">${s.statement}</div>
                <div class="demo-column-img"><img src="/blazon-docs/assets/example_programs/${table}/blazon_as_image-${i + 1}.png"></div>
                <div class="demo-column-pseudocode">
                    ${s.pseudocode}
                    ${getDivisionInfo(s.divisions)}
                    ${getChargeEvaluationTable(s.charges)}
                </div>
                <div class="demo-column-state">${s.state === undefined ? "-" : s.state}</div>
                <div class="demo-column-notes">${s.notes === undefined ? "-" : s.notes}</div>
            </div> `;
}

newelem.innerHTML = `<div class="demo-table">${inner}</div>`;
oldelem.parentNode.replaceChild(newelem,oldelem);