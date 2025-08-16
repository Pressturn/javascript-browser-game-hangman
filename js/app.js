/* 

1. declare variables
wrong guesses = 7
create array word list
selected word
guessed letters
displayword
wrong guess
game win/lost

2. game logic
    a. randomly choose a word and set it as selected word
    b. set the display word to show number of letters
    c. check if letters are correct, if correct, show letter in selected word, if wrong put a cross on the letter
    d. if hit 7 wrong guesses = lose, else if selected word is complete, game = win
    e. reset



add highscore using local storage 
consider grabbing information using an api
having difficulty
storing the highscore and input name 
add reset button
add game start button
hangman counter increase


/*-------------------------------- Constants --------------------------------*/
const maxWrongGuesses = 7;
const gameWords = [
    { word: "keyboard", category: "Electronics", difficulty: "easy" },
    { word: "laptop", category: "Electronics", difficulty: "easy" },
    { word: "mouse", category: "Electronics", difficulty: "easy" },
    { word: "monitor", category: "Electronics", difficulty: "easy" },
    { word: "tablet", category: "Electronics", difficulty: "easy" },

    { word: "giraffe", category: "Animals", difficulty: "easy" },
    { word: "zebra", category: "Animals", difficulty: "easy" },
    { word: "panda", category: "Animals", difficulty: "easy" },
    { word: "whale", category: "Animals", difficulty: "easy" },
    { word: "bear", category: "Animals", difficulty: "easy" },

    { word: "batman", category: "Superheroes", difficulty: "easy" },
    { word: "spiderman", category: "Superheroes", difficulty: "easy" },
    { word: "hulk", category: "Superheroes", difficulty: "easy" },
    { word: "flash", category: "Superheroes", difficulty: "easy" },
    { word: "thor", category: "Superheroes", difficulty: "easy" },

    { word: "japan", category: "Countries", difficulty: "easy" },
    { word: "india", category: "Countries", difficulty: "easy" },
    { word: "korea", category: "Countries", difficulty: "easy" },
    { word: "indonesia", category: "Countries", difficulty: "easy" },
    { word: "malaysia", category: "Countries", difficulty: "easy" },
]

/*---------------------------- Variables (state) ----------------------------*/
// Current word and hint for this round
let word;
let hint;

// Array representing the guessed letters
let guessingWord = [];

let numOfGuesses = 0;

let currentScore = 0;
let highScore = Number(localStorage.getItem('hangmanHighScore')) || 0;

/*------------------------ Cached Element References ------------------------*/
const startScreenEl = document.querySelector('#start-screen');
const gameScreenEl = document.querySelector('#game-screen');

// Button elements
const playBtnEl = document.querySelector('#play-btn');
const buttonEls = document.querySelectorAll('.button');
const nextBtnEl = document.querySelector('#next');
const resetBtnEl = document.querySelector('#reset');

// Game messages
const scoreEl = document.querySelector('#score');
const hintEl = document.querySelector('#category-hint');
const gameMessageEl = document.querySelector('#game-message');
const guessCheckerEl = document.querySelector('#guess-checker');
const guessingWordEl = document.querySelector('#guessing-word');

const videoEl = document.querySelector('#hangman-video');

/*-------------------------------- Functions --------------------------------*/

function init() {
    numOfGuesses = 0;
    gameMessageEl.textContent = '';

    buttonEls.forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'wrong');
    });

    resetBtnEl.style.display = 'none';
    nextBtnEl.style.display = 'none';


    videoEl.src = 'assets/0.mp4';
    videoEl.load();

    pickRandomWord()
    buildGuessingWord()
    updateHighScore()
    render()
}

// Choose a random word from the gameWords array and set the hint
function pickRandomWord() {
    const randomWord = Math.floor(Math.random() * gameWords.length);
    const selectedWord = gameWords[randomWord];

    word = selectedWord.word;
    hint = selectedWord.category;
}

// To show an empty guessing word
function buildGuessingWord() {
    guessingWord = [];
    for (let char of word) {
        guessingWord.push('_');
    }
}

// Main game logic
// Taking the event from the button click 
function handleLetterClick(event) {
    const button = event.target;
    const letter = button.textContent.toLowerCase();
    button.disabled = true;

    // loop to check if the letter tallies with the word
    let letterFound = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            guessingWord[i] = letter;
            letterFound = true
        }
    }

    // Update to guess letters or wrong guess count
    if (letterFound === true) {
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
        numOfGuesses++;
        updateVideo();
    }

    render();
    checkGameStatus();
}

// To update after every click
function render() {
    guessingWordEl.textContent = guessingWord.join(' ');
    hintEl.textContent = `Hint: ${hint}`;
    guessCheckerEl.textContent = `Wrong Guesses: ${numOfGuesses}/7`;
}

// Check win, loss, current score and highscore
function checkGameStatus() {
    if (numOfGuesses === maxWrongGuesses) {
        gameMessageEl.innerHTML = `You Lost! The word was <span class="revealed-word">${word}</span>`;
        disableKeyboard();

        resetBtnEl.style.display = 'block';
        updateHighScore();

    // Win condition 
    } else if (guessingWord.join('') === word) {
        gameMessageEl.textContent = 'You Won!';

        playWinVideo();
        disableKeyboard();

        currentScore++;

        if (currentScore > highScore) {
            highScore = currentScore
            localStorage.setItem('hangmanHighScore', highScore);
        }

        updateHighScore();
        nextBtnEl.style.display = 'block';
    }
}

function disableKeyboard() {
    buttonEls.forEach(button => button.disabled = true);
}

function updateHighScore() {
    scoreEl.textContent = `Score: ${currentScore} | High Score: ${highScore}`;
}

function updateVideo() {
    videoEl.src = `assets/${numOfGuesses}.mp4`;
    videoEl.load();
    videoEl.play();
}

function playWinVideo() {
    videoEl.src = 'assets/win.mp4';
    videoEl.load();
    videoEl.play();
}

/*----------------------------- Event Listeners -----------------------------*/

// listen when start screen play button clicked
playBtnEl.addEventListener('click', () => {
    startScreenEl.classList.add('hidden');
    gameScreenEl.classList.remove('hidden');
});

// listen to button clicked
buttonEls.forEach(button => {
    button.addEventListener('click', handleLetterClick);
});

// listen when reset button clicked
resetBtnEl.addEventListener('click', () => {
    currentScore = 0;
    updateHighScore();
    init();
});

// listen when reset button clicked
nextBtnEl.addEventListener('click', init);

// hide starting screen and initialise 
gameScreenEl.classList.add('hidden');
init();