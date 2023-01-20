const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_URL = "https://words.dev-apis.com/validate-word";

const wordTags = {
    1: ".first-word",
    2: ".second-word",
    3: ".third-word",
    4: ".fourth-word",
    5: ".fifth-word",
    6: ".sixth-word",
};

let wordTagKey = 1;

let wordOfTheDay = "";

async function getWordOfTheDay() {
    const promise = await fetch(WORD_URL)
    const processedResponse = await promise.json();
    return processedResponse.word.toUpperCase();
};

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.json();
}

function isKeyValid(key) {
    return isLetter(key) || isBackspace(key) || isEnter(key);
};

function isBackspace(key) {
    return key === "Backspace";
};

function isEnter(key) {
    return key === "Enter";
};

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
};

function findGreenLetters(word) {
    let letterColors = Array();
    let lettersOfTheDay = Array.from(wordOfTheDay);
    for (let indx = 0; indx < word.length; indx++) {
        if (word[indx] === wordOfTheDay[indx]) {
            letterColors.push("darkgreen");
            lettersOfTheDay[indx] = null
        } else {
            letterColors.push(word[indx]);
        }
    }
    return [letterColors, lettersOfTheDay]
};

function findYelllowGreyLetters(letterColors, lettersOfTheDay) {
    for (let indx = 0; indx < letterColors.length; indx++) {
        if (letterColors[indx] === "darkgreen") {
            continue;
        }
        const indxLOD = lettersOfTheDay.indexOf(letterColors[indx]);
        // The guessed letter is in the word of the day, but in a different place
        if (indxLOD > -1) {
            letterColors[indx] = "goldenrod";
            lettersOfTheDay[indxLOD] = null;
        // The guessed letter is not in the word of the day    
        } else {
            letterColors[indx] = "grey";
        };
    }
    return letterColors
}

function findLetterColors(word) {
    let [letterColors, lettersOfTheDay] = findGreenLetters(word)
    return findYelllowGreyLetters(letterColors, lettersOfTheDay)
}

function addWaitAnimation() {
    const spinner = document.querySelector(".wait-spinner");
    
    spinner.innerText = "🍥";
    spinner.animate(
        [
            {transform: "rotate(0deg)"},
            {transform: "rotate(360deg)"},
        ],
        {
            duration:900,
            easing: "linear",
            iterations: Infinity,
        });
}

function removeWaitAnimation() {
    const spinner = document.querySelector(".wait-spinner");
    spinner.innerText = "";
}

function isWordWOD(colors) {
    let ret = false
    let green_count = 0;
    colors.forEach(color => {
        if (color === "darkgreen") {
            green_count += 1;
        }
    if (green_count === 5) {
        ret = true
    }
    });
    return ret
}

function handleValidWord(wordTag, word) {
    colors = findLetterColors(word);
    setLetterColors(wordTag, colors);

    if (isWordWOD(colors)) {
        alert("You Win!");
        wordTagKey = 7;
    } else {
        // Move to the next word
        wordTagKey += 1;
        if (wordTagKey > 6) {
            alert(`You lose! The word of the day is: ${wordOfTheDay}`)
        }
    }
}

function handleInvalidWord(wordTag, word) {
    const wordElem = document.querySelector(wordTag);

    for (let indx = 0; indx < word.length; indx++) {
        wordElem.children[indx].animate(
            [{borderColor: "rgb(255, 0, 0)"}],
            {duration: 1000, easing: "linear"})
            .play()
    }
}

function validateWord(wordTag, word) {
    postData(url=VALIDATE_URL,  { "word": word })
        .then((data) => {
            const isValid = data["validWord"]

            removeWaitAnimation();

            if (isValid) {
                handleValidWord(wordTag, word)
            } else {
                handleInvalidWord(wordTag, word)
            }
        })
}

function handleEnterKey() {
    // Is this a valid attemp
    if (wordTagKey in wordTags) {
        const wordTag = wordTags[wordTagKey];
        const word = getWord(wordTag);

        // Enter was hit before 5 letters were typed
        if (word.length != 5) {
            return
        }

        addWaitAnimation();
        validateWord(wordTag, word);
        }
};

function handleBackspace() {
    if (wordTagKey in wordTags) {
        const wordTag = wordTags[wordTagKey];
        let word = getWord(wordTag);

        word = word.slice(0, -1);
        setWord(wordTag, word);
    };
};

function handleLetter(key) {
    if (wordTagKey in wordTags) {
        const wordTag = wordTags[wordTagKey];
        let word = getWord(wordTag);

        if (word.length === 5) {
            word = word.slice(0, -1) + key;
        };
        if (word.length < 5) {
            word += key
        };
        setWord(wordTag, word);
    }
};

function handleValidKey(key) {
    if (isEnter(key)) {
        handleEnterKey();
    };
    if (isBackspace(key)) {
        handleBackspace();
    };

    if (isLetter(key)) {
        handleLetter(key);
    };
};

function getWord(wordTag) {
    const wordElem = document.querySelector(wordTag);
    const letters = [];
    for (const child of wordElem.children) {
        letters.push(child.innerText);
    };
    return letters.join("");
};

function clearWord(wordElem) {
    for (const child of wordElem.children) {
        child.innerText = "";
    };
};

function setWord(wordTag, word) {
    const wordElem = document.querySelector(wordTag);
    clearWord(wordElem);

    const word_upper = word.toUpperCase()
    for (let indx = 0; indx < word.length; indx++) {
        wordElem.children[indx].innerText = word_upper[indx];
    };
};

function setLetterColors(wordTag, colors) {
    const wordElem = document.querySelector(wordTag);

    for (let indx = 0; indx < colors.length; indx++) {
        wordElem.children[indx].style.backgroundColor = colors[indx];
        wordElem.children[indx].style.color = "white"
    };
};

function handleKey(event) {
    key = event.key;
    if (!isKeyValid(key)) {
        event.preventDefault();
    } else {
        handleValidKey(key) // Enter, backspace, or letter
    };
};

function init() {
    getWordOfTheDay()
    .then(function (word) {
        wordOfTheDay = word;
    })
    .then(
        document
        .querySelector(".all-words")
        .addEventListener("keydown", function (event) {
            handleKey(event);
        
        })
    )
};

init();
