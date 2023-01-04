const wordTags = {
    1: ".first-word",
    2: ".second-word",
    3: ".third-word",
    4: ".fourth-word",
    5: ".fifth-word",
    6: ".sixth-word",
}

let wordTagKey = 1

function isKeyValid(key) {
    return isLetter(key) || isBackspace(key) || isEnter(key)
}

function isBackspace(key) {
    return key === "Backspace"
}

function isEnter(key) {
    return key === "Enter"
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter)
}

function handleEnterKey() {
    if (wordTagKey in wordTags) {
        const wordTag = wordTags[wordTagKey];
        const word = getWord(wordTag);

        if (word.length === 5) {
            console.log("Word len is 5");
            // TODO: isWordOfTheDay?

            wordTagKey += 1;
        };
    };
}

function handleBackspace() {
    if (wordTagKey in wordTags) {
        const wordTag = wordTags[wordTagKey];
        let word = getWord(wordTag);

        word = word.slice(0, -1);
        setWord(wordTag, word);
    };
}

function handleLetter(key) {
    if (wordTagKey in wordTags) {
        const wordTag = wordTags[wordTagKey];
        let word = getWord(wordTag);

        if (word.length === 5) {
            word = word.slice(0, -1) + key;
        }
        if (word.length < 5) {
            word += key
        }
        setWord(wordTag, word)
    }
}

function handleValidKey(key) {
    if (isEnter(key)) {
        handleEnterKey();
    };
    if (isBackspace(key)) {
        handleBackspace();
    };

    if (isLetter(key)) {
        handleLetter(key)
    }
}

function getWord(wordTag) {
    const wordElem = document.querySelector(wordTag);
    const letters = [];
    for (const child of wordElem.children) {
        letters.push(child.innerText);
    };
    return letters.join("")
}

function clearWord(wordElem) {
    for (const child of wordElem.children) {
        child.innerText = "";
    };
}

function setWord(wordTag, word) {
    const wordElem = document.querySelector(wordTag);
    clearWord(wordElem);

    for (let indx = 0; indx < word.length; indx++) {
        wordElem.children[indx].innerText = word[indx];
    };
}

function handleKey(event) {
    key = event.key;
    if (!isKeyValid(key)) {
        event.preventDefault();
    } else {
        handleValidKey(key) // Enter, backspace, or letter
    };
}

function init() {
    document
        .querySelector(".all-words")
        .addEventListener("keydown", function (event) {
            handleKey(event);
        
    });
}

init();
