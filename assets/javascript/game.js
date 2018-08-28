// Data sets for the different characters
$("#luffy").data({ "name": "Monkey D. Luffy", "hp": 120, "attack": 14, "counter": 8, "img": "assets/images/luffy.jpg"})
$("#buggy").data({ "name": "Buggy The Clown", "hp": 100, "attack": 12, "counter": 3, "img": "assets/images/buggy.png"})
$("#kuma").data({ "name": "Bartholomew Kuma", "hp": 160, "attack": 16, "counter": 25, "img": "assets/images/kuma.jpg"})
$("#doflamingo").data({ "name": "Donquixote Doflamingo", "hp": 200, "attack": 20, "counter": 20, "img": "assets/images/doflamingo.jpg"})
// Music for the game
var musicsrc = ["assets/sounds/01-we-are.mp3", "assets/sounds/02-bon-voyage.mp3", "assets/sounds/03-map-of-heart.mp3", "assets/sounds/04-hands-up.mp3"];
var audio=new Audio();
var musicPlaying = false;
var musicIndex = 0;

// Variable declarations
var lockChar = false;
var lockEnemy = false;
var firstGame = true;
var enemyList = [];
var highScore = [];
function highScoreObject(name, hp){
    this.name = name;
    this.hp = hp;
}
var newPlayerHp = 0;
var newDefenderHp = 0;
var newPlayerAttack = 0;
var defenderCounter = 0;

// Music Controls
var music = {
    playMusic(){
        var that = this;
        audio.src = musicsrc[musicIndex]
        audio.play();
        musicPlaying = true; 
        // senses when song has ended and then autoplays next song
        audio.addEventListener("ended", function(){
            that.nextSong();
        })
    },
    nextSong(){
        musicIndex++;
        $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png")
        // prevents musicIndex from getting a value outside of musicsrc array
        if(musicIndex == musicsrc.length){
            musicIndex = 0;
            this.playMusic();
        }
        else{
        this.playMusic();
        }
    },
    previousSong(){
        musicIndex--;
        $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png")
        // prevents musicIndex from getting a value outside of musicsrc array
        if(musicIndex < 0){
            musicIndex = (musicsrc.length - 1);
            this.playMusic();
        }
        else{
            this.playMusic();
        }
    },
    musicControl(){
        var that = this;
        // toggles play/pause button
        $("#play-pause").on("click", function(){
            if(musicPlaying == true){
                audio.pause();
                $("#play-pause-button").attr("src", "assets/images/glyphicons-174-play.png");
                musicPlaying = false; 
            }
            else {
                audio.play();
                $("#play-pause-button").attr("src", "assets/images/glyphicons-175-pause.png")
                musicPlaying = true;
            }
        })
        $("#next-song").on("click", function(){
            that.nextSong();
        })
        $("#previous-song").on("click", function(){
            that.previousSong();
        })
    }
}

// The Game
var rpg = {
    // Used to reset the game if the player wins and wants to play again
    initializeGame(){
        firstGame = false; 
        music.nextSong();
        $("#defender").css("visibility", "hidden");
        $("#enemy-choice-title").css("visibility", "hidden");
        $.each(enemyList, function(i, v){
            $("#enemy-choices").append(v);
        });
        lockChar = false;
        lockEnemy = false;
        $("#player").css("visibility", "hidden");
        enemyList = [];
    },
    // Starts the game
    startGame(){
        // Clicking the characters cards
        $(".container-fluid").on("click", ".char-choice", function(){
            var choosen = $(this).data();
            // Player choosing their character
            if(lockChar !== true){
                if(firstGame == true){
                    music.playMusic();
                }
                // Prevents the player from choosing another character
                lockChar = true;
                $("#player").data($(this).data());
                $("#enemy-choice-title").css("visibility", "visible");
                $("#player").css({"visibility": "visible", "opacity": 0.0}).animate({"opacity": 1.0}, 500);
                $("#player-name").text(choosen.name);
                $("#player-img").attr("src", choosen.img);
                $("#player-hp").text(choosen.hp);
                newPlayerHp = choosen.hp;
                newPlayerAttack = choosen.attack;
                $(".enemy-name, .enemy-footer").css({"background-color": "#000000", "color": "#ffffff"});
                enemyList.push($(this).detach());
            }
            // Player choosing their enemy
            else if(lockEnemy !== true){
                // Prevents the player form choosing another defender
                lockEnemy = true; 
                $("#defender").css({"visibility": "visible", "opacity": 0.0}).animate({"opacity": 1.0}, 500);
                $("#defender").data($(this).data());
                $(".defender-name").text(choosen.name);
                $("#defender-img").attr("src", choosen.img);
                $("#defender-hp").text(choosen.hp);
                newDefenderHp = choosen.hp;
                defenderCounter = choosen.counter;
                enemyList.push($(this).detach());
            }
        });
    },
    // In game logic
    inGame(){
        var that = this;
        // Nothing happens when missing a player character and a defender
        if(lockChar == false || lockEnemy == false){
            return;
        }
        else{
            this.attackPopover();
            newDefenderHp = newDefenderHp - newPlayerAttack;
            $("#defender-hp").text(newDefenderHp);
            if(newDefenderHp > 0){
                setTimeout(function(){
                    that.counterPopover();
                    newPlayerHp = newPlayerHp - $("#defender").data().counter;
                    $("#player-hp").text(newPlayerHp);
                }, 1500);
                setTimeout(function(){that.loseGame()}, 3500);
            }
            newPlayerAttack = newPlayerAttack + $("#player").data().attack;
        }
    },
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
    counterPopover(){
        $("#defender").popover({
            title: function(){return $("#defender").data().name + " Countered!"},
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
            // Prevents player form hitting attack button when enemy is already defeated
            $(".btn").css("pointer-events", "none");
            // Allows player to choose a new enemy
            newEnemy = true;
            $("#defender").animate({"opacity": 0.0}, 1000);
            setTimeout(function(){
                lockEnemy = false;
                that.winGame();
                $(".btn").css("pointer-events", "auto");
            }, 1500);
        }
    },
    // Lose the game when player HP reaches 0
    loseGame(){
        if(newDefenderHp > 0 && newPlayerHp <= 0){
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
            $("#win-lose-text").text("YOU WIN!");
            $("#win-lose-modal").modal({show: true, keyboard: false, backdrop: "static"});
            var winner = new highScoreObject ($("#player").data().name, newPlayerHp);
            highScore.push(winner);
            highScore.sort(function(a,b){
                return b.hp - a.hp;
            });
        }
        
    }
}
$(document).ready(function(){
    rpg.startGame();
    music.musicControl();
    // Clicking the attack button
    $("#attack-button").on("click", function(){
        rpg.inGame();
        rpg.winRound();
        rpg.winGame();
    });
});