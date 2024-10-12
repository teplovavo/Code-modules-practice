console.log("LET'S START SBA 316! Veronika Teplova's WEB APPLICATION");

import { startTimer } from './script-2.js';

// items
const cardImages = [
    '🍭', '🍬', '🍫', '🍩', '🍪', '🍰', '🍦', '🍧', '🍿', '🍎'
];
console.log(cardImages);

// Duplicate items (x2 cards)
let cardSet = [...cardImages, ...cardImages];

// Sort cards in random mode
cardSet = cardSet.sort(() => 0.5 - Math.random());

const cardGrid = document.getElementById('card-grid');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

// Timer variables
let timerElement = document.getElementById('timer');
let secondsElapsed = 0;
let timerInterval;

/////////////////////////////////////// Create cards in DOM ///////////////
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-card-value', value);
    card.innerHTML = 
       ` <div class="back">${value}</div>
        <div class="front">?</div>  `;

    // Click
    card.addEventListener('click', () => flipCard(card));
    cardGrid.appendChild(card);
}

/////////// Card rotating function ////////////
function flipCard(card) {
    if (lockBoard) return; // block until check
    if (card === firstCard) return; // can't return the same card

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    checkForMatch();
}

// Check if match
function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-card-value') === secondCard.getAttribute('data-card-value');
    isMatch ? disableCards() : unflipCards();
}

// Disable cards if match
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matchedPairs++;

    // If all pairs found
    if (matchedPairs === cardSet.length / 2) {
        setTimeout(showWinModal, 500);
    }
}

// Rotate if not match
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset board
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Cards
cardSet.forEach(image => createCard(image));

///////////////////////// BUTTON ////////////////////////////////

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGame);

function resetGame() {
    cardGrid.innerHTML = '';

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;

    // Duplicate items (x2 cards)
    let cardSet = [...cardImages, ...cardImages];

    // Sort cards in random mode
    cardSet = cardSet.sort(() => 0.5 - Math.random());

    // New cards
    cardSet.forEach(cardValue => createCard(cardValue));
}

/////////////////////////// WIN MODAL ////////////////
const winModal = document.getElementById('win-modal');
const closeModal = document.getElementById('close-modal');

function showWinModal() {
    stopTimer();
    winModal.style.display = 'block';
}

closeModal.addEventListener('click', () => {
    winModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == winModal) {
        winModal.style.display = 'none';
    }
});

/////////////////////// Name INPUT + Validation ////////////////

const nameModal = document.getElementById('name-modal');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const nameError = document.getElementById('name-error');

window.onload = function() {
    nameModal.style.display = 'block';
};

startGameButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName === '') {
        nameError.textContent = 'Please, enter your name';
        nameError.style.display = 'block';
    } else if (playerName.length < 3) {
        nameError.textContent = 'Name must be at least 3 characters long';
        nameError.style.display = 'block';  
    } else {
        nameError.style.display = 'none';
        nameModal.style.display = 'none';

        // Start the timer
        startTimer(timerElement, secondsElapsed);

        // Show the name on the page
        const greeting = document.createElement('h2');
        greeting.textContent = `Hello, ${playerName}! Good luck!`;
        document.body.insertBefore(greeting, document.querySelector('.game-container'));
    }
});
