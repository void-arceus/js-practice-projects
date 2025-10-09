let wordInput = document.getElementById("searchWord");
let searchBtn = document.getElementById("searchBtn");
let audio = document.getElementById("audioPlayer");
let playAudio = document.getElementById("playAudio");
let word = "";
let displayDiv = document.querySelector(".display-data");
let displayError = document.querySelector(".error-message");

//display data 
let displayWord = document.getElementById("displayWord");
let text = document.getElementById("text");
let partOfSpeech = document.getElementById("partOfSpeech"); 
let def = document.getElementById("definition"); 
let ex = document.getElementById("example"); 

wordInput.addEventListener("input", (e) => {
  word = e.target.value;
});
searchBtn.addEventListener("click", async () => {
  const word = wordInput.value.trim();
  if (word === "") {
    alert("Enter a word!!");
    return;
  }

  displayWord.textContent = word;
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  let data = await getData(url);

  // phonetic text and audio
  const phoneticText = data[0].phonetics.find(p => p.text)?.text || "No text found...";
  const a = data[0].phonetics.find(p => p.audio)?.audio || "";

  // first meaning and definition
  const firstMeaning = data[0].meanings?.[0]; 
  const firstDef = firstMeaning?.definitions?.[0]; 
  
  // display in UI
  text.textContent = phoneticText;
  audio.src = a;
  partOfSpeech.textContent = firstMeaning?.partOfSpeech || "N/A"; 
  def.textContent = firstDef?.definition || "No definition found..."; 
  ex.textContent = firstDef?.example || "No example found...";
  if (displayError.classList.contains("active")) {
    displayError.classList.remove("active");
  }
  displayDiv.classList.add("active");
});

// get data 
async function getData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        displayDiv.classList.remove("active"); 
        displayError.classList.add("active"); 
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json(); 
      return result; 
    } catch (error) {
      console.log("Error:", error);  
    }
}


// play audio 
playAudio.addEventListener("click", () => {
  if (!audio || audio === "") {
    alert("No audio available for this word!");
    return;
  }
  audio.play().catch(err => {
    console.log("Error:", err);
  })
});

window.addEventListener("load", () => {
  wordInput.value = "";
  
}); 
