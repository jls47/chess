var matrixsub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){

        move.push(Math.abs(first[i]-last[i]));

    }
    return move;
}
$(document).ready(function(){



    //THIS SECTION IS FOR PIECES AND THEIR BEHAVIOR
        
    function Bishop(spot, color){
        console.log(spot);
        this.color = color;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        $('#'+spot).css('background',this.color);
        $('#'+spot).attr('piece','bishop');
    }

    Bishop.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] = move[1]){
            console.log("move seems legitB");
            $('#'+newspot).css('background',this.color);
        }
    }

    var B1B = new Bishop('13', 'blue');
    var B2B = new Bishop('16', 'black');



    B1B.move('34', '23');

    function King(spot, color){
        console.log(spot);
        this.color = color;
        $('#'+spot).css('background', this.color);
    }

    King.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if((move[0] == 0 && move[1] == 1) || (move[0] == 1 && move[1] == 0)){
            console.log("move seems legit King");
            $('#'+newspot).css('background',this.color);
        }
    }

    var KB = new King('14', 'black');

    KB.move('34', '33');

    function Knight(spot, color){
        console.log(spot);
        this.color = color;
        $('#'+spot).css('background',this.color);
    }

    Knight.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if((move[0] == 1 && move[1] == 2) || (move[0] == 2 && move[1] == 1)){
            console.log('move seems legit knight')
            $('#'+newspot).css('background',this.color);
        }
    }

    var KnB1 = new Knight('12', 'red');
    var KnB2 = new Knight('17', 'red');

    KnB1.move('12','31')

    function Pawn(spot, color){
        console.log(spot);
        this.color = color;
        $('#'+spot).css('background',this.color);
    }

    Pawn.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] == 0 && move[1] == 1){
            console.log('move seems legit pawn');
            $('#'.newspot).css('background',this.color);
        }else if(((move[0] == 0 && move[1] == 2) && coords[0] == 2) || ((move[0] == 0 && move[1] == 2) && coords[2] == 7)){
            $('#'.newspot).css('background',this.color);
            console.log('move seems legit pawn');
        }
    }

    var PB1 = new Pawn('21','darkgrey');
    var PB2 = new Pawn('22','darkgrey');
    var PB3 = new Pawn('23','darkgrey');
    var PB4 = new Pawn('24','darkgrey');
    var PB5 = new Pawn('25','darkgrey');
    var PB6 = new Pawn('26','darkgrey');
    var PB7 = new Pawn('27','darkgrey');
    var PB8 = new Pawn('28','darkgrey');

    PB1.move('21', '23');

    function Queen(spot, color){
        console.log(spot);
        this.color = color;
        $('#'+spot).css('background',this.color);
    }
    
    Queen.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] == move[1] || move[0] == 0 || move[1] == 0){
            console.log('move seems legit queen');
            $('#'.newspot).css('background',this.color);
        }
    }
    var QB = new Queen('15','green');

    QB.move('34','38');

    function Rook(spot, color){
        console.log(spot);
        this.color = color;
        $('#'+spot).css('background',this.color);
    }

    Rook.prototype.move = function(coords, newspot){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixsub(coords, newspot);
        if(move[0] == 0 || move[1] == 0){
            console.log('move seems legit rook');
            $('#'.newspot).css('background',this.color);
        };
    }

    var RB1 = new Rook('11','lightblue');
    var RB2 = new Rook('18','lightblue');

    RB1.move('34', '74');


})