// Cards & choices
let board = document.querySelector("#game_board");

let images = [];
let imagesModal = [];
let audios = [];
let cardsSorted = [];
let cardsChosen = [];
let cardsChosenId = [];
let cardsLeft = [];

// Information panel
let level = 0;
let matchedCards;
let movesAvailable;

// Flag
let isProcessing = false;

// Preload images & sounds
function preloadImages() {
  for (let i = 0; i < CARDS.length; i++) {
    const image = new Image();
    const cardName = CARDS[i].name;
    image.src = "images/" + cardName + ".png";
    images.push({ name: cardName, image: image });
  }

  for (let i = 0; i < MODAL.length; i++) {
    const image = new Image();
    const cardName = MODAL[i].name;
    image.src = "images/" + cardName + ".webp";
    imagesModal.push({ name: cardName, image: image });
  }
}

function preloadAudios() {
  for (let i = 0; i < AUDIO.length; i++) {
    const audio = new Audio();
    const audioName = AUDIO[i].name;
    audio.src = "sounds/" + AUDIO[i].name;
    audios.push({ name: audioName, audio: audio });
  }
}

// Game start
$("#start").click(function () {
  let startIcon = document.querySelector("#game_start");
  startIcon.style.display = "none";
  preloadImages();
  preloadAudios();
  nextLevel();
});

// Game
function nextLevel() {
  initialize();
  dealCards();
}

// Restart
function initialize() {
  $(board).empty();
  level++;
  matchedCards = 0;
  movesAvailable = setMoves(level);
  cardsChosen = [];
  cardsChosenId = [];
  cardsLeft = [];
  refreshLevel();
  refreshMoves();
}

function setMoves() {
  let startingMoves;
  switch (level) {
    case 1:
      startingMoves = 10;
      break;
    case 2:
      startingMoves = 25;
      break;
    case 3:
      startingMoves = 50;
      break;
    case 4:
      startingMoves = 80;
      break;
    case 5:
      startingMoves = 100;
      break;
    default:
      break;
  }
  return startingMoves;
}

// Deal cards
function dealCards() {
  var cardsSorted = sortCard();
  cardsSorted.forEach(function (element, i) {
    var card = document.createElement("img");
    card.setAttribute("src", "images/Default.png");
    card.setAttribute("cardname", element);
    card.setAttribute("cardid", i);
    card.addEventListener("click", flipCard);
    cardsLeft.push(i);
    board.appendChild(card);
  });
}

// Sort Cards
function sortCard() {
  let cardsByLvl = [];
  // Calculate number of cards to sort depending on level
  let cardsAmountBylevel = level * 5;
  for (var i = 0; i < cardsAmountBylevel; i++) {
    cardsByLvl.push(CARDS[i].name);
  }

  // Generate Paired Cards
  let cardsPairedByLevel = cardsByLvl.concat(cardsByLvl);

  // Sort Cards
  cardsSorted = cardsPairedByLevel.sort(function () {
    return 0.5 - Math.random();
  });
  // Return Sorted, Paired of cards, depending on level
  return cardsSorted;
}

function flipCard() {
  if (isProcessing) {
    return; // prevent additional clicks while processing
  }

  var cardId = this.getAttribute("cardid");
  var cardName = this.getAttribute("cardname");

  cardsChosen.push(cardsSorted[cardId]);
  cardsChosenId.push(cardId);
  // this.setAttribute("src", "images/" + cardName + ".png");
  this.setAttribute(
    "src",
    images.find((img) => img.name === cardName).image.src
  );

  if (cardsChosen.length === 1) {
    let images = document.querySelectorAll("div#game_board img");
    images[cardId].style.pointerEvents = "none";
  }

  if (cardsChosen.length === 2) {
    isProcessing = true;
    movesAvailable--;
    refreshMoves();
    blockSelections();
    setTimeout(checkForMatch, 500);
  }
}

function blockSelections() {
  let images = document.querySelectorAll("div#game_board img");
  cardsLeft.forEach(
    (element) => (images[element].style.pointerEvents = "none")
  );
}

function unblockSelections() {
  let images = document.querySelectorAll("div#game_board img");
  cardsLeft.forEach(
    (element) => (images[element].style.pointerEvents = "auto")
  );
}

function checkForMatch() {
  let optionOne = cardsChosenId[0];
  let optionTwo = cardsChosenId[1];

  let images = document.querySelectorAll("div#game_board img");

  if (cardsChosen[0] === cardsChosen[1]) {
    playSound("yahoo.mp3");
    images[optionOne].style.pointerEvents = "none";
    images[optionTwo].style.pointerEvents = "none";

    images[optionOne].classList.add("paired");
    images[optionTwo].classList.add("paired");

    let res = cardsLeft.filter(
      (item) => item != cardsChosenId[0] && item != cardsChosenId[1]
    );
    cardsLeft = res;

    matchedCards++;
    setTimeout(() => {
      checkLevelUpdate();
      checkDefeat();
      isProcessing = false;
    }, 600);
  } else {
    images[optionOne].style.pointerEvents = "auto";
    images[optionOne].setAttribute("src", "images/Default.png");
    images[optionTwo].setAttribute("src", "images/Default.png");
    playSound("ouch.mp3");
    setTimeout(() => {
      checkDefeat();
      isProcessing = false;
    }, 500);
  }
  cardsChosen = [];
  cardsChosenId = [];
  unblockSelections();
}

function checkDefeat() {
  if (movesAvailable === 0) {
    Swal.fire({
      title: "YOU LOST!",
      imageUrl: imagesModal.find((img) => img.name === "Lose").image.src,
      imageHeight: 300,
      imageAlt: "Bart Crying image",
      confirmButtonText: "RESTART GAME!",
      confirmButtonColor: "black",
    });
    level = 0;
    setTimeout(nextLevel, 1000);
  }
}

function checkLevelUpdate() {
  if (level * 5 === matchedCards) {
    if (level != 5) {
      Swal.fire({
        title: "LEVEL " + level + " COMPLETED!",
        imageUrl: imagesModal.find((img) => img.name === "Win").image.src,
        imageHeight: 300,
        imageAlt: "Homer celebrating image",
        confirmButtonText: "NEXT LEVEL!",
        confirmButtonColor: "black",
      });
    } else {
      Swal.fire({
        title: "GAME COMPLETED!",
        imageUrl: imagesModal.find((img) => img.name === "Champion").image.src,
        imageHeight: 300,
        imageAlt: "Lisa celebrating image",
        confirmButtonText: "PLAY AGAIN!",
        confirmButtonColor: "black",
      });
      level = 0;
    }
    cardsLeft = [];
    nextLevel();
  }
}

function playSound(name) {
  const sound = audios.find((audio) => audio.name === name);
  if (sound) {
    sound.audio.play();
  }
}

function refreshLevel() {
  $("#level-title").text("Level: " + level);
}

function refreshMoves() {
  $("#Moves-left").text("Moves Available : " + movesAvailable);
}
