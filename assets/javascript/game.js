var luffy = { "hp": 120, "attack": 10, "counter": 8};
var buggy = { "hp": 100, "attack": 5, "counter": 3};
var kuma = { "hp": 160, "attack": 12, "counter": 20};
var doflamingo = { "hp": 200, "attack": 20, "counter": 18};

var lockChar = false;
var lockEnemy = false;

$(document).ready(function(){

    $(".container-fluid").on("click", ".char-choice", function(){
        var choosen = $(this).contents();
        if(lockChar !== true){
            $("#player").replaceWith(choosen);
            $(this).remove();
            lockChar = true;
        }
        else if(lockEnemy !== true){
            $("#defender").replaceWith(choosen);
            $(this).remove();
            lockEnemy = true; 
        }
    });

});