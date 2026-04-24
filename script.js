const typeTable = document.querySelector(".typeTable");

Object.entries(category).forEach(([typName, typDetail]) => {
    const typBox = document.createElement("div");
    typBox.classList.add("typ");
    typBox.dataset.type = typName;

    typBox.innerHTML = `
    <div class = "colorBox" data-type = "${typName}"></div>
    <div class = "viName">${typDetail.vi}</div>
    `

    typeTable.appendChild(typBox);
})

const periodicTable = document.querySelector(".elements")
const bottomTable = document.querySelector(".bottomElements");

Object.values(elements).forEach(el => {
    const btn = document.createElement("button");
    btn.dataset.type = el.type;
    
    btn.innerHTML = `
    <span class = 'number'>${el.number}</span>
    <span class = 'symbol'>${el.symbol}</span>
    <span class = 'name'>${el.name}</span>
    <span class = 'mass'>${el.mass}</span>
    `;

    btn.style.gridColumn = el.collum;
    btn.style.gridRow = el.row;
    
    if (!((el.number >= 57 && el.number <= 71) || (el.number >= 89 && el.number <= 103))) {
        if (el.type == "actinides") {
            btn.innerHTML = `
            <span class = 'number'>${el.number}</span>
            <span class = 'list'>89 - 103</span>
            <span class = 'name'></span>
            `;
        }
        else if (el.type == "lanthanides") {
            btn.innerHTML = `
            <span class = 'number'>${el.number}</span>
            <span class = 'list'>57 - 71</span>
            <span class = 'name'></span>
            `;
        }

        periodicTable.appendChild(btn);
    }
    else {
        bottomTable.appendChild(btn); 
    }
})

const element = document.querySelectorAll(".elements button, .bottomElements button");

// info box
const infoBox = document.getElementById("infoBox");
const blurBackground = document.getElementById("blurBackground");
const closeButton = document.getElementById("closeButton");

element.forEach(el => {
    el.addEventListener("mouseover", () => {
        el.classList.add("active");
    })

    el.addEventListener("mouseout", () => {
        el.classList.remove("active");
    })

    if (el.querySelector(".name").innerHTML != "") {
        el.addEventListener('click', () => {
            showInfoBox(el.querySelector(".number").innerHTML);
            infoBox.classList.add("active");
            blurBackground.classList.add("active");
        })
    }
    else {
        const eltype = bottomTable.querySelectorAll(`[data-type = "${el.dataset.type}"]`)
        el.addEventListener("mouseover", () => {
            eltype.forEach(t => {
                t.classList.add("active");
            })
        })

        el.addEventListener("mouseout", () => {
            eltype.forEach(t => {
                t.classList.remove("active");
            })
        })
    }
})

const typs = typeTable.querySelectorAll(".typ")

typs.forEach(typ => {
    const eltyp = document.querySelectorAll(`[data-type = "${typ.dataset.type}"]`)

    typ.addEventListener("mouseover", () => {
        eltyp.forEach(el => {
            el.classList.add("active");
        })
    })

    typ.addEventListener("mouseout", () => {
        eltyp.forEach(el => {
            el.classList.remove("active");
        })
    })
})

function showInfoBox (elementId) {  
    const el = elements[elementId];
    
    // header
    const headerBox = infoBox.querySelector('.headerInfo');
    headerBox.dataset.type = el.type;
     
    headerBox.querySelector('.name').textContent = el.name;
    headerBox.querySelector('.symbol').textContent = el.symbol;
    headerBox.querySelector('.number').textContent = `Số hiệu: ${el.number}`;
    headerBox.querySelector('.mass').textContent = `Khối lượng: ${el.mass}`;
    headerBox.querySelector('.group').textContent = `Nhóm: ${period[el.collum]}`;
    headerBox.querySelector('.cycle').textContent = `Chu kì: ${el.row}`;
    headerBox.querySelector('.typeText').textContent = `Họ: ${category[el.type].vi}`;

    // main
    const mainBox = infoBox.querySelector(".mainInfo");

    mainBox.querySelector('.characteristic').innerHTML = `${el.character}`;

    if (el.compuond === undefined || el.compuond.length === 0) {
        mainBox.querySelector(".compuonds").innerHTML = `Không tạo hợp chất`;
    }
    else {
        mainBox.querySelector(".compuonds").innerHTML = el.compuond.map(c => `<span class = 'compuond'>${c}</span>`).join("")
    }

    if (el.reaction === undefined || el.reaction.length === 0) {
        mainBox.querySelector(".reactions").innerHTML = 'Không có phản ứng';
        mainBox.querySelector(".reactionDetails").innerHTML = '';
    }
    else {
        mainBox.querySelector(".reactions").innerHTML = el.reaction.map(r => `<span class = 'reaction'>${r}</span>`).join('');
        mainBox.querySelector(".reactionDetails").innerHTML = el.reaction.map(r => `<span class = 'reactionDetail'>${reactionsDetail[r]}</span>`).join('');
    }

    // element model
    const elementBox = infoBox.querySelector(".elementModel");

    if (el.orbits !== undefined)
        createElementModel(elementBox, el.orbits);
}

function closeInfoBox () {
    blurBackground.classList.remove("active");
    infoBox.classList.remove("active");
}

blurBackground.addEventListener('click', closeInfoBox)
closeButton.addEventListener('click', closeInfoBox)

const type = document.querySelectorAll('.type');

type.forEach(typ => {
    const detailBox = typ.querySelector('.typeDetail');
    
    typ.addEventListener('mouseover', () => {
        const elementType = document.querySelector('.headerInfo').dataset.type;

        detailBox.innerHTML = category[elementType].detail;
        detailBox.classList.add("active");
    })

    typ.addEventListener('mousemove', (e) => {
        detailBox.style.left = (e.clientX + 10) + 'px';
        detailBox.style.top = (e.clientY + 10) + 'px';
    })

    typ.addEventListener('mouseout', () => {
        detailBox.classList.remove("active");
    })
})

const compuondContainer = document.querySelector('.popularCompound');

infoBox.addEventListener('mouseover', () => {
    const compuond = compuondContainer.querySelectorAll('.compuond');
    const compoundDetailBox = compuondContainer.querySelector('.compuondDetail');

    compuond.forEach(com => {
        com.addEventListener("mouseover", () => {
            compoundDetailBox.innerHTML = `${compoundsDetail[com.textContent]}`;
            compoundDetailBox.classList.add('active');
            com.style.backgroundColor = "#1f2e53";
        });

        com.addEventListener("mouseout", () => {
            compoundDetailBox.classList.remove('active');
            com.style.backgroundColor = "#141f3a";
        })
        
        com.addEventListener("mousemove", (e) => {
            compoundDetailBox.style.left = (e.clientX + 10) + 'px';
            compoundDetailBox.style.top = (e.clientY + 10) + 'px';
        })
    })
})

function createElementModel (elementBox, elementOrbit) {
    elementBox.innerHTML = '';
    let size = 100;

    // uncleus
    const nucleus = document.createElement("div");
    nucleus.classList.add("uncleus");

    elementBox.appendChild(nucleus);

    // orbit
    const orbits = document.createElement("div");
    orbits.classList.add("orbits");
 
    elementOrbit.forEach ((e, inx) => {
        const orbit = document.createElement("div");
        const electronLayer = document.createElement("div");

        orbit.classList.add("orbit", `orbit${inx + 1}`);
        electronLayer.classList.add("electronLayer", `Layer${inx + 1}`);

        orbit.style.width = (size + 10) + "px";
        orbit.style.height = (size + 10) + "px";
        electronLayer.style.width = (size + 10) + "px";
        electronLayer.style.height = (size + 10) + "px";
        
        for (let i = 1; i <= e; i++) {
            const electron = document.createElement("span");
            electron.classList.add("electron");

            const angle = 360 / e * i;
            const radius = (size + 10) / 2;

            electron.style.transform = `rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`;
            // electron.style.transform += (`rotate(${angle}deg)`);

            electronLayer.appendChild(electron);
        }

        electronLayer.style.animation = `spin ${10 + inx * 5}s linear infinite`

        orbits.appendChild(electronLayer);
        orbits.appendChild(orbit);
        size += 70;
    })

    elementBox.appendChild(orbits);
}