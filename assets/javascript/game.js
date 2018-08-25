// Data sets for the different characters
$("#luffy").data({ "name": "Monkey D. Luffy", "hp": 120, "attack": 14, "counter": 8, "img": "assets/images/luffy.jpg"})
$("#buggy").data({ "name": "Buggy The Clown", "hp": 100, "attack": 12, "counter": 3, "img": "assets/images/buggy.png"})
$("#kuma").data({ "name": "Bartholomew Kuma", "hp": 160, "attack": 16, "counter": 20, "img": "assets/images/kuma.jpg"})
$("#doflamingo").data({ "name": "Donquixote Doflamingo", "hp": 200, "attack": 20, "counter": 18, "img": "assets/images/doflamingo.jpg"})
// Music for the game
var musicsrc = ["assets/sounds/01-we-are.mp3", "assets/sounds/02-bon-voyage.mp3", "assets/sounds/03-map-of-heart.mp3", "assets/sounds/04-hands-up.mp3"];
var audio=new Audio();
var musicPlaying = false;
// Variable declarations
var lockChar = false;
var lockEnemy = false;
var firstAttack = true;
var newEnemy = false;
var newPlayerHp = 0;
var newDefenderHp = 0;
var newPlayerAttack = 0;
var musicIndex = 0;
// Functions for showing or hiding results
function showAttack(){
    $("#attack").css("visibility", "visible");
}
function hideAttack(){
    $("#attack").css("visibility", "hidden");
} 
function showCounter(){
    $("#counter").css("visibility", "visible");
}
function hideCounter(){
    $("#counter").css("visibility", "hidden");
}
function showResult(){
    $("#result").css("visibility", "visible");
} 
function hideResult(){
    $("#result").css("visibility", "hidden");
}
// The Game
var rpg = {
    // Initializes the game
    startGame(){
        // Clicking the characters cards
        $(".container-fluid").on("click", ".char-choice", function(){
            var choosen = $(this).data();
            // Player choosing their character
            if(lockChar !== true){
                rpg.playMusic();
                // Prevents the player from choosing another character
                lockChar = true;
                $("#player").data($(this).data());
                $("#enemy-choice-title").css("visibility", "visible");
                $("#player").css({"visibility": "visible", "opacity": 0.0}).animate({"opacity": 1.0}, 500);
                $("#player-name").text(choosen.name);
                $("#player-img").attr("src", choosen.img);
                $("#player-hp").text(choosen.hp);
                $(".enemy-name, .enemy-footer").css({"background-color": "#000000", "color": "#ffffff"});
                $(this).remove();
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
                $(this).remove();
            }
        });
    },
    // In game logic
    inGame(){
        // Nothing happens when missing a player character and a defender
        if(lockChar == false || lockEnemy == false){
            return;
        }
        // First time the player attacks
        else if(firstAttack == true){
            newDefenderHp = $("#defender").data().hp - $("#player").data().attack;
            newPlayerHp = $("#player").data().hp - $("#defender").data().counter;
            newPlayerAttack = $("#player").data().attack + $("#player").data().attack;
            showAttack();
            showCounter();
            $("#player-attack").text($("#player").data().attack);
            $("#defender-counter").text($("#defender").data().counter);
            $("#player-hp").text(newPlayerHp);
            $("#defender-hp").text(newDefenderHp);
            firstAttack = false;
        }
        // Switching to a new enemy
        else if(newEnemy == true){
            showAttack();
            showCounter();
            hideResult();
            newDefenderHp = $("#defender").data().hp - newPlayerAttack;
            newPlayerHp = newPlayerHp - $("#defender").data().counter;
            $("#player-attack").text(newPlayerAttack);
            $("#defender-counter").text($("#defender").data().counter);
            $("#player-hp").text(newPlayerHp);
            $("#defender-hp").text(newDefenderHp);
            newPlayerAttack = newPlayerAttack + $("#player").data().attack;
            newEnemy = false;
        }
        // All subsequent attacks
        else{
            newDefenderHp = newDefenderHp - newPlayerAttack;
            $("#defender-hp").text(newDefenderHp);
            $("#player-attack").text(newPlayerAttack);
            if(newDefenderHp > 0){
                newPlayerHp = newPlayerHp - $("#defender").data().counter;
                $("#defender-counter").text($("#defender").data().counter);
                $("#player-hp").text(newPlayerHp);
            }
            newPlayerAttack = newPlayerAttack + $("#player").data().attack;
        }
    },
    // Defeating a single enemy
    winRound(){
        if(lockEnemy == true && newDefenderHp <= 0){
            // Prevents player form hitting attack button when enemy is already defeated
            $(".btn").css("pointer-events", "none");
            hideCounter();
            showResult();
            // Allows player to choose a new enemy
            newEnemy = true;
            $("#defender").animate({"opacity": 0.0}, 1000);
            setTimeout(function(){
                hideAttack();
                hideCounter();
                hideResult();
            }, 1000)
            setTimeout(function(){
                lockEnemy = false;
                rpg.winGame();
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
        }
        
    },
    playMusic(){
        audio.src = musicsrc[musicIndex]
        audio.play();
        musicPlaying = true; 
        // senses when song has ended and then autoplays next song
        audio.addEventListener("ended", function(){
            rpg.nextSong();
        })
    },
    nextSong(){
        musicIndex++;
        // prevents musicIndex from getting a value outside of musicsrc array
        if(musicIndex == musicsrc.length){
            musicIndex = 0;
            rpg.playMusic();
        }
        else{
        rpg.playMusic();
        }
    },
    previousSong(){
        musicIndex--;
        // prevents musicIndex from getting a value outside of musicsrc array
        if(musicIndex < 0){
            musicIndex = (musicsrc.length - 1);
            rpg.playMusic();
        }
        else{
            rpg.playMusic();
        }
    },
    musicControl(){
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
            rpg.nextSong();
        })
        $("#previous-song").on("click", function(){
            rpg.previousSong();
        })
        }
}
$(document).ready(function(){
    rpg.startGame();
    rpg.musicControl();
    // Clicking the attack button
    $("#attack-button").on("click", function(){
        rpg.inGame();
        rpg.winRound();
        rpg.loseGame();
        rpg.winGame();
    });
});