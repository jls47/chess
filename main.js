var matrixsub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){

        move.push(Math.abs(first[i]-last[i]));

    }
    return move;
}
document.addEventListener("DOMContentLoaded", function(event){
    //THIS SECTION IS FOR PIECES AND THEIR BEHAVIOR

    var B1black, B2black,  Kblack, Knblack1, Knblack2, Pblack1, Pblack2, Pblack3, Pblack4, Pblack5, Pblack6, Pblack7, Pblack8, Qblack, Rblack1, Rblack2;    
    var B1white, B2white, Kwhite, Knwhite1, Knwhite2, Pwhite1, Pwhite2, Pwhite3, Pwhite4, Pwhite5, Pwhite6, Pwhite7, Pwhite8, Qwhite, Rwhite1, Rwhite2;
    
    var i = 0;
    var c1 = 'white';
    var c2 = 'lightblue';
    var tmp = '';
    var board = document.getElementsByClassName("board");
    for(var i = 0; i < board[0].children.length; i++){
        var id = board[0].children[i].id;
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
        document.getElementById(this.spot).innerHTML = '<img src="'+src+'"/>';
    }

    function despawn(spot){
        this.spot = spot;
        document.getElementById(this.spot).innerHTML = '';
    }

    //TO DO: OPTIMIZE OPTIMIZE OPTIMIZE!!!!!!
        
    function Bishop(spot, color){
        this.color = color;
        this.spot = spot;
        
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
            placement(this.piecename, newspot);
            despawn(coords);
        }
    }

    function King(spot, color){
        this.color = color;
        this.spot = spot;
        
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
            placement(this.piecename, newspot);
            despawn(coords);
        }
    }




    function Knight(spot, color){
        this.color = color;
        this.spot = spot;
        
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
            placement(this.piecename, newspot);
            despawn(coords);
        }
    }



    function Pawn(spot, color){
        this.color = color;
        this.spot = spot;
        
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
            placement(this.piecename, newspot);
            despawn(coords);
        }else if(((move[0] == 0 && move[1] == 2) && coords[0] == 2) || ((move[0] == 0 && move[1] == 2) && coords[2] == 7)){
            placement(this.piecename, newspot);
            despawn(coords);
        }
    }




    function Queen(spot, color){
        this.color = color;
        this.spot = spot;
        
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
            placement(this.piecename, newspot);
            despawn(coords);
        }
    }

    function Rook(spot, color){
        this.color = color;
        this.spot = spot;
        
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
            placement(this.piecename, newspot);
            despawn(coords);
        };
    }

    function start(){
        B1B = new Bishop('13', 'black');
        B2B = new Bishop('16', 'black');
        KB = new King('14', 'black');
        KnB1 = new Knight('12', 'black');
        KnB2 = new Knight('17', 'black');
        PB1 = new Pawn('21','black');
        PB2 = new Pawn('22','black');
        PB3 = new Pawn('23','black');
        PB4 = new Pawn('24','black');
        PB5 = new Pawn('25','black');
        PB6 = new Pawn('26','black');
        PB7 = new Pawn('27','black');
        PB8 = new Pawn('28','black');
        QB = new Queen('15','black');
        RB1 = new Rook('11','black');
        RB2 = new Rook('18','black');
        
        B1W = new Bishop('83', 'white');
        B2W = new Bishop('86', 'white');
        KW = new King('84', 'white');
        KnW1 = new Knight('82', 'white');
        KnW2 = new Knight('87', 'white');
        PW1 = new Pawn('71','white');
        PW2 = new Pawn('72','white');
        PW3 = new Pawn('73','white');
        PW4 = new Pawn('74','white');
        PW5 = new Pawn('75','white');
        PW6 = new Pawn('76','white');
        PW7 = new Pawn('77','white');
        PW8 = new Pawn('78','white');
        QW = new Queen('85','white');
        RW1 = new Rook('81','white');
        RW2 = new Rook('88','white');
    }

    start();  

  
    

    //TO MOVE, HERE IS WHAT NEEDS TO HAPPEN
    //FIRST: I must recognize when a piece has been clicked and trigger
    //a state of clicked-ness-add variable name to localstorage
    //SECOND: When this piece has been clicked, I need to show users
    //where they can possibly go-for all child divs, check if move is legit-
    //if legit, show yellow, if not, show red, if piece taking chance orange
    //THIRD: I need to be ready for the next click-if legit move for next piece, trigger move
    //FOURTH: Upon the next click, I need to see if its either open space
    //or occupied
    //Fifth: If occupied by friendly, I must switch the piece.  If occupied
    //by foe, I must remove that piece and place it in the bin.
    //Sixth: I must update the css to display changes.

    

    

    


})