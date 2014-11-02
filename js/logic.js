window.onload = function() {
    var game = 0
    // We have a div called
    var output = document.getElementById("output");


    //funzioni di vincita o perdita
    var win = function() {
        game = game +1;
        score = score +1;
        output.innerHTML = "Your score is now " + score;
        if (game === 3) {
        roundEnded();
        } else { 
        again();
        }
    }

    var lose = function() {
        score = 0;
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
    saveScore();
} else {
            output.innerHTML = "Please enter yes or no.";
    roundEnded();
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
again()
// non toccare, fine funzione!
}





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
    compare(userChoice, computerChoice);

}
