// Data sets for the different characters
$("#luffy").data({ "name": "Monkey D. Luffy", "hp": 120, "attack": 10, "counter": 8, "img": "assets/images/luffy.jpg"})
$("#buggy").data({ "name": "Buggy The Clown", "hp": 100, "attack": 5, "counter": 3, "img": "assets/images/buggy.png"})
$("#kuma").data({ "name": "Bartholomew Kuma", "hp": 160, "attack": 12, "counter": 20, "img": "assets/images/kuma.jpg"})
$("#doflamingo").data({ "name": "Donquixote Doflaming", "hp": 200, "attack": 20, "counter": 18, "img": "assets/images/doflamingo.jpg"})
// Variable declarations
var lockChar = false;
var lockEnemy = false;
var firstAttack = true;
var newPlayerHp = 0;
var newDefenderHp = 0;
var newPlayerAttack = 0;


$(document).ready(function(){
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
            $("#defender").data($(this).data());
            $(".hidden2").css("visibility", "visible");
            $(".defender-name").text(choosen.name);
            $("#defender-img").attr("src", choosen.img);
            $("#defender-hp").text(choosen.hp);
            $(this).remove();
            // Prevents the player form choosing another defender
            lockEnemy = true; 
        }
    });
    // Clicking the attack button
    $(".btn").on("click", function(){
        // Nothing happens when missing a player character and a defender
        if(lockChar == false || lockEnemy == false){
            return;
        }
        // First time the player attacks
        else if(firstAttack == true){
            newPlayerHp = $("#player").data().hp - $("#defender").data().counter;
            newDefenderHp = $("#defender").data().hp - $("#player").data().attack;
            newPlayerAttack = $("#player").data().attack + $("#player").data().attack;
            $(".hidden3").css("visibility", "visible");
            $("#player-attack").text($("#player").data().attack);
            $("#defender-counter").text($("#defender").data().counter);
            $("#player-hp").text(newPlayerHp);
            $("#defender-hp").text(newDefenderHp);
            firstAttack = false;
        }
        // All subsequent attacks
        else{
            newPlayerHp = newPlayerHp - $("#defender").data().counter;
            newDefenderHp = newDefenderHp - newPlayerAttack;
            $("#player-attack").text(newPlayerAttack);
            $("#defender-counter").text($("#defender").data().counter);
            $("#player-hp").text(newPlayerHp);
            $("#defender-hp").text(newDefenderHp);
            newPlayerAttack = newPlayerAttack + $("#player").data().attack;
        }
    });
    

});