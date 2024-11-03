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

for(var i = 0; i < numRows; i++) {
    let s = statementJson[i]
    inner += `<div class="demo-row">
                <div class="demo-column-index">${i + 1}</div>
                <div class="demo-column-statement">${s.statement}</div>
                <div class="demo-column-img"><img src="/blazon-docs/assets/example_programs/${table}/blazon_as_image-${i + 1}.png"></div>
                <div class="demo-column-pseudocode">${s.pseudocode}${getChargeEvaluationTable(s.charges)}</div>
                <div class="demo-column-state">${s.state === undefined ? "-" : s.state}</div>
                <div class="demo-column-notes">${s.notes === undefined ? "-" : s.notes}</div>
            </div> `;
}

newelem.innerHTML = `<div class="demo-table">${inner}</div>`;
oldelem.parentNode.replaceChild(newelem,oldelem);