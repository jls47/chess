var matrixsub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){

        move.push(Math.abs(first[i]-last[i]));

    }
    return move;
}
document.addEventListener("DOMContentLoaded", function(event){
    //THIS SECTION IS FOR PIECES AND THEIR BEHAVIOR


    function start(){
        var B1B = new Bishop('13', 'black');
        var B2B = new Bishop('16', 'black');
        var KB = new King('14', 'black');
        var KnB1 = new Knight('12', 'black');
        var KnB2 = new Knight('17', 'black');
        var PB1 = new Pawn('21','black');
        var PB2 = new Pawn('22','black');
        var PB3 = new Pawn('23','black');
        var PB4 = new Pawn('24','black');
        var PB5 = new Pawn('25','black');
        var PB6 = new Pawn('26','black');
        var PB7 = new Pawn('27','black');
        var PB8 = new Pawn('28','black');
        var QB = new Queen('15','black');
        var RB1 = new Rook('11','black');
        var RB2 = new Rook('18','black');
        
        var W1W = new Bishop('83', 'white');
        var W2W = new Bishop('86', 'white');
        var KW = new King('84', 'white');
        var KnW1 = new Knight('82', 'white');
        var KnW2 = new Knight('87', 'white');
        var PW1 = new Pawn('71','white');
        var PW2 = new Pawn('72','white');
        var PW3 = new Pawn('73','white');
        var PW4 = new Pawn('74','white');
        var PW5 = new Pawn('75','white');
        var PW6 = new Pawn('76','white');
        var PW7 = new Pawn('77','white');
        var PW8 = new Pawn('78','white');
        var QW = new Queen('85','white');
        var RW1 = new Rook('81','white');
        var RW2 = new Rook('88','white');


    }

    //TO DO: MAKE SPACE COLORS ALTERNATE
    var i = 0;
    var c1 = 'white';
    var c2 = 'lightblue';
    var tmp = '';
    var board = document.getElementsByClassName("board");
    console.log(board);
    console.log(board[0].children);
    for(var i = 0; i < board[0].children.length; i++){
        var id = board[0].children[i].id;
        console.log(i);
        if(i % 2 == 0){
            document.getElementById(id).style.background = c2;
        }else{
            document.getElementById(id).style.background = c1;
        }
        if(i >= 1 && (i+1) % 8 == 0){
            tmp = c1;
            c1 = c2;
            c2 = tmp;
        }
    }

    function placement(piecename, spot){
        this.name = piecename;
        this.spot = spot;
        this.src = './assets/' + this.name + '.png';
        console.log(src);
        document.getElementById(this.spot).innerHTML = '<img src="'+src+'"/>';
    }
        
    function Bishop(spot, color){
        console.log(spot);
        this.color = color;
        this.spot = spot;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        if(this.color == 'black'){
            this.piecename = 'bbishop';
        }else{
            this.piecename = "wbishop";
        }
        document.getElementById(spot).className = this.piecename;
        placement(this.piecename, this.spot);
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



  

    function King(spot, color){
        console.log(spot);
        this.color = color;
        this.spot = spot;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        if(this.color == 'black'){
            this.piecename = 'bking';
        }else{
            this.piecename = "wking";
        }
        document.getElementById(spot).className = this.piecename;
        placement(this.piecename, this.spot);
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




    function Knight(spot, color){
        console.log(spot);
        this.color = color;
        this.spot = spot;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        if(this.color == 'black'){
            this.piecename = 'bknight';
        }else{
            this.piecename = "wknight";
        }
        document.getElementById(spot).className = this.piecename;
        placement(this.piecename, this.spot);
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



    function Pawn(spot, color){
        console.log(spot);
        this.color = color;
        this.spot = spot;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        if(this.color == 'black'){
            this.piecename = 'bpawn';
        }else{
            this.piecename = "wpawn";
        }
        document.getElementById(spot).className = this.piecename;
        placement(this.piecename, this.spot);
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




    function Queen(spot, color){
        console.log(spot);
        this.color = color;
        this.spot = spot;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        if(this.color == 'black'){
            this.piecename = 'bqueen';
        }else{
            this.piecename = "wqueen";
        }
        document.getElementById(spot).className = this.piecename;
        placement(this.piecename, this.spot);
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


    function Rook(spot, color){
        console.log(spot);
        this.color = color;
        this.spot = spot;
        //TO DO: Establish the ability to place a bishop somewhere on the board
        if(this.color == 'black'){
            this.piecename = 'brook';
        }else{
            this.piecename = "wrook";
        }
        document.getElementById(spot).className = this.piecename;
        placement(this.piecename, this.spot);
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

    

    start();

    

    //TO MOVE, HERE IS WHAT NEEDS TO HAPPEN
    //FIRST: I must recognize when a piece has been clicked and trigger
    //a state of clicked-ness
    //SECOND: When this piece has been clicked, I need to show users
    //where they can possibly go
    //THIRD: I need to be ready for the next click
    //FOURTH: Upon the next click, I need to see if its either open space
    //or occupied
    //Fifth: If occupied by friendly, I must switch the piece.  If occupied
    //by foe, I must remove that piece and place it in the bin.
    //Sixth: I must update the css to display changes.

    var possmoves = function(piece, origin){
        
    }

    var startmove = function(piece, origin){

    }

    var endmove = function(piece, dest){

    }

    

    $('.board').children().click(function(){
        if(grabbed == false)
            if(this.attr('piece') == 'none'){
                alert('clicked an empty space!');
            }else{

            }

    })


})