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

/*-------------------------------- Constants --------------------------------*/
const maxWrongGuesses = 7;
const gameWords = [
    { word: "keyboard", category: "Electronics", difficulty: "easy" },
    { word: "laptop", category: "Electronics", difficulty: "easy" },
    { word: "mouse", category: "Electronics", difficulty: "easy" },
    { word: "monitor", category: "Electronics", difficulty: "easy" },
    { word: "tablet", category: "Electronics", difficulty: "easy" },

    { word: "giraffe", category: "Animals", difficulty: "easy" },
    { word: "rhino", category: "Animals", difficulty: "easy" },
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
let displayWord = [];
let wrongGuess = 0;


/*------------------------ Cached Element References ------------------------*/

const buttonEl = document.querySelectorAll('.button');
const hintEl = document.querySelector('#category-hint');
const displayedWordEl = document.querySelector('#displayed-word');
const videoEl = document.querySelector('#hangman-video');
const messageEl = document.querySelector('#game-message');
/*-------------------------------- Functions --------------------------------*/

function init() {
    pickRandomWord()
    buildDisplayWord()
    render()
}

function pickRandomWord() {
    const randomWord = Math.floor(Math.random() * gameWords.length);
    const selectedWord = gameWords[randomWord];

    word = selectedWord.word;

    hint = selectedWord.category;
}

function buildDisplayWord() {
    displayWord = [];
    for (let char of word) {
            displayWord.push("_");
        }

}

function render() {
    displayedWordEl.textContent = displayWord.join(" ");
    hintEl.textContent = `Hint: ${hint}`;

}

function handleLetterClick(event) {
    const button = event.target;
    const letter = button.textContent.toLowerCase();

    button.disabled = true

    let letterFound = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            displayWord[i] = letter;
            letterFound = true;
        }
    }

    if (letterFound) {
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
        videoEl.src = "assets/win.mp4";
        videoEl.load();
        videoEl.play();
    }

    function checkGameStatus() {
        if (wrongGuess === maxWrongGuesses) {
            messageEl.textContent = `You Lost! The word was ${word}`;
            disableKeyboard();
        } else if (displayWord.join("") === word) {
            messageEl.textContent = "You Won!";
            playWinVideo()
            disableKeyboard();
        }
    }

    function disableKeyboard() {
        buttonEl.forEach(button => button.disabled = true);
    }
    /*----------------------------- Event Listeners -----------------------------*/

    buttonEl.forEach(button => {
        button.addEventListener('click', handleLetterClick);
    });

    init();