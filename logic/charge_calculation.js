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

for(var i = 0; i < 9; i++){
    var oldelem = document.querySelector(`script#charge-evaluation-script-${i}`);
    
    if(oldelem == null){
        continue;
    }

    let newelem = document.createElement("div");
    newelem.id= `charge-evaluation-table-${i}`;
    newelem.className = `charge-evaluation-table`
    newelem.innerHTML += `<div class="row header">
                    <div class="charge">Charge</div>
                    <div class="value">Value</div>
                    <div class="quantity">Quantity</div>
                    <div class="result">Result</div>
                </div>`
    
    for(var row = 0; row < 5; row++){
        var curCharge = oldelem.getAttribute(`data-charge-${row}`)
        var curQuantity = oldelem.getAttribute(`data-quantity-${row}`)

        if(curCharge === "Quarterly of Eight"){
            newelem.innerHTML += `<div class="row">
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

            newelem.innerHTML += `<div class="row">
                    <div class="charge">
                        <a href="/blazon-docs/design/charges#${info.curLink}" target="_blank">${curCharge}</a>
                    </div>
                    <div class="value">${info.curValue}</div>
                    <div class="quantity">^ ${curQuantity}</div>
                    <div class="result">= ${curResult}</div>
                </div>`
        }
    }
    
    
    
    oldelem.parentNode.replaceChild(newelem,oldelem);
}
