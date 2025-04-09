const cards = document.querySelectorAll('.memory-card');
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts');
const restartButton = document.getElementById('restart');
const messageDisplay = document.getElementById('message'); 

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let attempts = 20;
let timeLeft = 120;
let timer;
let matchedCards = 0; 

function startGame() {
    resetGame(); // Reset the game state
    shuffle(); // Shuffle cards
}

function resetGame() {
    resetBoard();
    attempts = 20;
    timeLeft = 120;
    matchedCards = 0; 
    attemptsDisplay.textContent = `Attempts Left: ${attempts}`;
    timerDisplay.textContent = `Time Left: ${timeLeft}`;
    restartButton.style.display = 'none'; // Hide restart button at the start
    messageDisplay.textContent = ''; // Clear message
    clearInterval(timer); // Stop any existing timer
    timer = null; // Reset timer variable
    resetCards(); // Reset all cards to face down
}

function startTimer() {
    // Prevent starting the timer if it's already running
    if (timer) return;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null; // Reset timer variable
            messageDisplay.textContent = 'Time is up! You lost.'; // Show message when time is up
            restartButton.style.display = 'block'; // Show restart button when time is up
        }
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        startTimer(); // Start timer on first card flip
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let firstCardImageSrc = firstCard.querySelector('.front-face').src;
    let secondCardImageSrc = secondCard.querySelector('.front-face').src;

    let isMatch = firstCardImageSrc === secondCardImageSrc;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedCards += 2; 
    resetBoard();


    if (matchedCards === cards.length) {
        clearInterval(timer);
        timer = null; // Reset timer variable
        messageDisplay.textContent = 'Congratulations! You won!'; // Show win message 
        restartButton.style.display = 'block'; // Show restart button
    }
}

function unflipCards() {
    attempts--;
    attemptsDisplay.textContent = `Attempts Left: ${attempts}`;
    if (attempts <= 0) {
        clearInterval(timer);
        timer = null; // Reset timer variable
        messageDisplay.textContent = 'No attempts left! You lost.'; // Show message when attempts are over
        restartButton.style.display = 'block'; // Show restart button when attempts are over
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetCards() {
    cards.forEach(card => {
        card.classList.remove('flip'); // Remove flip class to reset cards
        card.addEventListener('click', flipCard); // Re-add event listener
    });
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 20);
        card.style.order = randomPos;
    });
}

cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', resetGame); // Call resetGame on restart button click

// Start the game for the first time
startGame();