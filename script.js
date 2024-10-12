console.log("LET'S START SBA 316! Veronika Teplova's WEB APPLICATION");

import { startTimer } from './script-2.js';

//items
const cardImages = [
    '🍭', '🍬', '🍫', '🍩', '🍪', '🍰', '🍦', '🍧', '🍿', '🍎'
];
console.log(cardImages);

// Dublicate items (x2 cards)
let cardSet = [...cardImages, ...cardImages];

// Sort cards in random mode
cardSet = cardSet.sort(() => 0.5 - Math.random());

const cardGrid = document.getElementById('card-grid');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

///////////////////////////////////////create cards in DOM/////////////
function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-card-value', value);
    card.innerHTML = 
       ` <div class="back">${value}</div>
        <div class="front">?</div>  `;

    // click
    card.addEventListener('click', () => flipCard(card));
    cardGrid.appendChild(card);
}

/////////// card rotating function ////////////
function flipCard(card) {
    if (lockBoard) return; //block until check
    if (card === firstCard) return; //cant return the same card

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;
    checkForMatch();
}

// check if match
function checkForMatch() {
    const isMatch = firstCard.getAttribute('data-card-value') === secondCard.getAttribute('data-card-value');
    isMatch ? disableCards() : unflipCards();
}

//disable cards if match
function disableCards() {
firstCard.classList.add('matched');
secondCard.classList.add('matched');
firstCard.removeEventListener('click', flipCard);
secondCard.removeEventListener('click', flipCard);
resetBoard();
matchedPairs++;

    //if all pairs found
    if (matchedPairs === cardSet.length / 2) {
        setTimeout(showWinModal, 500);
    }
    
}
//rotate if not match
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

//reset
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

//cards
cardSet.forEach(image => createCard(image));


/////////////////////////BUTTON////////////////////////////////

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', resetGame);

function resetGame() {
    cardGrid.innerHTML = '';

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;

    // Dublicate items (x2 cards)
let cardSet = [...cardImages, ...cardImages];

// Sort cards in random mode
cardSet = cardSet.sort(() => 0.5 - Math.random());


// new cards
cardSet.forEach(cardValue => createCard(cardValue));
}


///////////////////////////win modal//////////////

//check
if (matchedPairs === cardSet.length / 2) {
    setTimeout(showWinModal, 500);
}

const winModal = document.getElementById('win-modal');
const closeModal = document.getElementById('close-modal');


function showWinModal() {
    winModal.style.display = 'block';
}


closeModal.addEventListener('click', () => {
    winModal.style.display = 'none';
});

// close if click on the background
window.addEventListener('click', (event) => {
    if (event.target == winModal) {
        winModal.style.display = 'none';
    }
});



///////////////////////name INPUT + Validation ////////////////

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
        // show the name on the page
        const greeting = document.createElement('h2');
        greeting.textContent = `Hello, ${playerName}! Good luck!`;
        document.body.insertBefore(greeting, document.querySelector('.game-container'));
    }
});

///////////////////////timer//////////////////////////
let timerElement = document.getElementById('timer');
let secondsElapsed = 0;
let timerInterval;


function stopTimer() {
    clearInterval(timerInterval);
}
startTimer();
function showWinModal() {
    stopTimer();
    winModal.style.display = 'block';
}
window.onbeforeunload = function() {
    return 'The game is not saved. Do you really want to exit?';
};
// ...///////////////////////////////////////////////////////////////////////////////////////function from another file
let timerElement = document.getElementById('timer');
let secondsElapsed = 0;

document.getElementById('start-game').addEventListener('click', () => {
    startTimer(timerElement, secondsElapsed);
});

/////////////////////hint button//////

const allCards = document.querySelectorAll('.card');

// hint function, find 2 cards
function giveHint() {
    const unmatchedCards = Array.from(allCards).filter(card => !card.classList.contains('matched') && !card.classList.contains('flipped'));
    
    if (unmatchedCards.length < 2) {
        alert('Not enough cards to give a hint!');
        return;
    }

    //group cards (data-card-value)
    const cardMap = new Map();
    
    unmatchedCards.forEach(card => {
        const cardValue = card.getAttribute('data-card-value');
        if (!cardMap.has(cardValue)) {
            cardMap.set(cardValue, []);
        }
        cardMap.get(cardValue).push(card); // add card
    });

    
    let hintCards = [];
    for (let [key, cardGroup] of cardMap.entries()) {
        if (cardGroup.length >= 2) { 
            hintCards = cardGroup.slice(0, 2); 
            break;
        }
    }

       // hightlight cards
    hintCards.forEach(card => card.classList.add('flipped'));
    
    setTimeout(() => {
        hintCards.forEach(card => card.classList.remove('flipped'));
    }, 500);
}

// hint button
const hintButton = document.getElementById('hint-button');
hintButton.addEventListener('click', giveHint);




/////////////////////////////////////fragment practice//////////////////////////////////
//highlight 
function highlightCard(card) {
    const fragment = document.createDocumentFragment(); 

    const highlightEffect = document.createElement('div'); //create an element
    highlightEffect.classList.add('highlight-effect');
    
    fragment.appendChild(highlightEffect); // add element to fragment
    
    card.appendChild(fragment); // add fragment to the card
    

    
    card.addEventListener('mouseleave', () => {
        card.removeChild(highlightEffect); // remove element
        if (nextCard) {
            nextCard.classList.remove('highlight');
        }
    });
}


allCards.forEach(card => {
    card.addEventListener('mouseenter', () => highlightCard(card));
});




///////////////////////////////////////parentnode practice////////////
//add to "Start new game" button
resetButton.addEventListener('click', () => {
    const cardGridContainer = cardGrid.parentNode; 

    cardGridContainer.classList.add('highlight-border');

    setTimeout(() => {
        cardGridContainer.classList.remove('highlight-border');
    }, 3000);
});
