 //Initialize the game by invoking the init function we created before.

 var scores , roundScore , activePlayer , gamePlaying;
 init();

 //Create function to initialize the game start in the case we start the game or press new game to achieve the DRY principle (Don't repeat your self).
 function init() {
     scores = [0,0];
     roundScore = 0;
     activePlayer = 0;
     gamePlaying = true;
    
   
   // to invisible the dice at the start of the app
   document.querySelector(".dice").style.display = "none";
   
   //Initialize both player and current results for both player .
   document.getElementById("score-0").textContent = 0;
   document.getElementById("score-1").textContent = 0;
   document.getElementById("current-0").textContent = 0;
   document.getElementById("current-1").textContent = 0;
   //initialize players names
   document.getElementById("name-0").textContent = "Player 1";
   document.getElementById("name-1").textContent = "Player 2";
   //get ride of the winner class panel from the winner
   document.querySelector(".player-0-panel").classList.remove("winner");
   document.querySelector(".player-1-panel").classList.remove("winner");
   //We want player one to start the game every time
   document.querySelector(".player-0-panel").classList.add("active");
   document.querySelector(".player-1-panel").classList.remove("active");

 }


// Add some interaction to the event clicking the roll button by our function
document.querySelector(".btn-roll").addEventListener("click", function () {
if (gamePlaying) {
     //1-Generate a randome variable dice with a random number from 1 to 6 .
     var dice = Math.floor(Math.random ()* 6) + 1;

     //2-Display the dice 
     //Creating diceDom variable with selecting dice element because we will use is frequently .
    var diceDom = document.querySelector(".dice");
 
 
    diceDom.style.display = "block";
     
     //3-Update the dice picture with the rolled number
     diceDom.src = "dice-" + dice +".png";
 
     //4-Update the round scroe if the rolled number not 1 .
     if (dice !== 1) {
         //Add score to the roundScore Vriable .
         roundScore +=dice;
         document.querySelector("#current-" + activePlayer).textContent = roundScore;
         
     }else {
 
        //We invoke nextPlayer function we created
     nextPlayer();
         
     }
}
});

// Add some interaction to the event clicking the hold button by our function
document.querySelector(".btn-hold").addEventListener("click", function () {
if (gamePlaying) {
      //Adding the current score player to his globalscore
      scores[activePlayer] += roundScore;

      //Update the UI
      document.querySelector("#score-" + activePlayer).textContent = scores[activePlayer];
  
     
  
      //Check if the player won the game by checking if his score achieve to reach 100 or more point
      if (scores[activePlayer] >= 100) {
          //If the active player press hold and his score is 100 or more so he is the winner!!.
  
  
          //Replacing the winner name with the Winner word.
          document.querySelector("#name-" + activePlayer).textContent = "Winner !!";
  
          //Adding the winner player to the winner class and remove the active class from him.
          document.querySelector(".player-" + activePlayer +"-panel").classList.add("winner");
  
          document.querySelector(".player-" + activePlayer +"-panel").classList.remove("active");
          gamePlaying = false;
          
      }else {
  
          //We invoke nextPlayer function we created
           nextPlayer();
  
      }
}
});

//We create a nextPlayer function to toggle the playing player in the case the player got dice roll = 1 or he choose to hold to give the other player the turn to play .
function nextPlayer() {
      // Give the round to the another player
      activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
      roundScore = 0;
 
      //Initialize the current score for both player 
      document.getElementById("current-0").textContent = "0";
      document.getElementById("current-1").textContent = "0";
 
 
      //Adding the active class that add grey background and bold font to the player name to the active player by toggling the class from or to the player .
      document.querySelector(".player-0-panel").classList.toggle("active");
      document.querySelector(".player-1-panel").classList.toggle("active");
    
}


//Initialize the game when New game button is clicked
document.querySelector(".btn-new").addEventListener("click", init);



