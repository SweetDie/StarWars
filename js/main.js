const UrlPeople = "https://swapi.dev/api/people";
const UrlPlanets = "https://swapi.dev/api/planets";
const UrlStarships = "https://swapi.dev/api/starships";
let urlNext;
let urlPrevious;
let page = 0;
let planetStr = "planets";
let charStr = "characters";
let shipsStr = "starships";
let currentImgUrl;
let currentUrl;
let object1;
let currentLocalRequest;
let requestCount = 0;

window.addEventListener("load", Init);

function Init() {
  page = 0;
  currentUrl = UrlPeople;
  currentImgUrl = charStr;
  document.getElementById("loader").style.display = "none";
  Request(UrlPeople, Print);
}

function GetPeople() {
  Clear();
  Request(UrlPeople, Print);
  currentUrl = UrlPeople;
  page = 0;
  currentImgUrl = charStr;
}

function GetStarship() {
  Clear();
  Request(UrlStarships, Print);
  currentUrl = UrlStarships;
  page = 0;
  currentImgUrl = shipsStr;
}

function GetPlanet() {
  Clear();
  Request(UrlPlanets, Print);
  currentUrl = UrlPlanets;
  page = 0;
  currentImgUrl  = planetStr;
}

function Request (URL, Callback){
  if(URL === UrlPeople) {
    currentLocalRequest = "people";
  }
  else if(URL === UrlPlanets) {
    currentLocalRequest = "planet";
  }
  else if(URL == UrlStarships) {
    currentLocalRequest = "ships";
  }

  document.querySelectorAll(".btn-primary").forEach((element) => {
    element.style.display = "none";
  });
  document.getElementById("loader").style.display = "block";

  const localResult = localStorage.getItem(`${currentLocalRequest}${page}`);
  if(localResult !== null) {
    console.log(JSON.parse(localResult))
    Callback(JSON.parse(localResult));
    document.getElementById("loader").style.display = "none";
    document.querySelectorAll(".btn-primary").forEach((element) => {
      element.style.display = "block";
    });
  }
  else {
    fetch(URL)
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    requestCount++;
    UpdateCounter();
    document.getElementById("loader").style.display = "none";
    document.querySelectorAll(".btn-primary").forEach((element) => {
      element.style.display = "block";
    });
    localStorage.setItem(`${currentLocalRequest}${page}`, JSON.stringify(data));
    console.log(data)
    Callback(data);
  })
  .catch(err => console.log(err));
  }
}

function UpdateCounter() {
  const counter = document.getElementById("counterId");
  counter.innerHTML = requestCount;
}

Next = () => {
  Clear();
  page++;
  Request(urlNext, Print);
  currentUrl = urlNext;
}

Prev = () => {
  Clear();
  page--;
  Request(urlPrevious, Print);
  currentUrl = urlPrevious;
}

Print = ({results, next, previous}) => {

  urlPrevious = previous;
  urlNext = next;

  if(next === null) {
    document.getElementById("btnNext").disabled = true;
  }
  else {
    document.getElementById("btnNext").disabled = false;
  }

  if(previous === null) {
    document.getElementById("btnPrev").disabled = true;
  }
  else {
    document.getElementById("btnPrev").disabled = false;
  }
  const thead = document.getElementById("tableHead");
  const tbody = document.getElementById("tableBody");
  const trHead = document.createElement("tr");

  let tmpObject = new Object1();
  
  Object.keys(results[0]).slice(0, 8).forEach((element) => {
    const th = document.createElement("th");
    th.appendChild(document.createTextNode(element));
    tmpObject.pushKey(element);
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  results.forEach((element, index) => {
    const trBody = document.createElement("tr");
    trBody.addEventListener("click", () => {
      console.log(trBody);
    });
    let img = document.createElement("img");

    let numberItem = index + 1 + page * 10;
    if(numberItem >= 17) {
      numberItem++;
    }

    img.setAttribute("src", `https://starwars-visualguide.com/assets/img/${currentImgUrl}/${numberItem}.jpg`);
    img.setAttribute("alt", `No image`);
    img.width = 50;
    tmpObject.setImg(`https://starwars-visualguide.com/assets/img/${currentImgUrl}/${index + 1 + page * 10}.jpg`);
    let tdimg = document.createElement("td");
    tdimg.appendChild(img);
    trBody.appendChild(tdimg);

    Object.values(element).slice(0, 8).forEach((element1) => {
      let td = document.createElement("td");
      td.appendChild(document.createTextNode(element1));
      tmpObject.pushValues(element1);
      trBody.appendChild(td);
    });
    tbody.appendChild(trBody);
  })

  object1 = tmpObject;
}

function Clear() {
  let thead = document.getElementById("tableHead");
  while(thead.firstChild) {
    thead.removeChild(thead.firstChild);
  }
  let tbody = document.getElementById("tableBody");
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}




class Object1 {
  constructor() {
    this.Keys = [];
    this.Values = [];
    this.Img = null;
  }

  pushKey(key) {
    this.Keys.push(key);
  }

  pushValues(value) {
    this.Values.push(value);
  }

  setImg(img) {
    this.Img = img;
  }
}