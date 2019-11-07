//import { outside, inside } from './snailwalker';


let settings = {
  direction: 'outside', // направление: раскручивание (outside), закручивание (inside) спирали
  cols: 7,              // число столбцов
  rows: 7,              // число строк
  growBy: 'height',     // что будет меняться в процессе: высота (height), ширина (width)
  min: 2,               // минимальное значение при изменении
  max: 7,               // максимальное значение при изменении
};

function createInfoPanel(text1, text2) {
  let aParagraph1 = document.createElement('p');
  aParagraph1.appendChild(document.createTextNode(text1));

  let aParagraph2 = document.createElement('p');
  aParagraph2.appendChild(document.createTextNode(text2));

  let aDiv = document.createElement('div');
  aDiv.classList.add('tbl-container__info-panel');
  aDiv.appendChild(aParagraph1);
  aDiv.appendChild(aParagraph2);

  return aDiv;
}

function createTable(parentEl, a, b) {
  let aTable = document.createElement('table');

  for(let i = 0; i < b; ++i) {
    let tr = aTable.insertRow();
    for(let j = 0; j < a; ++j) {
      let td = tr.insertCell();
      td.appendChild(document.createTextNode('&nbsp;'));
    }
  }

  parentEl.appendChild(aTable);
  return aTable;
}

function getTdByIndex(tbl, i, j) {
  let aRow = tbl.getElementsByTagName('tr')[j];
  let aCell = aRow.getElementsByTagName('td')[i];
  return aCell;
}

document.addEventListener("DOMContentLoaded", () => {
  let aContainer = document.getElementById('tbl-container');

  let growDimIndex = (settings.growBy === 'height')? 1 : 0;
  let point = [settings.cols, settings.rows];
  for(let i = settings.min; i < settings.max; ++i) {

    point[growDimIndex] = i;

    let [a, b] = point;

    let tableContainer = document.createElement('div');
    tableContainer.classList.add('tbl-container__result-container');

    tableContainer.appendChild(
      createInfoPanel('direction: ' + settings.direction, 'dimentions: ' + a + ', ' + b)
    );

    let aTable = createTable(tableContainer, a, b);
    aContainer.appendChild(document.createElement('hr'));
    aContainer.appendChild(tableContainer);


    let walker = {};
    if(settings.direction === 'outside')  {
       walker = new SnailWalkerOutside(a, b);
    }
    else if(settings.direction === 'inside') {
       walker = new SnailWalkerInside(a, b);
    }

    let cntr = 0;
    for(let item of walker) {
      let aCell = getTdByIndex(aTable, item[0], item[1]);
      aCell.innerText = '' + cntr;
      cntr += 1;
    }

    delete walker;
  }
});

