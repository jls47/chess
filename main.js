

$(document).ready(function($) {
    let clicked = false;
    
    $(".accordion-trigger").click(function(event) {
        event.preventDefault();
        if(clicked == false) {
            $(".accordion-body").slideToggle();
            clicked = true;
        } else {
            $(".accordion-body").slideToggle();
            clicked = false;
        }
    });
});




//Simple matrix math function.  I use cartesian coordinates for the spaces instead of e5, e3, etc. so that move legality can be determined easily.
//Pawns, since they can only move forward, need to have a matrix function that doesn't rely on absolute values for moving.
//This will also come in handy for the guidance function and determining whether pieces can move past a certain point.
var matMath = function(pawn,first, last) {
    var move = [];
    if(pawn) {
      for(var i = 0; i < 2; i++) {
         move.push(first[i]-last[i]);
      }
    } else {
      for(var i = 0; i < 2; i++) {
         move.push(Math.abs(first[i]-last[i]));
      }
    }
    return move;
};



/////////////////////////////////////////////////////////////////////
//Start restructuring.  You can have one universal movement function dependent upon different guide functions.
//Start writing the guide functions to incorporate matrix math.
//In the guide functions, add the possible spots.  Add conditions.  If there is a break in the possibles, depending on the color (directionality), 
//cut off the possibles after a certain point.  This is the real reason for the regular matrix math.
/////////////////////////////////////////////////////////////////////

//When the board has loaded, we can begin.
document.addEventListener("DOMContentLoaded", function(event) {
    //First, I establish the piece names.

    var Bblack1, Bblack2,  Kblack, Knblack1, Knblack2, Pblack1, Pblack2, Pblack3, Pblack4, Pblack5, Pblack6, Pblack7, Pblack8, Qblack, Rblack1, Rblack2;    
    var Bwhite1, Bwhite2, Kwhite, Knwhite1, Knwhite2, Pwhite1, Pwhite2, Pwhite3, Pwhite4, Pwhite5, Pwhite6, Pwhite7, Pwhite8, Qwhite, Rwhite1, Rwhite2;

    var turn, bcapturedPieces, wcapturedPieces;

    let spaces = document.querySelectorAll("[space = 'true']");
    
    //Styling the board.  Choosing white and light blue for the time being.
    var c1 = 'blue';
    var c2 = 'lightblue';
    var tmp = '';
    var board = document.getElementsByClassName("spaces");
    //For each of the children on the board, iterate through white and the other color.  When the end of the board is reached, switch.
    function color() {
        for(var i = 0; i < board[0].children.length; i++) {
            var id = board[0].children[i].id;
            if(i % 2 === 0) {
                document.getElementById(id).style.background = c2;
            } else {
                document.getElementById(id).style.background = c1;
            }
            if(i >= 1 && (i+1) % 8 === 0) {
                tmp = c1;
                c1 = c2;
                c2 = tmp;
            }
        }
    }
    color();

    //make the clearing function mostly only apply to the middle parts!  It's making the regular bits not clickable!

    function clear() {
        for(var i = 0; i < board[0].children.length; i++) {
            let id = board[0].children[i].id;
            despawn(id);
        }
        localStorage.clear();
    }

    //Placing the pieces on the board.  Place them by name, spot coordinates, and image name.
    function placement(fullname, piecename, spot) {
        this.name = piecename;
        this.spot = spot;
        this.src = './assets/' + this.name + '.png';
        document.getElementById(this.spot).innerHTML = '<img src="'+src+'"/>';
        document.getElementById(this.spot).setAttribute('class', fullname);
        //resetPossibles();
    }

    function resetPossibles() {
        for(let space of spaces) {
            document.getElementById(space.id).setAttribute("possible","false");
        }
    }

    //Removing pieces from where they were before they moved.
    function despawn(spot) {
        this.spot = spot;
        document.getElementById(this.spot).innerHTML = '';
        document.getElementById(this.spot).setAttribute('class','none');
    }

    //Capturing enemy pieces.  Setting up a JSON array to contain the captured pieces so that if a pawn wants to become a different piece it can.
    function capture(spot, fullname, imagetext) {
        this.spot = spot;
        this.name = fullname;
        if(imagetext.includes('king')) {
            alert("Game over!");
            clear();
        }
        //figure out if the names are being pushed to the capture list
        if(this.name.includes('black')) {
            wcapturedPieces.push(this.name);
            console.log(wcapturedPieces);
            localStorage.setItem('wcaptured', JSON.stringify(wcapturedPieces));
        } else {
            bcapturedPieces.push(this.name);
            console.log(bcapturedPieces);
            localStorage.setItem('bcaptured', JSON.stringify(bcapturedPieces));
        }
        document.getElementById(this.spot).setAttribute('class','none');
        document.getElementById(this.spot).innerHTML = '';
    }

    function move(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matMath(false, coords, newspot);
        var amove = matMath(true, coords, newspot);
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(fullname, imagetext, newspot);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(fullname, imagetext, newspot);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
        }
    }

    //TO DO: MAKE PIECES UNABLE TO JUMP
        
    function Bishop(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black') {
            this.piecename = 'bbish';
        } else {
            this.piecename = "wbish";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    Bishop.prototype.move = function(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matMath(false, coords, newspot);
        var amove = matMath(true, coords, newspot);
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };

    //In each of these guide functions, I need to somehow put the possibles into an array or two and test for uniformity
    //or breakage in the line.  There will need to be multiple arrays-test where the values go with matrix math?
    //If there is a difference in the matrices of more than one, one matrix needs to go in one array and the
    //other in another.  If there is a break, the ones closest to the piece (test with matrices) needs 
    //to be the only legit ones.

    //The search for lines can radiate outward from the piece.  Start going up towards 88 and down towards 11.  Loop through the ids, stopping at 0 and subtracting 2.
    //The conditions will vary piece by piece.  Bishops, for example: up to four arrays possible.  If one value - other != [1,1] then they get into separate arrays.  
    //Relationships between arrayed values need to work like that.  Find a value in another array where the difference is [1,1] and that is the array it belongs to?
    //If the values do not equal either 8 or 1 and there's a break then something.  Shit.  write more.
    //Add the values that are on white spaces to their own array too?  See if they line up, then remove the one furthest from the piece with matrix math

    Bishop.prototype.guide = function(coords, name) {
        this.coords = coords.split("");
        let ulids = [];
        let urids = [];
        let dlids = [];
        let drids = [];
        console.log(coords);

        let c0 = parseInt(coords[0]);
        let c1 = parseInt(coords[1]);
        //up left guide
        if(coords[0] <= 8-c1) {    
            let x = 1;
            for(i = c0; i <= 8; i++) {
                let ulid = [i+1, c1 - x].join('');
                x += 1;
                console.log(ulid);
                if(ulid[1] < 1 || ulid[1] > 8 || ulid[0] < 1 || ulid[0] > 8) {
                    break;
                
                } else if(document.getElementById(ulid).className == "none") {
                    ulids.push(ulid);
                } else if((this.color == "black" && document.getElementById(ulid).className.includes('white')) || (this.color == "white" && document.getElementById(ulid).className.includes('black'))) {
                    ulids.push(ulid);
                    break;
                } else if(this.color == "white" && document.getElementById(ulid).className.includes('white') || this.color == "black" && document.getElementById(ulid).className.includes('black')) {
                    
                    break;
                }
            }
        } else {
            let x = 1;
            
            for(i = c1-1; i >= 1; i--) {
                let ulid = [c0+x, i].join('');
                x += 1;
                console.log(ulid);
                if(ulid[1] < 1 || ulid[1] > 8 || ulid[0] < 1 || ulid[0] > 8) {
                    break;
                
                } else if(document.getElementById(ulid).className == "none") {
                    ulids.push(ulid);
                } else if((this.color == "black" && document.getElementById(ulid).className.includes('white')) || (this.color == "white" && document.getElementById(ulid).className.includes('black'))) {
                    ulids.push(ulid);
                    break;
                } else if(this.color == "white" && document.getElementById(ulid).className.includes('white') || this.color == "black" && document.getElementById(ulid).className.includes('black')) {
                    
                    break;
                }
            }
        }

        
        //up right guide
        if(c0 >= c1) {
            console.log('upright by 0');
            let x = 1;
            for(i = parseInt(coords[0])+1; i <= 8; i++) {
                let urid = [i, c1+x].join('');
                x += 1;
                if(urid[1] < 1 || urid[1] > 8 || urid[0] < 1 || urid[0] > 8) {
                    break;
                
                } else if(document.getElementById(urid).className == "none") {
                    urids.push(urid);
                } else if((this.color == "black" && document.getElementById(urid).className.includes('white')) || (this.color == "white" && document.getElementById(urid).className.includes('black'))) {
                    urids.push(urid);
                    break;
                } else if(this.color == "white" && document.getElementById(urid).className.includes('white') || this.color == "black" && document.getElementById(urid).className.includes('black')) {
                 
                    break;
                } 
            }
        } else {
            let x = 1;
            for(i = parseInt(coords[1])+1; i <= 8; i++) {
                let urid = [c0+x, i].join('');
                x += 1;
                if(urid[1] < 1 || urid[1] > 8 || urid[0] < 1 || urid[0] > 8) {
                    break;
                
                } else if(document.getElementById(urid).className == "none") {
                    urids.push(urid);
                } else if((this.color == "black" && document.getElementById(urid).className.includes('white')) || (this.color == "white" && document.getElementById(urid).className.includes('black'))) {
                    urids.push(urid);
                    break;
                } else if(this.color == "white" && document.getElementById(urid).className.includes('white') || this.color == "black" && document.getElementById(urid).className.includes('black')) {
               
                    break;
                } 
            }
        }


        //down left guide
        if(coords[1] >= coords[0]) {
            let x = 1;
            for(i = c0-1; i >= 1; i--) {
                let dlid = [i, c1-x].join('');
                x += 1;
                if(dlid[1] < 1 || dlid[1] > 8 || dlid[0] < 1 || dlid[0] > 8) {
                    break;
                
                } else if(document.getElementById(dlid).className == "none") {
                    dlids.push(dlid);
                } else if((this.color == "black" && document.getElementById(dlid).className.includes('white')) || (this.color == "white" && document.getElementById(dlid).className.includes('black'))) {
                    dlids.push(dlid);
                    break;
                } else if(this.color == "white" && document.getElementById(dlid).className.includes('white') || this.color == "black" && document.getElementById(dlid).className.includes('black')) {
               
                    break;
                }
            }
        } else {
            let x = 1;
            for(i = c0-1; i >= 1; i--) {
                let dlid = [i, c1-x].join('');
                x += 1;
                if(dlid[1] < 1 || dlid[1] > 8 || dlid[0] < 1 || dlid[0] > 8) {
                    break;
                
                } else if(document.getElementById(dlid).className == "none") {
                    dlids.push(dlid);
                } else if((this.color == "black" && document.getElementById(dlid).className.includes('white')) || (this.color == "white" && document.getElementById(dlid).className.includes('black'))) {
                    dlids.push(dlid);
                    break;
                } else if(this.color == "white" && document.getElementById(dlid).className.includes('white') || this.color == "black" && document.getElementById(dlid).className.includes('black')) {

                    break;
                }
            }
        }

        //down right guide
        if(coords[0] >= coords[1]) {
            let x = 1;
            for(i = c1+1; i <= 8; i++) {
                let drid = [c0 - x, i].join('');
                x += 1;
                if(drid[1] < 1 || drid[1] > 8 || drid[0] < 1 || drid[0] > 8) {
                    break;
                
                } else if(document.getElementById(drid).className == "none") {
                    drids.push(drid);
                } else if((this.color == "black" && document.getElementById(drid).className.includes('white')) || (this.color == "white" && document.getElementById(drid).className.includes('black'))) {
                    drids.push(drid);
                    break;
                } else if(this.color == "white" && document.getElementById(drid).className.includes('white') || this.color == "black" && document.getElementById(drid).className.includes('black')) {

                    break;
                }
            }
        } else {
            let x = 1;
            for(i = c0-1; i >= 1; i--) {
                let drid = [i, c1 + x].join('');
                x += 1;
                if(drid[1] < 1 || drid[1] > 8 || drid[0] < 1 || drid[0] > 8) {
                    break;
                
                } else if(document.getElementById(drid).className == "none") {
                    drids.push(drid);
                } else if((this.color == "black" && document.getElementById(drid).className.includes('white')) || (this.color == "white" && document.getElementById(drid).className.includes('black'))) {
                    drids.push(drid);
                    break;
                } else if(this.color == "black" && document.getElementById(drid).className.includes('black')) {

                    break;
                }
            }
        }
        
        let poss = urids.concat(ulids, drids, dlids);
        
        for(let id of poss) {
            document.getElementById(id).setAttribute("possible","true");
            document.getElementById(id).style.background = "orange";
        }
    };

    function King(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black') {
            this.piecename = 'bking';
        } else {
            this.piecename = "wking";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    King.prototype.move = function(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matMath(false, coords, newspot);
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!'); 
            resetPossibles();  
        }
    };

    King.prototype.guide = function(coords, name) {
        this.coords = coords.split("");
        for(let space of spaces) {
            let newspot = space.id.split("");
            let move = matMath(false, coords, newspot);
            if((move[0] === 0 && move[1] == 1) || (move[0] == 1 && move[1] === 0)) {
                if(space.className == "none" || ((space.className.includes("b") && name.includes("w")) || (space.className.includes("w") && name.includes("b")))) {
                    document.getElementById(space.id).setAttribute("possible","true");
                    document.getElementById(space.id).style.background = "orange";
                }
            }
        }
    };

    function Knight(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black') {
            this.piecename = 'bkngt';
        } else {
            this.piecename = "wkngt";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    Knight.prototype.move = function(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matMath(false, coords, newspot);
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };

    //not working.  need to fix
    Knight.prototype.guide = function(coords, name) {
        this.coords = coords.split("");
        for(let space of spaces) {
            let newspot = space.id.split("");
            let move = matMath(false, coords, newspot);
            if((move[0] == 1 && move[1] == 2) || (move[0] == 2 && move[1] == 1)) {
                if(space.className == "none" || ((space.className.includes("b") && name.includes("w")) || (space.className.includes("w") && name.includes("b")))) {
                    document.getElementById(space.id).setAttribute("possible","true");
                    document.getElementById(space.id).style.background = "orange";
                }
            }
        }
    };

    function Pawn(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black') {
            this.piecename = 'bpaun';
        } else {
            this.piecename = "wpaun";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }


    Pawn.prototype.move = function(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");

        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
            resetPossibles();
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };

    //Pawns can still attack forwards.  Need need NEED TO FIX THIS

    Pawn.prototype.guide = function(coords, name) {
        this.coords = coords.split("");
        for(let space of spaces) {
            let newspot = space.id.split("");
            var amove = matMath(false, this.coords, newspot);
            var move = matMath(true, this.coords, newspot);
            if(name.includes('b')) {
                if((move[0] == -1 && move[1] === 0) && space.className.includes("none")) {
                    document.getElementById(space.id).setAttribute("possible","true");
                    document.getElementById(space.id).style.background = "orange";
                } else if(((move[0] == -2 && move[1] === 0) && coords[0] == 2) && space.className == "none") {
                    if(document.getElementById([(parseInt(newspot[0]) - 1)+ newspot[1]]).className == "none") {
                        document.getElementById(space.id).setAttribute("possible","true");
                        document.getElementById(space.id).style.background = "orange";
                    }
                } else if((move[0] == -1 && amove[1] == 1) && space.className.includes('w')) {
                    document.getElementById(space.id).setAttribute("possible","true");
                    document.getElementById(space.id).style.background = "orange";
                }
            } else if(name.includes('w')) {
                if((move[0] == 1 && move[1] === 0) && space.className.includes("none")) {
                    document.getElementById(space.id).setAttribute("possible","true");
                    document.getElementById(space.id).style.background = "orange";
                } else if(((move[0] == 2 && move[1] === 0) && coords[0] == 7) && space.className == "none") {
                    if(document.getElementById([(parseInt(newspot[0]) + 1)+ newspot[1]]).className == "none") {
                        document.getElementById(space.id).setAttribute("possible","true");
                        document.getElementById(space.id).style.background = "orange";
                    }
                } else if((move[0] == 1 && amove[1] == 1) && space.className.includes('b')) {
                    document.getElementById(space.id).setAttribute("possible","true");
                    document.getElementById(space.id).style.background = "orange";
                }
            }
        }
    };

    function Queen(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        
        if(this.color == 'black') {
            this.piecename = 'bquen';
        } else {
            this.piecename = "wquen";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }
    
    Queen.prototype.move = function(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };

    //Down not working, rook horizontal not working

    Queen.prototype.guide = function(coords) {
        this.coords = coords.split("");
        let ulids = [];
        let urids = [];
        let dlids = [];
        let drids = [];

        let hlids = [];
        let hrids = [];
        let vuids = [];
        let vdids = [];

        let c0 = parseInt(coords[0]);
        let c1 = parseInt(coords[1]);
        //up left guide
        if(coords[0] <= 8-c1) {    
            let x = 1;
            for(i = c0; i <= 8; i++) {
                let ulid = [i+1, c1 - x].join('');
                x += 1;
                if(ulid[1] < 1 || ulid[1] > 8 || ulid[0] < 1 || ulid[0] > 8) {
                    break;
                
                } else if(document.getElementById(ulid).className == "none") {
                    ulids.push(ulid);
                } else if((this.color == "black" && document.getElementById(ulid).className.includes('white')) || (this.color == "white" && document.getElementById(ulid).className.includes('black'))) {
                    ulids.push(ulid);
                    break;
                } else if(this.color == "white" && document.getElementById(ulid).className.includes('white') || this.color == "black" && document.getElementById(ulid).className.includes('black')) {
                    
                    break;
                }
            }
        } else {
            let x = 1;
            
            for(i = c1-1; i >= 1; i--) {
                let ulid = [c0+x, i].join('');
                x += 1;
                if(ulid[1] < 1 || ulid[1] > 8 || ulid[0] < 1 || ulid[0] > 8) {
                    break;
                
                } else if(document.getElementById(ulid).className == "none") {
                    ulids.push(ulid);
                } else if((this.color == "black" && document.getElementById(ulid).className.includes('white')) || (this.color == "white" && document.getElementById(ulid).className.includes('black'))) {
                    ulids.push(ulid);
                    break;
                } else if(this.color == "white" && document.getElementById(ulid).className.includes('white') || this.color == "black" && document.getElementById(ulid).className.includes('black')) {
                    
                    break;
                }
            }
        }

        
        //up right guide
        if(c0 >= c1) {
            let x = 1;
            for(i = parseInt(coords[0])+1; i <= 8; i++) {
                let urid = [i, c1+x].join('');
                x += 1;
                if(urid[1] < 1 || urid[1] > 8 || urid[0] < 1 || urid[0] > 8) {
                    break;
                
                } else if(document.getElementById(urid).className == "none") {
                    urids.push(urid);
                } else if((this.color == "black" && document.getElementById(urid).className.includes('white')) || (this.color == "white" && document.getElementById(urid).className.includes('black'))) {
                    urids.push(urid);
                    break;
                } else if(this.color == "white" && document.getElementById(urid).className.includes('white') || this.color == "black" && document.getElementById(urid).className.includes('black')) {
                    
                    break;
                } 
            }
        } else {
            let x = 1;
            for(i = parseInt(coords[1])+1; i <= 8; i++) {
                let urid = [c0+x, i].join('');
                x += 1;
                if(urid[1] < 1 || urid[1] > 8 || urid[0] < 1 || urid[0] > 8) {
                    break;
                
                } else if(document.getElementById(urid).className == "none") {
                    urids.push(urid);
                } else if((this.color == "black" && document.getElementById(urid).className.includes('white')) || (this.color == "white" && document.getElementById(urid).className.includes('black'))) {
                    urids.push(urid);
                    break;
                } else if(this.color == "white" && document.getElementById(urid).className.includes('white') || this.color == "black" && document.getElementById(urid).className.includes('black')) {
                    
                    break;
                } 
            }
        }


        //down left guide
        if(coords[1] >= coords[0]) {
            let x = 1;
            for(i = c0-1; i >= 1; i--) {
                let dlid = [i, c1-x].join('');
                x += 1;
                if(dlid[1] < 1 || dlid[1] > 8 || dlid[0] < 1 || dlid[0] > 8) {
                    break;
                
                } else if(document.getElementById(dlid).className == "none") {
                    dlids.push(dlid);
                } else if((this.color == "black" && document.getElementById(dlid).className.includes('white')) || (this.color == "white" && document.getElementById(dlid).className.includes('black'))) {
                    dlids.push(dlid);
                    break;
                } else if(this.color == "white" && document.getElementById(dlid).className.includes('white') || this.color == "black" && document.getElementById(dlid).className.includes('black')) {
                    
                    break;
                }
            }
        } else {
            let x = 1;
            for(i = c0-1; i >= 1; i--) {
                let dlid = [i, c1-x].join('');
                x += 1;
                if(dlid[1] < 1 || dlid[1] > 8 || dlid[0] < 1 || dlid[0] > 8) {
                    break;
                
                } else if(document.getElementById(dlid).className == "none") {
                    dlids.push(dlid);
                } else if((this.color == "black" && document.getElementById(dlid).className.includes('white')) || (this.color == "white" && document.getElementById(dlid).className.includes('black'))) {
                    dlids.push(dlid);
                    break;
                } else if(this.color == "white" && document.getElementById(dlid).className.includes('white') || this.color == "black" && document.getElementById(dlid).className.includes('black')) {
                    
                    break;
                }
            }
        }

        //down right guide
        if(coords[0] >= coords[1]) {
            let x = 1;
            for(i = c1+1; i <= 8; i++) {
                let drid = [c0 - x, i].join('');
                x += 1;
                if(drid[1] < 1 || drid[1] > 8 || drid[0] < 1 || drid[0] > 8) {
                    break;
                
                } else if(document.getElementById(drid).className == "none") {
                    drids.push(drid);
                } else if((this.color == "black" && document.getElementById(drid).className.includes('white')) || (this.color == "white" && document.getElementById(drid).className.includes('black'))) {
                    drids.push(drid);
                    break;
                } else if(this.color == "white" && document.getElementById(drid).className.includes('white') || this.color == "black" && document.getElementById(drid).className.includes('black')) {
                    
                    break;
                }
            }
        } else {
            console.log('dright by 0');
            let x = 1;
            for(i = c0-1; i >= 1; i--) {
                let drid = [i, c1 + x].join('');
                x += 1;
                if(drid[1] < 1 || drid[1] > 8 || drid[0] < 1 || drid[0] > 8) {
                    break;
                
                } else if(document.getElementById(drid).className == "none") {
                    drids.push(drid);
                } else if((this.color == "black" && document.getElementById(drid).className.includes('white')) || (this.color == "white" && document.getElementById(drid).className.includes('black'))) {
                    drids.push(drid);
                    break;
                } else if(this.color == "black" && document.getElementById(drid).className.includes('black')) {
                    break;
                }
            }
        }

        //up vertical guide
        for(i = parseInt(coords[0])+1; i <= 8; i++) {
            let vuid = [i, coords[1]].join('');
            if(document.getElementById(vuid).className == "none") {
                vuids.push(vuid);
            } else if((this.color == "black" && document.getElementById(vuid).className.includes('white')) || (this.color == "white" && document.getElementById(vuid).className.includes('black'))) {
                vuids.push(vuid);
                break;
            } else if(this.color == "black" && document.getElementById(vuid).className.includes('black')) {
                break;
            }
        }
        
        //down vertical guide
        for(i = parseInt(coords[0])-1; i >= 1; i--) {
            let vdid = [i, coords[1]].join('');
            console.log('aaa');
            if(document.getElementById(vdid).className == "none") {
                vdids.push(vdid);
            } else if((this.color == "black" && document.getElementById(vdid).className.includes('white')) || (this.color == "white" && document.getElementById(vdid).className.includes('black'))) {
                vdids.push(vdid);
                break;
            } else if((this.color == "black" && document.getElementById(vdid).className.includes('black')) || (this.color == "white" && document.getElementById(vdid).className.includes('white'))) {
           
                break;
            } 
        }
        console.log(vdids+'vdids'); 

        //right horizontal guide
        for(i = parseInt(coords[1])+1; i <= 8; i++) {
            
            let hrid = [coords[0], i].join('');
            if(document.getElementById(hrid).className == "none") {
                hrids.push(hrid);
            } else if((this.color == "black" && document.getElementById(hrid).className.includes('white')) || (this.color == "white" && document.getElementById(hrid).className.includes('black'))) {
                hrids.push(hrid);
                break;
            } else if((this.color == "black" && document.getElementById(hrid).className.includes('black')) || (this.color == "white" && document.getElementById(vdid).className.includes('white'))) {
     
                break;
            }
        }
        console.log(hrids + 'hrids');

        //left horizontal guide
        for(i = parseInt(coords[1])-1; i >= 1; i--) {
            let hlid = [coords[0], i].join('');
            if(document.getElementById(hlid).className == "none") {
                hlids.push(hlid);
            } else if((this.color == "black" && document.getElementById(hlid).className.includes('white')) || (this.color == "white" && document.getElementById(hlid).className.includes('black'))) {
                hlids.push(hlid);
                break;
            } else if((this.color == "black" && document.getElementById(hlid).className.includes('black')) || (this.color == "white" && document.getElementById(vdid).className.includes('white'))) {
        
                break;
            }
        }
        console.log(hlids + 'hlids');
        
        let poss = urids.concat(ulids, drids, dlids, hlids, hrids, vuids, vdids);
        
        for(let id of poss) {
            document.getElementById(id).setAttribute("possible","true");
            document.getElementById(id).style.background = "orange";
        }
    };

    function Rook(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        if(this.color == 'black') {
            this.piecename = 'brook';
        } else {
            this.piecename = "wrook";
        }
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.piecename, this.spot);
    }

    Rook.prototype.move = function(coords, newspot, color, captured, fullname, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = matMath(false, coords, newspot);
        var amove = matMath(true, coords, newspot);
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, fullname, imagetext);
            placement(this.fullname, this.piecename, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };
    //guides need to radiate outwards from the piece

    //FINISH GUIDE TO ROOK AND QUEENS
    Rook.prototype.guide = function(coords, name) {
        this.coords = coords.split("");
        let hlids = [];
        let hrids = [];
        let vuids = [];
        let vdids = [];
        console.log(coords);

        let c0 = parseInt(coords[0]);
        let c1 = parseInt(coords[1]);

        //up vertical guide
        for(i = parseInt(coords[0])+1; i <= 8; i++) {
            let vuid = [i, coords[1]].join('');
            if(document.getElementById(vuid).className == "none") {
                vuids.push(vuid);
            } else if((this.color == "black" && document.getElementById(vuid).className.includes('white')) || (this.color == "white" && document.getElementById(vuid).className.includes('black'))) {
                vuids.push(vuid);
                break;
            } else if(this.color == "black" && document.getElementById(vuid).className.includes('black')) {
                
                break;
            }
        }
        
        //down vertical guide
        for(i = parseInt(coords[0])-1; i >= 1; i--) {
            let vdid = [i, coords[1]].join('');
            if(document.getElementById(vdid).className == "none") {
                vdids.push(vdid);
            } else if((this.color == "black" && document.getElementById(vdid).className.includes('white')) || (this.color == "white" && document.getElementById(vdid).className.includes('black'))) {
                vdids.push(vdid);
                break;
            } else if((this.color == "black" && document.getElementById(vdid).className.includes('black')) || (this.color == "white" && document.getElementById(vdid).className.includes('white'))) {
                
                break;
            } 
        }

        //right horizontal guide
        for(i = c1+1; i <= 8; i++) {
            
            let hrid = [coords[0], i].join('');
            if(document.getElementById(hrid).className == "none") {
                hrids.push(hrid);
            } else if((this.color == "black" && document.getElementById(hrid).className.includes('white')) || (this.color == "white" && document.getElementById(hrid).className.includes('black'))) {
                hrids.push(hrid);
                break;
            } else if((this.color == "black" && document.getElementById(hrid).className.includes('black')) || (this.color == "white" && document.getElementById(vdid).className.includes('white'))) {
                
                break;
            }
        }
        console.log(hrids + 'hrids');

        //left horizontal guide
        for(i = c1-1; i >= 1; i--) {
            let hlid = [coords[0], i].join('');
            if(document.getElementById(hlid).className == "none") {
                hlids.push(hlid);
            } else if((this.color == "black" && document.getElementById(hlid).className.includes('white')) || (this.color == "white" && document.getElementById(hlid).className.includes('black'))) {
                hlids.push(hlid);
                break;
            } else if((this.color == "black" && document.getElementById(hlid).className.includes('black')) || (this.color == "white" && document.getElementById(vdid).className.includes('white'))) {
                
                break;
            }
        }
        console.log(hlids + 'hlids');

        let poss = vuids.concat(vdids, hlids, hrids);
        
        for(let id of poss) {
            document.getElementById(id).setAttribute("possible","true");
            document.getElementById(id).style.background = "orange";
        }
    };

    function diagonalGuide(coords, c0, c1, );

    //Reorganize these into objects of objects
    function start() {
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
        };
        wcapturedPieces = [];
        bcapturedPieces = [];
        turn = 0;
        
        //Establishing the clickedpiece variable.  This will contain a value to be used by this function that will determine what happens on mouseclicks.
        localStorage.setItem("clickedpiece","none");
    }

    start();  

    document.getElementById('reset').addEventListener('click', function() {
        clear();
        start();
    });

    //Another problem is that pieces can jump over each other willy nilly.  Can't have it.  Need to make it so that if pieces are
    //in between (set up some sort of matrix math function?) and users try to click on or past a friendly it doesnt happen

    //NEW TO DO:  MAKE IT SO THAT YOU CAN ONLY CAPTURE PIECES ON VALID MOVES
    //Add the capture function to the move functions
    
    board = document.getElementsByClassName("board");
    //let spaces = document.querySelectorAll("[space = 'true']");
    
    
    //example movement: Pwhite7.move('77','67');

    //Flip a coin to decide who goes first
    //Set one of the two colors to have their turn on evens or odds
    //iterate turn count every time a piece is moved

    

    for (let space of spaces) {
        //This is for the highlighting function.
        document.getElementById(space.id).setAttribute("possible","false");
        //Adding Event listeners to every board space.
        space.addEventListener('click', function() {
            //If no piece has been selected and the space is empty, nothing happens.
            console.log(this.className);
            if(localStorage.getItem("clickedpiece") == "none" && this.className == "none") {
                console.log("Pick a piece!");
            //If no piece has been selected and the space is not empty, this piece is now the clicked one.  This is where the turn functionality will go.
            } else if(localStorage.getItem("clickedpiece") == "none" && this.className != "none") {
                //Here I need to introduce the colored spaces thing.  Create a new function for it.
                if((turn % 2 === 0 && this.className.includes("b")) || (turn % 2 !== 0 && this.className.includes("w"))) {
                    localStorage.setItem("clickedpiece",this.className);
                    localStorage.setItem("oldcoords", this.id);
                    color();
                    toPiece[this.className].guide(this.id, this.className);
                } else {
                    alert("Not your turn!");
                }
            //If a piece has been selected and the space is empty (move legitimacy is checked elsewhere), the piece will be moved there and the turn count will be increased.
            //Should I restructure the whole thing?  How?
            } else if((localStorage.getItem("clickedpiece") != "none" && this.className == "none")) {
                localStorage.setItem("captured", "false");
                console.log('clicked piece to empty space');
                toPiece[localStorage.getItem("clickedpiece")].move(localStorage.getItem("oldcoords"), this.id, localStorage.getItem("color"), localStorage.getItem("captured"), this.className, this.innerHTML.slice(19,24));
                color();
                localStorage.setItem("clickedpiece","none");
                localStorage.setItem("oldcoords", "none");
                localStorage.setItem("color","none");             
                
            //This is where capturing begins. If a piece has been selected and the space has a piece that is not the same piece, the capture will not happen.
            } else if(((localStorage.getItem("clickedpiece") != "none" && this.className != "none") && localStorage.getItem("clickedpiece") != this.className) && this.getAttribute("possible") == "true") {
                //If the new space has a piece that is a different color, then capturing will occur.  
                
                if(((localStorage.getItem("clickedpiece").includes('w') && this.className.includes('b'))) || ((localStorage.getItem("clickedpiece").includes('b') && this.className.includes('w')))) {
                    console.log('clicked piece to capture');
                    localStorage.setItem("captured","true");
                    //Moving the piece.  It also captures if the right conditions are met, such as "captured" being set to true.
                    toPiece[localStorage.getItem("clickedpiece")].move(localStorage.getItem("oldcoords"), this.id, localStorage.getItem("color"), localStorage.getItem("captured"), this.className, this.innerHTML.slice(19,24)); 
                    color();
                    localStorage.setItem("captured","false");
                    localStorage.setItem("clickedpiece","none");
                    localStorage.setItem("oldcoords", "none");
                } else {
                    //If it's just a different piece of the same team, you switch to moving that piece.
                    console.log('clicked piece switching to other clicked piece');
                    localStorage.setItem("clickedpiece",this.className);
                    localStorage.setItem("oldcoords", this.id);
                    color();
                    toPiece[this.className].guide(this.id, this.className);
                    console.log('No friendly fire!');
                }
                
            } else if(((localStorage.getItem("clickedpiece").includes("b") && this.className.includes("b")) || (localStorage.getItem("clickedpiece").includes("w") && this.className.includes("w")))) {
                //If it's just a different piece of the same team, you switch to moving that piece.
                console.log('clicked piece switching to other clicked piece');
                localStorage.setItem("clickedpiece",this.className);
                localStorage.setItem("oldcoords", this.id);
                color();
                toPiece[this.className].guide(this.id, this.className);
            }

        });
    }

    //NEXT UP: SPECIAL RULES

});
