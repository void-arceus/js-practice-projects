const jokeBtn = document.getElementById("jokeBtn"); 
let displayJoke = document.querySelector(".display-joke"); 
let setupDisplay = document.getElementById("setup");
let punchlineDisplay = document.getElementById("punchline"); 

jokeBtn.addEventListener("click", () => {
  setTimeout(() => {
    getJoke(); 
  },100)
});

const getJoke = () => {
  fetch('https://official-joke-api.appspot.com/jokes/random')
  .then(response => response.json())
  .then(data =>{ 
    setupDisplay.textContent = data.setup; 
    punchlineDisplay.textContent = data.punchline;
  })
  .catch(error => console.log("Error:", error));
}

