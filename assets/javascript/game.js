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
        // Change to pause button on music player
        $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png")
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
    // Music control based on button clicked
    musicControl(){
        var that = this;
        // toggles play/pause button
        $("#play-pause").on("click", function(){
            // Pauses song if music is playing
            if(musicPlaying){
                audio.pause();
                $("#play-pause-button").attr("src", "assets/images/glyphicons-174-play.png");
                musicPlaying = false; 
            }
            // Plays music if music is not playing
            else {
                audio.play();
                $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png");
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
            if(!lockChar){
                // Start background music if it is the first game
                if(firstGame){
                    music.playMusic();
                }
                // Prevents the player from choosing another character
                lockChar = true; 
                // Sets player data equal to that of clicked card
                $("#player").data(choosen); 
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
                //Pushes clicked card into enemyList array
                enemyList.push($(this).detach()); 
            }
            // Player choosing their enemy
            else if(!lockEnemy){
                // Prevents the player form choosing another defender
                lockEnemy = true; 
                //Sets defender data equal to that of clicked card
                $("#defender").data(choosen); 
                // Sets up defender card data for display
                $(".defender-name").text(choosen.name);
                $("#defender-img").attr("src", choosen.img);
                $("#defender-hp").text(choosen.hp);
                // Animation for displaying defender card
                $("#defender").css({"visibility": "visible", "opacity": 0.0}).animate({"opacity": 1.0}, 500);
                // Initializes defender variables
                newDefenderHp = choosen.hp;
                defenderCounter = choosen.counter;
                //Pushes clicked card into enemyList array
                enemyList.push($(this).detach()); 
            }
        });
    },
    // In game logic
    inGame(){
        var that = this;
        // Nothing happens when missing player or a defender
        if(!lockChar || !lockEnemy){
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
                }, 1000);
                // The only time player can lose is if defender still has HP
                setTimeout(that.loseGame, 2000);
            }
            // Player attack power increases by its base power
            newPlayerAttack = newPlayerAttack + $("#player").data().attack;
        }
    },
    // Popover for player attacks
    attackPopover(){
        // dynamically creating popover
        $("#player").popover({
            title: function(){return $("#player").data().name + " Attacked!"},
            content: function(){return "You did " + newPlayerAttack + " damage to " + $("#defender").data().name},
            html: true,
            placement: "right"
        });
        // prevents player from hitting attack button before popovers are hidden
        $(".btn").css("pointer-events", "none");
        $("#player").popover("show");
        setTimeout(function(){$("#player").popover("hide")}, 1000);
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
        setTimeout(function(){
            $("#defender").popover("hide");
            // Returns attack button functionality
            $(".btn").css("pointer-events", "auto");
        }, 1000);
        
    },
    // Defeating a single enemy
    winRound(){
        var that = this;
        if(lockEnemy && newDefenderHp <= 0){
            // Prevents player form hitting attack button when enemy is defeated
            $(".btn").css("pointer-events", "none"); 
            //animation for disappearing defender
            $("#defender").animate({"opacity": 0.0}, 1000); 
            setTimeout(function(){
                //Allows player to choose a new enemy
                lockEnemy = false; 
                //Can only win game after winning round
                that.winGame(); 
                //Restores attack button function
                $(".btn").css("pointer-events", "auto"); 
            }, 2000);
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
        if(isEmpty($("#enemy-choices")) && !lockEnemy) {
            $("#win-lose-img").attr("src", "assets/images/celebration.gif");
            $("#win-lose-text").text("YOU WIN!");
            $("#win-lose-modal").modal({show: true, keyboard: false, backdrop: "static"});
            // Creates a new object with character name and HP
            var winner = new highScoreObject ($("#player").data().name, newPlayerHp);
            highScore.push(winner);
            //Sorts from highest to lowest HP
            highScore.sort(function(a,b){ 
                return b.hp - a.hp;
            });
        }
    },
    // Used to reset the game if the player wins and wants to play again
    resetGame(){
        firstGame = false; 
        lockChar = false;
        lockEnemy = false;
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