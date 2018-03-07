

//Simple matrix math function.  I use cartesian coordinates for the spaces instead of e5, e3, etc. so that move legality can be determined easily.
var matrixSub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){

        move.push(Math.abs(first[i]-last[i]));

    }
    return move;
}

//Pawns, since they can only move forward, need to have a matrix function that doesn't rely on absolute values for moving.
var pawnMatrixSub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){
        move.push(first[i]-last[i]);
    }
    return move;
}

//When the board has loaded, we can begin.
document.addEventListener("DOMContentLoaded", function(event){
    //First, I establish the piece names.

    var Bblack1, Bblack2,  Kblack, Knblack1, Knblack2, Pblack1, Pblack2, Pblack3, Pblack4, Pblack5, Pblack6, Pblack7, Pblack8, Qblack, Rblack1, Rblack2;    
    var Bwhite1, Bwhite2, Kwhite, Knwhite1, Knwhite2, Pwhite1, Pwhite2, Pwhite3, Pwhite4, Pwhite5, Pwhite6, Pwhite7, Pwhite8, Qwhite, Rwhite1, Rwhite2;

    var turn, bcapturedPieces, wcapturedPieces;
    
    //Styling the board.  Choosing white and light blue for the time being.
    var c1 = 'white';
    var c2 = 'lightblue';
    var tmp = '';
    var board = document.getElementsByClassName("board");
    //For each of the children on the board, iterate through white and the other color.  When the end of the board is reached, switch.  
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

    //make the clearing function mostly only apply to the middle parts!  It's making the regular bits not clickable!

    function clear(){
        for(var i = 0; i < board[0].children.length; i++){
            let id = board[0].children[i].id;
            despawn(id);
        }
        localStorage.clear();
    }

    //Placing the pieces on the board.  Place them by name, spot coordinates, and image name.
    function placement(fullname, piecename, spot){
        this.name = piecename;
        this.spot = spot;
        this.src = './assets/' + this.name + '.png';
        document.getElementById(this.spot).innerHTML = '<img src="'+src+'"/>';
        document.getElementById(this.spot).setAttribute('class', fullname);
    }

    //Removing pieces from where they were before they moved.
    function despawn(spot){
        this.spot = spot;
        document.getElementById(this.spot).innerHTML = '';
        document.getElementById(this.spot).setAttribute('class','none');
    }

    //Capturing enemy pieces.  Setting up a JSON array to contain the captured pieces so that if a pawn wants to become a different piece it can.
    function capture(spot, fullname, imagetext){
        this.spot = spot;
        this.name = fullname;
        console.log(imagetext);
        if(imagetext.includes('king')){
            alert("Game over!");
            clear();
        }
        //figure out if the names are being pushed to the capture list
        if(this.name.includes('black')){
            wcapturedPieces.push(this.name);
            console.log(wcapturedPieces);
            localStorage.setItem('wcaptured', JSON.stringify(wcapturedPieces));
        }else{
            bcapturedPieces.push(this.name);
            console.log(bcapturedPieces);
            localStorage.setItem('bcaptured', JSON.stringify(bcapturedPieces));
        }
        document.getElementById(this.spot).setAttribute('class','none');
        document.getElementById(this.spot).innerHTML = '';
    }

    //TO DO: OPTIMIZE OPTIMIZE OPTIMIZE!!!!!!
        
    function Bishop(spot, color, name){
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black'){
            this.piecename = 'bbish';
        }else{
            this.piecename = "wbish";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    Bishop.prototype.move = function(coords, newspot, color, captured, fullname, imagetext){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixSub(coords, newspot);
        if(move[0] == move[1] && captured == 'false'){
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else if(move[0] == move[1] && captured == 'true'){
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else{
            alert('Cannot move there!');   
        };
    }

    Bishop.prototype.guide = function(coords){

    }

    function King(spot, color, name){
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black'){
            this.piecename = 'bking';
        }else{
            this.piecename = "wking";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    King.prototype.move = function(coords, newspot, color, captured, fullname, imagetext){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixSub(coords, newspot);
        if((move[0] == 0 && move[1] == 1) || (move[0] == 1 && move[1] == 0) && captured == 'false'){
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else if((move[0] == 0 && move[1] == 1) || (move[0] == 1 && move[1] == 0) && captured == 'true'){
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            turn += 1;
            despawn(coords);
        }else{
            alert("Cannot move there!");
        };
    }

    King.prototype.guide = function(coords){
        
    }

    function Knight(spot, color, name){
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black'){
            this.piecename = 'bkngt';
        }else{
            this.piecename = "wkngt";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    Knight.prototype.move = function(coords, newspot, color, captured, fullname, imagetext){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixSub(coords, newspot);
        if((move[0] == 1 && move[1] == 2) || (move[0] == 2 && move[1] == 1) && captured == 'false'){
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else if((move[0] == 1 && move[1] == 2) || (move[0] == 2 && move[1] == 1) && captured == 'true'){
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords); 
            turn += 1;
        }else{
            alert("Cannot move there!");
        }
    }

    Knight.prototype.guide = function(coords){

    }

    function Pawn(spot, color, name){
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black'){
            this.piecename = 'bpaun';
        }else{
            this.piecename = "wpaun";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }


    Pawn.prototype.move = function(coords, newspot, color, captured, fullname, imagetext){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var amove = matrixSub(coords, newspot);
        var move = pawnMatrixSub(coords, newspot);

        if(this.piecename.includes('b')){
            if((move[0] == -1 && move[1] == 0) && captured == "false"){
                console.log('buzz');
                placement(this.fullname, this.piecename, newspot, this.color);
                despawn(coords);
                turn += 1;
            }else if((move[0] == -1 && move[1] == 0) && captured == 'true'){
                alert("Can't capture that!")
            }else if((move[0] == -2 && move[1] == 0) && coords[0] == 2){
                placement(this.fullname, this.piecename, newspot, this.color);
                despawn(coords);
                turn += 1;
            }else if((move[0] == -1 && amove[1] == 1) && captured == "true"){
                capture(newspot, fullname, imagetext);
                placement(this.fullname, this.piecename, newspot, this.color);
                despawn(coords);
                turn += 1;
            }else{
                console.log(move[0] + ' ' + move[1] + ' ' + captured);
                alert('Cannot move there!')
            }
        }else if(this.piecename.includes('w')){
            if(move[0] == 1 && move[1] == 0){
                placement(this.fullname, this.piecename, newspot, this.color);
                despawn(coords);
                turn += 1;
            }else if((move[0] == 1 && move[1] == 0) && captured == 'true'){
                alert("Can't capture that!")
            }else if((move[0] == 2 && move[1] == 0) && coords[0] == 7){
                placement(this.fullname, this.piecename, newspot, this.color);
                despawn(coords);
                turn += 1;
            }else if((move[0] == 1 && amove[1] == 1) && captured == "true"){
                capture(newspot, fullname, imagetext);
                placement(this.fullname, this.piecename, newspot, this.color);
                despawn(coords);
                turn += 1;
            }else{
                alert('Cannot move there!')
            }
        }
    }

    Pawn.prototype.guide = function(coords){

    }

    function Queen(spot, color, name){
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        
        if(this.color == 'black'){
            this.piecename = 'bquen';
        }else{
            this.piecename = "wquen";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }
    
    Queen.prototype.move = function(coords, newspot, color, captured, fullname, imagetext){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixSub(coords, newspot);
        if((move[0] == move[1] || move[0] == 0 || move[1] == 0) && captured == 'false'){
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else if((move[0] == move[1] || move[0] == 0 || move[1] == 0) && captured == 'true'){
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else{
            alert("Cannot move there!");
        }
    }

    Queen.prototype.guide = function(coords){

    }

    function Rook(spot, color, name){
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black'){
            this.piecename = 'brook';
        }else{
            this.piecename = "wrook";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    Rook.prototype.move = function(coords, newspot, color, captured, fullname, imagetext){
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matrixSub(coords, newspot);
        if((move[0] == 0 || move[1] == 0) && captured == 'false'){
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else if((move[0] == 0 || move[1] == 0) && captured == 'true'){
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        }else{
            console.log(move);
            alert('Cannot move there!');
        }
    }

    Rook.prototype.guide = function(coords){
        
    }

    //Reorganize these into objects of objects
    function start(){
        localStorage.clear();
        clear();
        //A fresh start. Replacing all the pieces and clearing localstorage.
        Bblack1 = new Bishop('13', 'black', 'Bblack1');
        Bblack2 = new Bishop('16', 'black', 'Bblack2');
        Kblack = new King('14', 'black', 'Kblack');
        Knblack1 = new Knight('12', 'black', 'Knblack1');
        Knblack2 = new Knight('17', 'black', 'Knblack2');
        Pblack1 = new Pawn('21','black', 'Pblack1');
        Pblack2 = new Pawn('22','black', 'Pblack2');
        Pblack3 = new Pawn('23','black', 'Pblack3');
        Pblack4 = new Pawn('24','black', 'Pblack4');
        Pblack5 = new Pawn('25','black', 'Pblack5');
        Pblack6 = new Pawn('26','black', 'Pblack6');
        Pblack7 = new Pawn('27','black', 'Pblack7');
        Pblack8 = new Pawn('28','black', 'Pblack8');
        Qblack = new Queen('15','black', 'Qblack');
        Rblack1 = new Rook('11','black', 'Rblack1');
        Rblack2 = new Rook('18','black', 'Rblack1');
        
        Bwhite1 = new Bishop('83', 'white', 'Bwhite1');
        Bwhite2 = new Bishop('86', 'white', 'Bwhite2');
        Kwhite = new King('84', 'white', 'Kwhite');
        Knwhite1 = new Knight('82', 'white', 'Knwhite1');
        Knwhite2 = new Knight('87', 'white', 'Knwhite2');
        Pwhite1 = new Pawn('71','white', 'Pwhite1');
        Pwhite2 = new Pawn('72','white', 'Pwhite2');
        Pwhite3 = new Pawn('73','white', 'Pwhite3');
        Pwhite4 = new Pawn('74','white', 'Pwhite4');
        Pwhite5 = new Pawn('75','white', 'Pwhite5');
        Pwhite6 = new Pawn('76','white', 'Pwhite6');
        Pwhite7 = new Pawn('77','white', 'Pwhite7');
        Pwhite8 = new Pawn('78','white', 'Pwhite8');
        Qwhite = new Queen('85','white', 'Qwhite');
        Rwhite1 = new Rook('81','white', 'Rwhite1');
        Rwhite2 = new Rook('88','white', 'Rwhite2');
        
        //A dictionary of sorts.  It's bad practice to convert strings to variable names on the fly, so this is something else I can do.
        //Now, every stringified variable name will actually point to the variable name.  Handy!
        toPiece = {
            'Bblack1': Bblack1,
            'Bblack2': Bblack2,
            'Kblack': Kblack,
            'Knblack1': Knblack1,
            'Knblack2': Knblack2,
            'Pblack1': Pblack1,
            'Pblack2': Pblack2,
            'Pblack3': Pblack3,
            'Pblack4': Pblack4,
            'Pblack5': Pblack5,
            'Pblack6': Pblack6,
            'Pblack7': Pblack7,
            'Pblack8': Pblack8,
            'Qblack': Qblack,
            'Rblack1': Rblack1,
            'Rblack2': Rblack2,
            'Bwhite1': Bwhite1,
            'Bwhite2': Bwhite2,
            'Kwhite': Kwhite,
            'Knwhite1': Knwhite1,
            'Knwhite2': Knwhite2,
            'Pwhite1': Pwhite1,
            'Pwhite2': Pwhite2,
            'Pwhite3': Pwhite3,
            'Pwhite4': Pwhite4,
            'Pwhite5': Pwhite5,
            'Pwhite6': Pwhite6,
            'Pwhite7': Pwhite7,
            'Pwhite8': Pwhite8,
            'Qwhite': Qwhite,
            'Rwhite1': Rwhite1,
            'Rwhite2': Rwhite2,
        }
        wcapturedPieces = [];
        bcapturedPieces = [];
        turn = 0;
        
        //Establishing the clickedpiece variable.  This will contain a value to be used by this function that will determine what happens on mouseclicks.
        localStorage.setItem("clickedpiece","none");
    }

    start();  

    document.getElementById('reset').addEventListener('click', function(){
        clear();
        start();
    })

    //TO MOVE, HERE IS WHAT NEEDS TO HAPPEN
    //SECOND: When this piece has been clicked or hovered over, I need to show users
    //where they can possibly go-for all child divs, check if move is legit-
    //if legit, show yellow, if not, show red, if capturing can happen hit orange
    //Fifth: If occupied by friendly, I must switch the piece.  If occupied
    //by foe, I must remove that piece and place it in the bin.
    //Sixth: I must update the css to display changes.

    //Another problem is that pieces can jump over each other willy nilly.  Can't have it.  Need to make it so that if pieces are
    //in between (set up some sort of matrix math function?) and users try to click on or past a friendly it doesnt happen

    //NEW TO DO:  MAKE IT SO THAT YOU CAN ONLY CAPTURE PIECES ON VALID MOVES
    //Add the capture function to the move functions

    
    console.log(board[0].children);
    board = document.getElementsByClassName("board");
    let spaces = document.querySelectorAll("[space = 'true']");
    console.log(spaces);

    
    //example movement: Pwhite7.move('77','67');

    //Flip a coin to decide who goes first
    //Set one of the two colors to have their turn on evens or odds
    //iterate turn count every time a piece is moved

    //Need to despawn stuff



    
    for (let space of spaces){
        //Adding Event listeners to every board space.
        space.addEventListener('click', function(){
            //If no piece has been selected and the space is empty, nothing happens.
            if(localStorage.getItem("clickedpiece") == "none" && this.className == "none"){
                console.log("pick another piece!")
            //If no piece has been selected and the space is not empty, this piece is now the clicked one.  This is where the turn functionality will go.
            }else if(localStorage.getItem("clickedpiece") == "none" && this.className != "none"){
                //Here I need to introduce the colored spaces thing.  Create a new function for it.
                if((turn % 2 == 0 && this.className.includes("b")) || (turn % 2 != 0 && this.className.includes("w"))){
                    localStorage.setItem("clickedpiece",this.className);
                    localStorage.setItem("oldcoords", this.id);
                }else{
                    alert("Not your turn!");
                }
            //If a piece has been selected and the space is empty (move legitimacy is checked elsewhere), the piece will be moved there and the turn count will be increased.
            }else if((localStorage.getItem("clickedpiece") != "none" && this.className == "none")){
                localStorage.setItem("captured", "false");
                toPiece[localStorage.getItem("clickedpiece")].move(localStorage.getItem("oldcoords"), this.id, localStorage.getItem("color"), localStorage.getItem("captured"), this.className, this.innerHTML.slice(19,24));
                localStorage.setItem("clickedpiece","none");
                localStorage.setItem("oldcoords", "none");
                localStorage.setItem("color","none")             
        
            //This is where capturing begins. If a piece has been selected and the space has a piece that is not the same piece, the capture will not happen.
            }else if((localStorage.getItem("clickedpiece") != "none" && this.className != "none") && localStorage.getItem("clickedpiece") != this.className){
                //If the new space has a piece that is a different color, then capturing will occur.  
                if(((localStorage.getItem("clickedpiece").includes('w') && this.className.includes('b'))) || ((localStorage.getItem("clickedpiece").includes('b') && this.className.includes('w')))){
                    
                    localStorage.setItem("captured","true");
                    //Moving the piece.  It also captures if the right conditions are met, such as "captured" being set to true.
                    toPiece[localStorage.getItem("clickedpiece")].move(localStorage.getItem("oldcoords"), this.id, localStorage.getItem("color"), localStorage.getItem("captured"), this.className, this.innerHTML.slice(19,24)); 
                    localStorage.setItem("captured","false");
                    localStorage.setItem("clickedpiece","none");
                    localStorage.setItem("oldcoords", "none");
                }else{
                    //If it's just a different piece of the same team, you switch to moving that piece.
                    localStorage.setItem("clickedpiece",this.className);
                    localStorage.setItem("oldcoords", this.id);
                    console.log('No friendly fire!');
                }
                
            }

        });
    }
    //not sure if this is useful.
    var resetspacecolor = function(oldstyle, coords){
        document.getElementById(coords).style.background = oldstyle;
    }

    //NEXT UP: ATTACKING, TURNS, SPECIAL RULES


    

    


})
