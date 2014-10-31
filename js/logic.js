window.onload = function() {
    // We have a div called 
    var output = document.getElementById("output");

    var userChoice = prompt("Do you choose rock, paper or scissors?");
var computerChoice = Math.random();
if (computerChoice < 0.34) {
	computerChoice = "rock";
} else if(computerChoice <= 0.67) {
	computerChoice = "paper";
} else {
	computerChoice = "scissors";
}
output.innerHTML = "Computer: " + computerChoice;

var compare = function(choice1,choice2) {
if (choice1 === choice2) {
    output.innerHTML = "The result is a tie!";
    var userChoice = prompt("Do you choose rock, paper or scissors?");
var computerChoice = Math.random();
compare(userChoice,computerChoice);
}
else if (choice1 === "rock") {

if (choice2 === "scissors") {
    output.innerHTML = "rock wins"; }
    else {
        output.innerHTML = "paper wins";}

} // fine funzione choice === rock
    
else if (choice1 === "paper") {

if (choice2 === "rock") {
    output.innerHTML = "paper wins"; }
    else {
        output.innerHTML = "scissors wins";}

} //fine funzione choice === paper
    
else if (choice1 === "scissors") {

if (choice2 === "rock") {
    output.innerHTML = "rock wins";}
    else {
        output.innerHTML =  "scissors wins";}

} // fine funzione choice === scissors
    
else {
    output.innerHTML = "Please write rock,scissors or paper"; }

// non toccare, fine funzione!
}
compare(userChoice,computerChoice);
}

