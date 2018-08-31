// Data sets for the different characters
$("#luffy").data({ "name": "Monkey D. Luffy", "hp": 120, "attack": 8, "counter": 10, "img": "assets/images/luffy.jpg"})
$("#buggy").data({ "name": "Buggy The Clown", "hp": 100, "attack": 12, "counter": 5, "img": "assets/images/buggy.png"})
$("#kuma").data({ "name": "Bartholomew Kuma", "hp": 150, "attack": 5, "counter": 20, "img": "assets/images/kuma.jpg"})
$("#doflamingo").data({ "name": "Donquixote Doflamingo", "hp": 180, "attack": 3, "counter": 25, "img": "assets/images/doflamingo.jpg"})
// Music for the game
var musicSrc = ["assets/sounds/01-we-are.mp3", "assets/sounds/02-bon-voyage.mp3", "assets/sounds/03-map-of-heart.mp3", "assets/sounds/04-hands-up.mp3"];
var audio=new Audio();
var musicPlaying = false;
var musicIndex = 0;

// Variable declarations
var lockChar = false;
var lockEnemy = false;
var firstGame = true;
var enemyList = [];
var newPlayerHp = 0;
var newDefenderHp = 0;
var newPlayerAttack = 0;
var defenderCounter = 0;
var highScore = [];
// Constructor for creating highscore objects
function highScoreObject(name, hp){
    this.name = name;
    this.hp = hp;
}
// Music Controls
var music = {
    playMusic(){
        var that = this;
        audio.src = musicSrc[musicIndex]
        audio.play();
        musicPlaying = true; 
        // senses when song has ended and then autoplays next song
        audio.addEventListener("ended", function(){
            musicIndex ++;
            that.changeSong();
        })
    },
    // Changes to next song or previous song depending on how musicIndex was changed
    changeSong(){
        $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png");
        // Prevents musicIndex from getting outside of musicSrc
        if(musicIndex == musicSrc.length){
            // Returns to the first song
            musicIndex = 0;
        }
        else if (musicIndex < 0){
            // Returns to the last song
            musicIndex = (musicSrc.length - 1);
        }
        this.playMusic();
    },
    musicControl(){
        var that = this;
        // toggles play/pause button
        $("#play-pause").on("click", function(){
            // Pauses song
            if(musicPlaying == true){
                audio.pause();
                $("#play-pause-button").attr("src", "assets/images/glyphicons-174-play.png");
                musicPlaying = false; 
            }
            // Plays song
            else {
                console.log("play music")
                that.playMusic();
                $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png")
                musicPlaying = true;
            }
        })
        // Plays next song
        $("#next-song").on("click", function(){
            musicIndex++;
            that.changeSong();
        })
        // Plays previous song
        $("#previous-song").on("click", function(){
            musicIndex--;
            that.changeSong();
        })
    }
}

// The Game
var rpg = {
    // Starts the game
    startGame(){
        // Clicking the characters cards
        $(".container-fluid").on("click", ".char-choice", function(){
            var choosen = $(this).data();
            // Player choosing their character
            if(lockChar !== true){
                lockChar = true; // Prevents the player from choosing another character
                $("#player").data($(this).data()); // Sets player data equal to that of clicked card
                $("#enemy-choice-title").css("visibility", "visible");
                $(".enemy-name, .enemy-footer").css({"background-color": "#000000", "color": "#ffffff"});
                // Sets up player card data for display
                $("#player-name").text(choosen.name);
                $("#player-img").attr("src", choosen.img);
                $("#player-hp").text(choosen.hp);
                // Animation for displaying player card
                $("#player").css({"visibility": "visible", "opacity": 0.0}).animate({"opacity": 1.0}, 500);
                // Initializes player variables
                newPlayerHp = choosen.hp;
                newPlayerAttack = choosen.attack;
                enemyList.push($(this).detach()); //Pushes clicked card into enemyList array
            }
            // Player choosing their enemy
            else if(lockEnemy !== true){
                lockEnemy = true; // Prevents the player form choosing another defender
                $("#defender").data($(this).data()); //Sets defender data equal to that of clicked card
                // Sets up defender card data for display
                $(".defender-name").text(choosen.name);
                $("#defender-img").attr("src", choosen.img);
                $("#defender-hp").text(choosen.hp);
                // Animation for displaying defender card
                $("#defender").css({"visibility": "visible", "opacity": 0.0}).animate({"opacity": 1.0}, 500);
                // Initializes defender variables
                newDefenderHp = choosen.hp;
                defenderCounter = choosen.counter;
                enemyList.push($(this).detach()); //Pushes clicked card into enemyList array
            }
        });
    },
    // In game logic
    inGame(){
        var that = this;
        // Nothing happens when missing player or a defender
        if(lockChar == false || lockEnemy == false){
            return;
        }
        else{
            // Player attacks defender first
            this.attackPopover();
            newDefenderHp = newDefenderHp - newPlayerAttack;
            $("#defender-hp").text(newDefenderHp);
            // If defender is not dead, then he can counter-attack
            if(newDefenderHp > 0){
                setTimeout(function(){
                    that.counterPopover();
                    newPlayerHp = newPlayerHp - $("#defender").data().counter;
                    $("#player-hp").text(newPlayerHp);
                }, 1500);
                // The only time you can lose is if defender still has HP
                setTimeout(function(){that.loseGame()}, 3500);
            }
            // Player attack power increases by its base power
            newPlayerAttack = newPlayerAttack + $("#player").data().attack;
        }
    },
    // Popover for player attacks
    attackPopover(){
        $("#player").popover({
            title: function(){return $("#player").data().name + " Attacked!"},
            content: function(){return "You did " + newPlayerAttack + " damage to " + $("#defender").data().name},
            html: true,
            placement: "right"
        });
        $("#player").popover("show");
        setTimeout(function(){$("#player").popover("hide")}, 1500);
    },
    // Popover for defender counter-attacks
    counterPopover(){
        $("#defender").popover({
            title: function(){return $("#defender").data().name + " Counter-Attacked!"},
            content: function(){return "He did " + defenderCounter + " damage to you!"},
            html: true,
            placement: "left"
        });
        $("#defender").popover("show");
        setTimeout(function(){$("#defender").popover("hide")}, 1500);
    },
    // Defeating a single enemy
    winRound(){
        var that = this;
        if(lockEnemy == true && newDefenderHp <= 0){
            $(".btn").css("pointer-events", "none"); // Prevents player form hitting attack button when enemy is defeated
            $("#defender").animate({"opacity": 0.0}, 1000); //animation for disappearing defender
            setTimeout(function(){
                lockEnemy = false; //Allows player to choose a new enemy
                that.winGame(); //Can only win game after winning round
                $(".btn").css("pointer-events", "auto"); //Restores attack button function
            }, 2500);
        }
    },
    // Lose the game when player HP reaches 0 and defender is still alive
    loseGame(){
        if(newDefenderHp > 0 && newPlayerHp <= 0){
            $("#win-lose-img").attr("src", "assets/images/crying.gif");
            $("#win-lose-text").text("YOU LOST!");
            $("#win-lose-modal").modal({show: true, keyboard: false, backdrop: "static"});
        }
    },
    // Winning the entire game when you defeat all enemies
    winGame(){
        // Makes sure the selected element is empty
        function isEmpty(el){
            return !$.trim(el.html());
        }
        if(isEmpty($("#enemy-choices")) && lockEnemy == false) {
            $("#win-lose-img").attr("src", "assets/images/celebration.gif");
            $("#win-lose-text").text("YOU WIN!");
            $("#win-lose-modal").modal({show: true, keyboard: false, backdrop: "static"});
            // Creates a new object with character name and HP
            var winner = new highScoreObject ($("#player").data().name, newPlayerHp);
            highScore.push(winner);
            highScore.sort(function(a,b){ //Sorts from highest to lowest HP
                return b.hp - a.hp;
            });
        }
    },
    // Used to reset the game if the player wins and wants to play again
    resetGame(){
        firstGame = false; 
        lockChar = false;
        lockEnemy = false;
        musicIndex++;
        music.changeSong();
        $("#player").css("visibility", "hidden");
        $("#defender").css("visibility", "hidden");
        $("#enemy-choice-title").css("visibility", "hidden");
        // Resets the enemy list
        $.each(enemyList, function(i, v){
            $("#enemy-choices").append(v);
        });
        // Displays to the high score board
        for(var i = 0; i < highScore.length; i++){
            $("#name" + (i+1)).text(highScore[i].name);
            $("#hp"+ (i+1)).text(highScore[i].hp);
        }
        enemyList = []; //empties the enemyList array
    }
}
$(document).ready(function(){
    rpg.startGame();
    music.musicControl();
    // Clicking the attack button
    $("#attack-button").on("click", function(){
        rpg.inGame();
        rpg.winRound();
    });
});