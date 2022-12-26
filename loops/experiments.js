// In your experiments.js,

// Write some code that declares two variables, character and timesToRepeat.
// Using a loop, repeat that character that many times and then console.log it.
// Example, if I had character = 'f' and timesToRepeat = 5, it'd console.log 'fffff'.
// Try a few different combinations to make sure you got it right e.g. 'a' and 10, 'c' and 100, '🐶' and 3.

const character = "🐶️" 
const timesToRepeat = 10

let result = ""
for (let i = 0; i < timesToRepeat; i++) {
    result += character;
}

console.log(result)
