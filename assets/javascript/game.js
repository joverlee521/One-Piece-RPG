$("#luffy").data({ "name": "Monkey D. Luffy", "hp": 120, "attack": 10, "counter": 8, "img": "assets/images/luffy.jpg"})
$("#buggy").data({ "name": "Buggy The Clown", "hp": 100, "attack": 5, "counter": 3, "img": "assets/images/buggy.png"})
$("#kuma").data({ "name": "Bartholomew Kuma", "hp": 160, "attack": 12, "counter": 20, "img": "assets/images/kuma.jpg"})
$("#doflamingo").data({ "name": "Donquixote Doflaming", "hp": 200, "attack": 20, "counter": 18, "img": "assets/images/doflamingo.jpg"})

var lockChar = false;
var lockEnemy = false;

var newPlayerHp = 0;
var newDefenderHp = 0;
var newPlayerAttack = 0;


$(document).ready(function(){

    $(".container-fluid").on("click", ".char-choice", function(){
        var choosen = $(this).data();
        if(lockChar !== true){
            $("#player").data($(this).data());
            $(".hidden1").css("visibility", "visible");
            $("#player-name").text(choosen.name);
            $("#player-img").attr("src", choosen.img);
            $("#player-hp").text(choosen.hp);
            $(this).remove();
            lockChar = true;
        }
        else if(lockEnemy !== true){
            $("#defender").data($(this).data());
            $(".hidden2").css("visibility", "visible");
            $(".defender-name").text(choosen.name);
            $("#defender-img").attr("src", choosen.img);
            $("#defender-hp").text(choosen.hp);
            $(this).remove();
            lockEnemy = true; 
        }
    });

    $(".btn").on("click", function(){
        if(lockChar == false || lockEnemy == false){
            return;
        }
        else {
            $(".hidden3").css("visibility", "visible");
            $("#player-attack").text($("#player").data().attack);
            $("#defender-counter").text($("#defender").data().counter);
        }
    });
    

});