import moviesData from "./data.js"; 

let input = document.getElementById('user-input'); 
let searchBtn = document.getElementById('search-btn');  
let displayResults = document.querySelector(".search-results"); 

// titleScore = {
//   [key, value]
//}
let titleScore = new Map(); 
let desScore = new Map(); 

input.addEventListener('input', (e) => {
  searchWithDebounce(e.target.value); 
}); 

function debounce (fn, delay) {
  let timerId; 
  return function (...args) {
    clearTimeout(timerId); 
    timerId = setTimeout(() => {
      fn(...args); 
    },delay); 
  }
}

function search (query) {
  titleScore.clear(); 
  desScore.clear(); 
  if (query.trim().length === 0) return;
  let queryArr = query.split(' ');  
  queryArr = queryArr.filter(el => el.length !== 0);
  console.log(queryArr); 
  
  // search in moviesData 
  for (let i = 0; i < moviesData.length; i++) {
    let titleArr = moviesData[i].title.split(' '); 
    let desArr = moviesData[i].description.split(' '); 
    titleArr = titleArr.filter(el => el.length !== 0); 
    desArr = desArr.filter(el => el.length !== 0); 
    searchWord(queryArr, titleArr, "title", moviesData[i].title); 
    searchWord(queryArr, desArr, "des", moviesData[i].description); 
  }
  render(); 
}

// type => title or description
function searchWord(queryArr, targetArr, type, movieStr) {
  for (let i = 0; i < queryArr.length; i++) {
    for (let j = 0; j < targetArr.length; j++) {
      if (queryArr[i].toLowerCase() === targetArr[j].toLowerCase()) {
        if (type === "title") {
          updateScores(movieStr, 5, "title"); 
        } else {
          updateScores(movieStr, 3, "des"); 
        }
      }
    }
  }
}

function updateScores(name, score, type) {
  if (type === "title") {
    if (titleScore.has(name)) {
      let prevScore = titleScore.get(name); 
      titleScore.set(name, Number(prevScore) + score); 
    } else {
      titleScore.set(name, score); 
    }
  } else {
    if (desScore.has(name)) {
      let prevScore = desScore.get(name); 
      desScore.set(name, Number(prevScore) + score);  
    } else {
      desScore.set(name, score); 
    }
  }
}

// to display suggestions on button click 
// sort the title and description's title according to their socres 
function render() {
  let finalScore = new Map(); 
  titleScore.forEach((value, key) => {
    finalScore.set(key, value); 
  }) 
  desScore.forEach((value, key) => {
    for (let i = 0; i < moviesData.length; i++) {
      if (moviesData[i].description === key) {
        if (finalScore.has(moviesData[i].title)) {
          let prevScore = finalScore.get(moviesData[i].title);
          finalScore.set(moviesData[i].title, Number(prevScore) + Number(value)); 
        } else {
          finalScore.set(moviesData[i].title, Number(value)); 
        } 
      }
    }
  }); 
  
  let arr = [...finalScore.entries()]; 
  arr.sort((a,b) => b[1] - a[1]);  

  console.log(arr); 

  if (displayResults.children.length > 0) {
    Array.from(displayResults.children).forEach(child => child.remove()); 
  }
  
  for (let i = 0; i < Math.min(5, Number(arr.length)); i++) {
    let p = document.createElement("p");   
    p.textContent = arr[i][0]; 
    p.classList.add("result"); 
    displayResults.appendChild(p); 
  }

  if (arr.length === 0) {
    let p = document.createElement("p");
    p.textContent = "No Result found..."; 
    displayResults.appendChild(p); 
  }
  else {  
    document.querySelectorAll(".result").forEach((result) => {
      result.addEventListener("click", () => {
        input.value = result.textContent; 
      }); 
    });
  }
}

const searchWithDebounce = debounce(search, 300); 

searchBtn.addEventListener('click', () => {
  if (input.value === '') {
    console.log("Type something to see search results..."); 
    return; 
  }
  input.value = ''; 
}); 

window.addEventListener('load', () => {
  input.value = '';
  titleScore.clear(); 
  desScore.clear(); 
}); 