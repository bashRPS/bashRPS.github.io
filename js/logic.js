// TO DO:
// ROUND:
// vinci tutte e 3: score +3 e vuoi giocare di nuovo
// vinci 2: score +2 e vuoi giocare di nuovo
// vinci 1: score = 0 e perdi (hai perso :( )


window.onload = function() {
    var scoregame = 0
    var game = 0
    var firstTime = true;
    // We have a div called
    var output = document.getElementById("output");


    //funzioni di vincita o perdita
    var win = function() {
        game = game +1;
        scoregame = scoregame +1;
        output.InnerHTML = "You won the round " + game;
        if (game === 3) {
        roundEnded();
        } else { 
        again();
        }
    }

    var lose = function() {
        game = game+1;
        if (game === 3) {
        roundEnded();
        } else { 
        again();
        }
    }

var score = 0;

var roundEnded = function() {
    game = 0;
    if (scoregame <= 1) {
        output.innerHTML = "Sorry, you lost :(";
        scoregame=0;
        score = 0;
        quit();
    } else if (scoregame === 2) {
        score = score + 2;
        output.InnerHTML = "Your score is now " + score;
        scoregame=0;
        play();
    } else { score = score + 3;
            output.InnerHTML = "Your score is now " + score;
            scoregame=0;
            play();
           }
}

    
    var play = function() {
    var go = prompt ("Do you want to play again?");
    if (go === "yes") {
        var userChoice = prompt("Do you choose rock, paper or scissors?");
    var computerChoice = Math.random();
    if (computerChoice < 0.34) {
	computerChoice = "rock";
} else if(computerChoice <= 0.67) {
	computerChoice = "paper";
} else {
	computerChoice = "scissors";
}
    compare(userChoice, computerChoice);
} else if (go === "no") {
    output.innerHTML = "Your final score is " + score;
    score = 0;
    quit();
} else {
            output.innerHTML = "Please enter yes or no.";
    play();
}
    }

var again = function() {
    var userChoice = prompt("Do you choose rock, paper or scissors?");
    var computerChoice = Math.random();
    if (computerChoice < 0.34) {
	computerChoice = "rock";
} else if(computerChoice <= 0.67) {
	computerChoice = "paper";
} else {
	computerChoice = "scissors";
}
    compare(userChoice, computerChoice);

    }



var compare = function(choice1,choice2) {
if (choice1 === choice2) {
    output.innerHTML = "The result is a tie!";
    again();
}
else if (choice1 === "rock") {

if (choice2 === "scissors") {
    output.innerHTML = "The computer was scissors, so you won!";
win();
}
    else {
        output.innerHTML = "The computer was paper so you lose.";
    lose();
    }

} // fine funzione choice === rock

else if (choice1 === "paper") {

if (choice2 === "rock") {
    output.innerHTML = "The computer was rock, so you won!";
win();
}

    else {
        output.innerHTML = "The computer was scissors, so you lose.";
    lose();
    }

} //fine funzione choice === paper

else if (choice1 === "scissors") {

if (choice2 === "rock") {
    output.innerHTML = "The computer was rock, so you lose.";
lose();
}
    else {
        output.innerHTML =  "The computer was paper, so you won!";
    win();
    }

} else if (choice1 === "score?") {
    output.innerHTML= "Your score now is " + score; } else if (choice1 === "game?") {
    output.innerHTML= "Your game now is " + game; }

    // fine funzione choice === scissors

else {
    output.innerHTML = "Please write rock,scissors or paper."; }
again();
// non toccare, fine funzione!
}



if (firstTime = true) {

// starta il gioco per la prima volta
var userChoice = prompt("Do you choose rock, paper or scissors?");
    var computerChoice = Math.random();
    if (computerChoice < 0.34) {
	computerChoice = "rock";
} else if(computerChoice <= 0.67) {
	computerChoice = "paper";
} else {
	computerChoice = "scissors";
}
    firstTime = false;
    compare(userChoice, computerChoice);
} else {quit();};

}
