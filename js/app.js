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
*/
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

let word;
let hint;
let guessingWord = [];
let wrongGuess = 0;


/*------------------------ Cached Element References ------------------------*/
const startScreen = document.querySelector('#start-screen');
const gameScreen = document.querySelector('#game-screen');

const playBtn = document.querySelector('#play-btn');
const buttonEls = document.querySelectorAll('.button');
const hintEl = document.querySelector('#category-hint');
const guessEl = document.querySelector('#guess-checker');
const guessingWordEl = document.querySelector('#guessing-word');
const videoEl = document.querySelector('#hangman-video');
const messageEl = document.querySelector('#game-message');
const resetBtnEl = document.querySelector('#reset');
/*-------------------------------- Functions --------------------------------*/

function init() {
    wrongGuess = 0;
    messageEl.textContent = '';
    buttonEls.forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'wrong');
    });

    resetBtnEl.style.display = 'none'; 
    videoEl.src = 'assets/0.mp4';
    videoEl.load();

    pickRandomWord()
    buildGuessingWord()
    render()
}

function pickRandomWord() {
    const randomWord = Math.floor(Math.random() * gameWords.length);
    const selectedWord = gameWords[randomWord];

    word = selectedWord.word;
    hint = selectedWord.category;
}

function buildGuessingWord() {
    guessingWord = [];
    for (let char of word) {
        guessingWord.push('_');
    }
}

function render() {
    guessingWordEl.textContent = guessingWord.join(' '); 
    hintEl.textContent = `Hint: ${hint}`; 
    guessEl.textContent = `Wrong Guesses: ${wrongGuess}/7`;
}

function handleLetterClick(event) {
    const button = event.target;
    const letter = button.textContent.toLowerCase(); 

    button.disabled = true

    let letterFound = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            guessingWord[i] = letter; 
            letterFound = true;
        }
    }


    if (letterFound === true) { 
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
        wrongGuess++;
        updateVideo();
    }

    render();
    checkGameStatus();
}

function updateVideo() {
    videoEl.src = `assets/${wrongGuess}.mp4`;
    videoEl.load();
    videoEl.play();
}

function playWinVideo() {
    videoEl.src = 'assets/win.mp4';
    videoEl.load();
    videoEl.play();
}

function checkGameStatus() {
    if (wrongGuess === maxWrongGuesses) {
        messageEl.innerHTML = `You Lost! The word was <span class="revealed-word">${word}</span>`;
        disableKeyboard();
        resetBtnEl.style.display = 'block';


    } else if (guessingWord.join('') === word) {
        messageEl.textContent = 'You Won!';
        resetBtnEl.style.display = 'block';

        playWinVideo()
        disableKeyboard();

    }
}

function disableKeyboard() {
    buttonEls.forEach(button => button.disabled = true);
}

/*----------------------------- Event Listeners -----------------------------*/
gameScreen.classList.add('hidden');

playBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});

buttonEls.forEach(button => {
    button.addEventListener('click', handleLetterClick);
});

resetBtnEl.addEventListener('click', init);

init();