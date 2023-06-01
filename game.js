
var cards = [
    {
        name: "Homero",
    },
    {
        name: "Bart",
    },
    {
        name: "Lisa",
    },
    {
        name: "Marge",
    },
    {
        name: "Maggie",
    },
    {
        name: "Apu",
    },
    {
        name: "Burns",
    },
    {
        name: "Flanders",
    },
    {
        name: "Grandpa",
    },
    {
        name: "Moe",
    },
    {
        name: "Bob",
    },
    {
        name: "Gorgory",
    },
    {
        name: "Krusty",
    },
    {
        name: "Milhouse",
    },
    {
        name: "Ralph",
    },
    {
        name: "Edna",
    },
    {
        name: "Otto",
    },
    {
        name: "Selma",
    },
    {
        name: "Tony",
    },
    {
        name: "Professor",
    },
    {
        name: "Blinky",
    },
    {
        name: "Itchy",
    },
    {
        name: "Kang",
    },
    {
        name: "Santa",
    },
    {
        name: "Scratchy",
    },
    // "Homero", "Bart", "Lisa", "Marge", "Maggie", 
    // "Apu", "Burns", "Flanders", "Grandpa", "Moe",
    // "Bob", "Gorgory", "Krusty", "Milhouse", "Ralph",
    // "Edna", "Otto", "Selma", "Tony", "Professor",
    // "Blinky", "Itchy", "Kang", "Santa", "Scratchy"
    // "Brandine", "Duffman", "Snowball"

];

// Cards & choices
let board = document.querySelector("#game_board");
let images = document.querySelectorAll("div#game_board img");

let cardsSorted = [];
let cardsChosen = [];
let cardsChosenId = [];

let cardsLeft = [];
let resto = [];


// Information panel
let level = 0;
let matchedCards;
let movesAvailable;


// Game start
$("#start").click(function () {
    let startIcon = document.querySelector("#game_start");
    startIcon.style.display = "none";
    nextLevel();
})

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
        card.setAttribute('src', 'images/Default.png');
        card.setAttribute('cardname', element);
        card.setAttribute('cardid', i);
        card.addEventListener("click", flipCard);
        cardsLeft.push(i);
        board.appendChild(card);
    })

};


// Sort Cards
function sortCard() {
    let cardsByLvl = [];
    // Calculate number of cards to sort depending on level
    let cardsAmountBylevel = (level * 5);
    for (var i = 0; i < cardsAmountBylevel; i++) {
        cardsByLvl.push(cards[i].name);
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
    var cardId = this.getAttribute('cardid');
    var cardName = this.getAttribute('cardname');

    cardsChosen.push(cardsSorted[cardId]);
    cardsChosenId.push(cardId);
    this.setAttribute('src', 'images/' + cardName + '.png')
    if (cardsChosen.length === 1) {
        let images = document.querySelectorAll("div#game_board img");
        images[cardId].style.pointerEvents = "none";
    }
    if (cardsChosen.length === 2) {
        movesAvailable--;
        refreshMoves();
        blockSelections();
        setTimeout(checkForMatch, 500)
    }
}

function blockSelections() {
    let images = document.querySelectorAll("div#game_board img");
    cardsLeft.forEach(element => images[element].style.pointerEvents = "none");

}

function unblockSelections() {
    let images = document.querySelectorAll("div#game_board img");
    cardsLeft.forEach(element => images[element].style.pointerEvents = "auto");

}

function checkForMatch() {
    let ChosenOne = cardsChosen[0];
    let ChosenTwo = cardsChosen[1];

    let optionOne = cardsChosenId[0];
    let optionTwo = cardsChosenId[1];

    let images = document.querySelectorAll("div#game_board img");

    if (cardsChosen[0] === cardsChosen[1]) {
        playSound("yahoo");
        images[optionOne].style.pointerEvents = "none";
        images[optionTwo].style.pointerEvents = "none";

        images[optionOne].classList.add("paired");
        images[optionTwo].classList.add("paired");


        let res = cardsLeft.filter(item => ((item != cardsChosenId[0] && item != cardsChosenId[1])))
        cardsLeft = res;

        matchedCards++;
        setTimeout(checkLevelUpdate, 600);

    } else {
        images[optionOne].style.pointerEvents = "auto";
        images[optionOne].setAttribute('src', 'images/Default.png');
        images[optionTwo].setAttribute('src', 'images/Default.png');
        playSound("ouch");

    }
    setTimeout(checkDefeat, 800);

    cardsChosen = [];
    cardsChosenId = [];
    unblockSelections();
}

function excludeChoises(element) {
    if (element != cardsChosenId[0] && element != cardsChosenId[1]) {
        return element;
    }
}


function checkDefeat() {
    if (movesAvailable === 0) {
        Swal.fire({
            title: "YOU LOST!",
            imageUrl: 'https://media.giphy.com/media/RJlSvRxLoD8o8Poioh/giphy.gif', //BART
            imageHeight: 300,
            imageAlt: 'Bart Crying image',
            confirmButtonText: "RESTART GAME!",
            confirmButtonColor: 'black'
            
        })
        level = 0;
        setTimeout(nextLevel, 1000)
    }
};

function checkLevelUpdate() {
    if (level * 5 === matchedCards) {
        if (level != 5) {
            Swal.fire({
                title: "LEVEL " + level + " COMPLETED!",
                imageUrl: 'https://media.giphy.com/media/ZCldwd8JpfXgY/giphy.gif', //HOMER
                imageHeight: 300,
                imageAlt: 'Homer celebrating image',
                confirmButtonText: "NEXT LEVEL!",
                confirmButtonColor: "black"

            })
        } else {
            Swal.fire({
                title: "GAME COMPLETED!",
                imageUrl: 'https://media.giphy.com/media/uglH7hBsJrTRm/giphy.gif', //LISA
                imageHeight: 300,
                imageAlt: 'Homer celebrating image',
                confirmButtonText: "PLAY AGAIN!",
                confirmButtonColor: "black"
            })
            level = 0;
        }
        cardsLeft = [];
        nextLevel();
    }
};


// Animations
function animatePress(currentColour) {
    $("." + currentColour).addClass("pressed");
    setTimeout(
        function () {
            //do something special
            $("." + currentColour).removeClass("pressed");
        }, 150);
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}


function refreshLevel() {
    $("#level-title").text("Level: " + level);
}

function refreshMoves() {
    $("#Moves-left").text("Moves Available : " + movesAvailable);
}
