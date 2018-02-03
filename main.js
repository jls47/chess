var matrixsub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){

        move.push(Math.abs(first[i]-last[i]));

    }
    return move;
}
$(document).ready(function(){
        
    function Bishop(spot){
        console.log(spot);
        //TO DO: Establish the ability to place a bishop somewhere on the board
        $('#'+spot).css('background','black');
    }

    Bishop.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] = move[1]){
            console.log("move seems legitB");
            console.log(move);
        }
    }

    var B1B = new Bishop('13');
    var B2B = new Bishop('16');

    B1B.move('34', '23');

    function King(spot){
        console.log(spot);
        $('#'+spot).css('background','grey');
    }

    King.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if((move[0] == 0 && move[1] == 1) || (move[0] == 1 && move[1] == 0)){
            console.log("move seems legit King");
        }
    }

    var KB = new King('14');

    KB.move('34', '33');

    function Knight(spot){
        console.log(spot);
        $('#'+spot).css('background','darkblue');
    }

    Knight.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if((move[0] == 1 && move[1] == 4) || (move[0] == 4 && move[1] == 1)){
            console.log('move seems legit knight')
        }
    }

    var KnB1 = new Knight('12');
    var KnB2 = new Knight('17');

    function Pawn(spot){
        console.log(spot);
        $('#'+spot).css('background','blue');
    }

    Pawn.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] == 0 && move[1] == 1){
            
        }else if(((move[0] == 0 && move[1] == 2) && coords[0] == 2) || ((move[0] == 0 && move[1] == 2) && coords[2] == 7)){
            
        }
    }

    var PB1 = new Pawn('21');
    var PB2 = new Pawn('22');
    var PB3 = new Pawn('23');
    var PB4 = new Pawn('24');
    var PB5 = new Pawn('25');
    var PB6 = new Pawn('26');
    var PB7 = new Pawn('27');
    var PB8 = new Pawn('28');

    PB1.move('21', '23');

    function Queen(spot){
        console.log(spot);
        $('#'+spot).css('background','lightgrey');
    }
    
    Queen.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] == move[1] || move[0] == 0 || move[1] == 0){
            console.log('move seems legit queen');
        }
    }
    var QB = new Queen('15');

    QB.move('34','38');

    function Rook(spot){
        console.log(spot);
        $('#'+spot).css('background','lightblue');
    }

    Rook.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] == 0 || move[1] == 0){
            console.log('move seems legit rook');
        };
    }

    var RB1 = new Rook('11');
    var RB2 = new Rook('18');

    RB1.move('34', '74');


})