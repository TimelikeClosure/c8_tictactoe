var TicTacToe = function(){
    this.canClick = true;
    this.playCount = 0;
    this.winArray = [
        [0,1,2],
        [3, 4, 5],
        [6, 7, 8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    this.gameState = localStorage.getItem("gameState");

    if(!this.gameState){
        this.gameState = {
            boardState: [null, null, null, null, null, null, null, null, null],
            currentPlayer: player1
        };
    } else{
        this.gameState = JSON.parse(this.gameState);
    }

};

var GamePiece = function(){
    this.name = "";
    this.image = "";
    };

var Player = function(){
    this.name = "";
    this.piece = {};
};
// var canClick = true,
//     playCount = 0,
//     winArray = [
//         [0,1,2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0,3,6],
//         [1,4,7],
//         [2,5,8],
//         [0,4,8],
//         [2,4,6]
//     ],

//these will all become new gamePiece instantiations
var mushroomPiece = new GamePiece();
    mushroomPiece.name = "mushroom";
    mushroomPiece.image = "assets/images/piece_mushroom.png";

var pepperPiece = new GamePiece();
    pepperPiece.name = "greenpepper";
    pepperPiece.image = "assets/images/piece_green_pepper.png";

var pepperoniPiece = new GamePiece();
    pepperoniPiece.name = "pepperoni";
    pepperoniPiece.image = "assets/images/piece_pepperoni.png";

 var player1 = new Player();
    player1.name = "Player 1";
    player1.piece = mushroomPiece;

var player2 = new Player();
    player2.name = "Player 2";
    player2.piece = pepperoniPiece;

    //var gameState = localStorage.getItem("gameState");

    // if(!gameState){
    //     gameState = {
    //     boardState: [null, null, null, null, null, null, null, null, null],
    //     currentPlayer: player1
    //     };
    // } else{
    //     gameState = JSON.parse(gameState);
    // }

TicTacToe.prototype.checkWin = function(playerPiece){
    var playerArray = [];
    for(var i=0; i < this.gameState.boardState.length; i++){
        //loop through gameState array for existing img srcs
        if(this.gameState.boardState[i] === playerPiece.piece.image){
            // if there is a src match push that index to playerArray
            playerArray.push(i);
            // console.log(playerArray);
        }
    }
    for (i = 0; i < this.winArray.length; i++) {
        //enter into each item in winArray
        var isWinner = true;
        //isWinner will be set to false whenever a subArray does not meet win condition
        for (j = 0; j < this.winArray[i].length; j++) {
            //check each item in subArrays of winArray
            if(playerArray.indexOf(this.winArray[i][j])===-1){
                //if subArray[j] is not in playerArray, not a winner
                isWinner = false;
                // console.log("isWinner inside 2nd for loop: " + isWinner);
                break;
                //break out of current subArray loop and move to next one
            }
        }
        //check if isWinner is true, if so, there was a win condition, current player wins
        if(isWinner === true){
            this.canClick = false;
            var $h3WinMessage = $("<h3>"+ playerPiece.name + " wins!" + "</h3>");
            $("#player-board").append($h3WinMessage);
            $("#game-reset").show();
        }
    }
    if(this.playCount === 9 && isWinner === false){
        //if all cells have been filled and there's no winner, it's a tie
        this.canClick = false;
        var $h3TieMessage = $("<h3>" + "game is a tie." + "</h3>");
        $("#player-board").append($h3TieMessage);
        $("#game-reset").show();
    }

}

TicTacToe.prototype.resetGame = function() {

    //reset playCount
    this.playCount = 0;
    //remove localStorage item
    localStorage.removeItem("gameState");
    
    //reset boardState
    this.gameState.boardState = [null, null, null, null, null, null, null, null, null];
    
    //reset board
    $(".game-cell").each(function(){
       $(this).html(""); 
    });

    //reset win/tie messages
    $("#player-board").find("h3").remove();

    //reset cursors
    $("#game-board").removeClass("pepperoni_cursor");
    $("#game-board").removeClass("mushroom_cursor");
    $("#game-board").removeClass("greenpepper_cursor");

    //set cursor and player1 to currentPlayer in temp holder var
    this.setCursor(this.gameState.currentPlayer);

    //hide reset button
    $("#game-reset").hide();

}

TicTacToe.prototype.setCursor = function(currentPlayer){
    if(currentPlayer.piece.name === "pepperoni"){
        console.log(currentPlayer.piece.name);
        // remove mushroom and greenpepper, add pepperoni
        $("#game-board").removeClass("mushroom_cursor");
        $("#game-board").removeClass("greenpepper_cursor");
        $("#game-board").addClass("pepperoni_cursor");
    } else if(currentPlayer.piece.name === "mushroom"){
        console.log(currentPlayer.piece.name);
        //remove greenpepper and pepperoni, add mushroom
        $("#game-board").removeClass("pepperoni_cursor");
        $("#game-board").removeClass("greenpepper_cursor");
        $("#game-board").addClass("mushroom_cursor");
    } else {
        console.log(currentPlayer.piece.name);
        //else green pepper cursor
        $("#game-board").removeClass("pepperoni_cursor");
        $("#game-board").removeClass("mushroom_cursor");
        $("#game-board").addClass("greenpepper_cursor");
    }
}

TicTacToe.prototype.playerInputInit = function(){
    //canClick is false
    this.canClick = false;
    //show form
    if($("#form-board").is(":hidden")){
        $("#form-board").show();
    }
    //show player1 input
    $(".form-container1").show();
    //hide player 2 input
    $(".form-container2").hide();
}

TicTacToe.prototype.player2FormInit = function(){
    //hide player1 input
    $(".form-container1").hide();
    //show player 2 input
    $(".form-container2").show();

    //hide player 1's piece choice from options for player 2
    $(".form-container2 input:radio").each(function(){
        if( $(this).val() === player1.piece.name ){
            $(this).hide();
        }
    });

}

$(document).ready(function(){

    var newGame = new TicTacToe();
    
    $("#form-board").hide();
    
    //populates the board with localStorage saved values if there are any
    $(".game-cell").each(function(){
        //get ID of cell div
        var $id = $(this).attr("id");
        var index = $id[$id.length-1];

        if(newGame.gameState.boardState[index]){
            var $img = $("<img>").attr("src", newGame.gameState.boardState[index]);
            $(this).html($img);
        }
    });

    //hide reset game button by default
    $("#game-reset").hide();
    newGame.checkWin(player1);
    newGame.checkWin(player2);

    //set cursor initially, with player 1
    newGame.setCursor(player1);

    //run function to assign piece objects to player objects (run again on new game button click
    $(".game-cell").on("click",function() {

        if (newGame.canClick === true) {

        var $this = $(this);

        var $id = $this.attr("id");

        var index = $id[$id.length-1];

        if(!newGame.gameState.boardState[index]) {
            console.log(newGame.gameState.currentPlayer.piece.image);
            //if the html is empty
            // create an image element with a src equal to current player's piece image

            newGame.gameState.boardState[index] = newGame.gameState.currentPlayer.piece.image;

            var $img = $("<img>").attr("src", newGame.gameState.boardState[index]);

            //insert it into the cell clicked on
            $this.html($img);
            //update play count
            newGame.playCount++;
            // check for win
            newGame.checkWin(newGame.gameState.currentPlayer);
            // switch player to other player
            if(newGame.gameState.currentPlayer.name === player1.name){
                newGame.gameState.currentPlayer = player2;
                newGame.setCursor(newGame.gameState.currentPlayer);
            }else {
                newGame.gameState.currentPlayer = player1;
                newGame.setCursor(newGame.gameState.currentPlayer);
            }
            localStorage.setItem("gameState", JSON.stringify(newGame.gameState));
            console.log(localStorage.getItem("gameState"));
        }
    }
    });

    //click handler for reset button
    $("#game-reset").on("click",function(){

        newGame.resetGame();
        newGame.canClick = true;
    });
});