// Data sets for the different characters
$("#luffy").data({ "name": "Monkey D. Luffy", "hp": 120, "attack": 10, "counter": 8, "img": "assets/images/luffy.jpg"})
$("#buggy").data({ "name": "Buggy The Clown", "hp": 100, "attack": 5, "counter": 3, "img": "assets/images/buggy.png"})
$("#kuma").data({ "name": "Bartholomew Kuma", "hp": 160, "attack": 12, "counter": 20, "img": "assets/images/kuma.jpg"})
$("#doflamingo").data({ "name": "Donquixote Doflamingo", "hp": 200, "attack": 20, "counter": 18, "img": "assets/images/doflamingo.jpg"})
// Variable declarations
var lockChar = false;
var lockEnemy = false;
var firstAttack = true;
var newEnemy = false;
var newPlayerHp = 0;
var newDefenderHp = 0;
var newPlayerAttack = 0;

function showAttack(){
    $(".hidden3").css("visibility", "visible");
}
function hideAttack(){
    $(".hidden3").css("visibility", "hidden");
} 
function showCounter(){
    $(".hidden4").css("visibility", "visible");
}
function hideCounter(){
    $(".hidden4").css("visibility", "hidden");
}
function showResult(){
    $(".hidden5").css("visibility", "visible");
} 
function hideResult(){
    $(".hidden5").css("visibility", "hidden");
}
// The Game
var rpg = {
    startGame(){
        hideAttack();
        hideCounter();
        hideResult();
        // Clicking the characters cards
        $(".container-fluid").on("click", ".char-choice", function(){
            var choosen = $(this).data();
            // Player choosing their character
            if(lockChar !== true){
                $("#player").data($(this).data());
                $(".hidden1").css("visibility", "visible");
                $("#player-name").text(choosen.name);
                $("#player-img").attr("src", choosen.img);
                $("#player-hp").text(choosen.hp);
                $(this).remove();
                // Prevents the player from choosing another character
                lockChar = true;
            }
            // Player choosing their enemy
            else if(lockEnemy !== true){
                console.log("choosen enemy")
                // Prevents the player form choosing another defender
                lockEnemy = true; 
                console.log('locked in')
                $(".hidden2").css("visibility", "visible");
                $("#defender").data($(this).data());
                $(".defender-name").text(choosen.name);
                $("#defender-img").attr("src", choosen.img);
                $("#defender-hp").text(choosen.hp);
                $(this).remove();
            }
        });
    },
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
    winRound(){
        if(lockEnemy == true && newDefenderHp <= 0){
            $(".btn").css("pointer-events", "none");
            hideCounter();
            showResult();
            newEnemy = true;
            setTimeout(function(){
                $(".hidden2").css("visibility", "hidden");
                hideAttack();
                hideCounter();
                hideResult();
            }, 1500)
            setTimeout(function(){
                lockEnemy = false;
                rpg.winGame();
                $(".btn").css("pointer-events", "auto");
            }, 2000);
        }
    },
    loseGame(){
        if(newDefenderHp > 0 && newPlayerHp <= 0){
            $("#win-lose-text").text("YOU LOST!");
            $("#win-lose-modal").modal({show: true, keyboard: false, backdrop: "static"});
        }
    },
    winGame(){
        function isEmpty(el){
            console.log("function run")
            return !$.trim(el.html());
        }
        if(isEmpty($("#enemy-choices")) && lockEnemy == false) {
            console.log("you win");
            $("#win-lose-text").text("YOU WIN!");
            $("#win-lose-modal").modal({show: true, keyboard: false, backdrop: "static"});
        }
        
    }
}
$(document).ready(function(){
    rpg.startGame();
    // Clicking the attack button
    $(".btn").on("click", function(){
        rpg.inGame();
        rpg.winRound();
        rpg.loseGame();
        rpg.winGame();
    });
});