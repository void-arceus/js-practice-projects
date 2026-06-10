const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "TypeScript",
];

const languageColor = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    "C#": "#178600",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    TypeScript: "#3178C6",
};

const selectMenu = document.getElementById("select");
const searchBtn = document.getElementById("searchBtn");
const missingInputError = document.getElementById("missingInputError");
const loading = document.getElementById("loading");
const repoInfo = document.querySelector(".repo-info");

//select menu
languages.forEach((language) => {
    let option = document.createElement("option");
    option.textContent = language;
    option.value = language;
    option.className = "option";
    selectMenu.appendChild(option);
});

// select a language
let selectedLanguage = selectMenu.value;
selectMenu.addEventListener("change", (event) => {
    if (missingInputError.classList.contains("active"))
        missingInputError.classList.remove("active");
    selectedLanguage = event.target.value;
});

// calling github api
async function getGitHubRepository() {
    const url = `https://api.github.com/search/repositories?q=language:${selectedLanguage}`;
    let result = null;
    try {
        loading.className = "active";
        searchBtn.disabled = true;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }
        const data = await response.json();
        result = data.items;
    } catch (err) {
        loading.classList.remove("active");
        searchBtn.disabled = false;
        console.error(err.message);
    } finally {
        loading.classList.remove("active");
        searchBtn.disabled = false;
    }
    return result;
}

function setDisplayRepoData(repoData) {
    let idx = Math.floor(Math.random() * repoData.length);
    console.log(repoData);
    const template = `<div class="repo-header">
                    <h2>${repoData[idx].name}</h2>
                    <p>${repoData[idx].description.trim() !== "" ? repoData[idx].description : "Description Not Available"}</p>
                </div>
                <div>
                    <a class="repo-link" href="${repoData[idx].html_url}" target="_blank" rel="noopener noreferrer">View Repository</a> 
                </div>
                <div class="repo-footer">
                    <div class="repo-footer-data">
                        <div class="language-tag"></div>
                        <p>${selectedLanguage}</p>
                    </div>
                    <div class="repo-footer-data">
                        <img src="./Images/star.png" alt="star icon" />
                        <p>${repoData[idx].stargazers_count}</p>
                    </div>
                    <div class="repo-footer-data">
                        <img src="./Images/fork.png" alt="github fork icon" />
                        <p>${repoData[idx].forks}</p>
                    </div>
                    <div class="repo-footer-data">
                        <img src="./Images/issues.png" alt="issues icon" />
                        <p>${repoData[idx].open_issues}</p>
                    </div>
                </div>
                <button id="refreshBtn">
                        <div id="ref-loading"></div>
                        Refresh
                </button>
            `;
    repoInfo.innerHTML = template;
    repoInfo.classList.add("active");
    document.querySelector(".language-tag").style.backgroundColor =
        languageColor[`${selectedLanguage}`];
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn !== null) {
        refreshBtn.addEventListener("click", () => {
            setDisplayRepoData(repoData);
        });
    }
}

searchBtn.addEventListener("click", async () => {
    if (selectedLanguage === "") {
        missingInputError.className = "active";
        return;
    }
    if (missingInputError.classList.contains("active"))
        missingInputError.classList.remove("active");

    // api call
    const repoData = await getGitHubRepository();
    setDisplayRepoData(repoData);
});
