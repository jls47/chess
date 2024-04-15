

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

const opps = {
    'W': 'B',
    'B': 'W'
}

//make the clearing function mostly only apply to the middle parts!  It's making the regular bits not clickable!

const board = document.getElementsByClassName("board");

const clear = () => {
    var c1 = 'rgb(242,242,242)';
    var c2 = 'lightblue';
    for(var i = 0; i < board[0].children.length; i++) {
        let id = board[0].children[i].id;
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
        despawn(id);
    }
    localStorage.clear();
}


    //Removing pieces from where they were before they moved.
    const despawn = (spot) => {
        document.getElementById(spot).innerHTML = '';
        document.getElementById(spot).setAttribute('class', 'none');
        document.getElementById(spot).setAttribute('possible', 'false');
    }



/////////////////////////////////////////////////////////////////////
//Start restructuring.  You can have one universal movement function dependent upon different guide functions.
//Start writing the guide functions to incorporate matrix math.
//In the guide functions, add the possible spots.  Add conditions.  If there is a break in the possibles, depending on the color (directionality), 
//cut off the possibles after a certain point.  This is the real reason for the regular matrix math.
/////////////////////////////////////////////////////////////////////

//When the board has loaded, we can begin.
document.addEventListener("DOMContentLoaded", function(event) {
    //First, I establish the piece names.

    var bsBlack1, bsBlack2,  kgBlack, knBlack1, knBlack2, pnBlack1, pnBlack2, pnBlack3, pnBlack4, pnBlack5, pnBlack6, pnBlack7, pnBlack8, qnBlack, rkBlack1, rkBlack2;    
    var bsWhite1, bsWhite2, kgWhite, knWhite1, knWhite2, pnWhite1, pnWhite2, pnWhite3, pnWhite4, pnWhite5, pnWhite6, pnWhite7, pnWhite8, qnWhite, rkWhite1, rkWhite2;

    var turn, bcapturedPieces, wcapturedPieces;

    let spaces = document.querySelectorAll("[space = 'true']");
    
    //Styling the board.  Choosing white and light blue for the time being.
    var c1 = 'rgb(242,242,242)';
    var c2 = 'lightblue';
    var tmp = '';
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


    //Placing the pieces on the board.  Place them by name, spot coordinates, and image name.
    function placement(name, spot) {
        this.spot = spot;
        this.src = './assets/' + name.substring(0, 7) + '.png';
        document.getElementById(this.spot).innerHTML = '<img src="'+src+'"/>';
        document.getElementById(this.spot).setAttribute('class', name);

        //This will be where the actual socket updates happen.  The call will be here, the response will come
        //through as an event listener I guess?  That would also call this.
        //resetPossibles();
    }

    function resetPossibles() {
        for(let space of spaces) {
            document.getElementById(space.id).setAttribute("possible","false");
        }
    }

    //Capturing enemy pieces.  Setting up a JSON array to contain the captured pieces so that if a pawn wants to become a different piece it can.
    function capture(spot, fullname, imagetext) {
        this.spot = spot;
        this.name = fullname;
        if(imagetext.includes('kg')) {
            alert("Game over!");
            clear();
        }
        //figure out if the names are being pushed to the capture list
        if(this.name.includes("Black")) {
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

    function lineGuide(coords, ids, horz, vert, color) {
        let c0 = parseInt(coords.split("")[0]);
        let c1 = parseInt(coords.split("")[1]);
        while(c0 < 9 && c0 > 0 && c1 < 9 && c1 > 0) {
            c0 += vert;
            c1 += horz;
            if(!(c0 > 8 || c0 < 1 || c1 > 8 || c1 < 1)) {
                let newId = [c0, c1].join('');
                if(document.getElementById(newId).className == "none") {
                    ids.push(newId);
                } else {
                    if(!document.getElementById(newId).className.includes(color)) {
                        ids.push(newId);
                    }
                    break;
                }
            }

        }
    }
        
    function Bishop(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.spot);
    }

    Bishop.prototype.move = function(coords, newspot, captured, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        if(document.getElementById(newspot).getAttribute("possible") == "true") {
            if(captured == 'true') {
                capture(newspot, this.fullname, imagetext);
            }
            placement(this.fullname, newspot, this.color);
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
        let poss = [];
        console.log(coords)

        //up left guide

        lineGuide(coords, poss, -1, 1, this.color);
        
        lineGuide(coords, poss, 1, 1, this.color);
        
        lineGuide(coords, poss, -1, -1, this.color);
        
        lineGuide(coords, poss, 1, -1, this.color);
        
        
        for(let id of poss) {
            document.getElementById(id).setAttribute("possible","true");
            document.getElementById(id).style.background = "orange";
        }
    };

    function King(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.spot);
    }

    King.prototype.move = function(coords, newspot, captured, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, this.fullname, imagetext);
            placement(this.fullname, newspot, this.color);
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
                if(space.className == "none" || ((space.className.includes('B') && name.includes('W')) || (space.className.includes('W') && name.includes('B')))) {
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
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.spot);
    }

    Knight.prototype.move = function(coords, newspot, captured, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, this.fullname, imagetext);
            placement(this.fullname, newspot, this.color);
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
                if(space.className == "none" || ((space.className.includes('B') && name.includes('W')) || (space.className.includes('W') && name.includes('B')))) {
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
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.spot);
    }


    Pawn.prototype.move = function(coords, newspot, captured, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");

        if(document.getElementById(newspot).getAttribute("possible") == "true") {
            if(captured == 'true') {
                capture(newspot, this.fullname, imagetext);
            }
            placement(this.fullname, newspot, this.color);
            despawn(coords);
            turn += 1;
            resetPossibles();
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };

    Pawn.prototype.guide = function(coords, name) {
        /*
        Refactored movement.  No longer looks at literally every space on the board.
        */

        nCoords = coords.split("");

        let dir = {
            'B': 1,
            'W': -1
        }

        let start = {
            'B': 2,
            'W': 7
        }

        let atStart = (parseInt(nCoords[0]) == start[name.substring(2,3)]);
        
        if(parseInt(nCoords[0]) % 8 != 0) {
            nCoords[0] = "" + (parseInt(nCoords[0]) + dir[name.substring(2,3)]);
            let front = nCoords.join('');

            if(document.getElementById(front).className == "none") {
                document.getElementById(nCoords.join('')).setAttribute("possible", "true");
                document.getElementById(nCoords.join('')).style.background = "orange";
            
                if(atStart) {
                    nCoords[0] = "" + (parseInt(nCoords[0]) + dir[name.substring(2,3)]);
                    document.getElementById(nCoords.join('')).setAttribute("possible", "true");
                    document.getElementById(nCoords.join('')).style.background = "orange";
                }
            }

            if(nCoords[1] < 8) {
                nCoords[1] = "" + (parseInt(nCoords[1]) + 1);
                if(document.getElementById(nCoords.join('')).className.includes(opps[name.substring(2,3)])) {
                    document.getElementById(nCoords.join('')).setAttribute("possible", "true");
                    document.getElementById(nCoords.join('')).style.background="orange";
                }
                nCoords[1] = "" + (parseInt(nCoords[1]) - 1);
            }

            if(nCoords[1] > 1) {
                nCoords[1] = "" + (parseInt(nCoords[1]) - 1);
                if(document.getElementById(nCoords.join('')).className.includes(opps[name.substring(2,3)])) {
                    document.getElementById(nCoords.join('')).setAttribute("possible", "true");
                    document.getElementById(nCoords.join('')).style.background="orange";
                }
                nCoords[1] = "" + (parseInt(nCoords[1]) + 1);
            }
        }

        
    };

    function Queen(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.spot);
    }
    
    Queen.prototype.move = function(coords, newspot, captured, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        if(document.getElementById(newspot).getAttribute("possible") == "true") {
            if(captured == "true") {
                capture(newspot, this.fullname, imagetext);
            }
            placement(this.fullname, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };

    Queen.prototype.guide = function(coords, name) {
        this.coords = coords.split("");
        let poss = [];
        
        lineGuide(coords, poss, -1, 1, this.color);
        
        lineGuide(coords, poss, 1, 1, this.color);
        
        lineGuide(coords, poss, -1, -1, this.color);
        
        lineGuide(coords, poss, 1, -1, this.color);

        
        lineGuide(coords, poss, -1, 0, this.color);
        
        lineGuide(coords, poss, 1, 0, this.color);
        
        lineGuide(coords, poss, 0, -1, this.color);
        
        lineGuide(coords, poss, 0, 1, this.color);

        
        for(let id of poss) {
            document.getElementById(id).setAttribute("possible","true");
            document.getElementById(id).style.background = "orange";
        }
    };

    function Rook(spot, color, name) {
        this.color = color;
        this.spot = spot;
        this.fullname = name;
        document.getElementById(spot).className = this.fullname;
        placement(this.fullname, this.spot);
    }

    Rook.prototype.move = function(coords, newspot, captured, imagetext) {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false') {
            placement(this.fullname, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true') {
            capture(newspot, this.fullname, imagetext);
            placement(this.fullname, newspot, this.color);
            despawn(coords);
            turn += 1;
        } else {
            alert('Cannot move there!');   
            resetPossibles();
        }
    };
    
    Rook.prototype.guide = function(coords) {
        this.coords = coords.split("");
        console.log(coords)

        let poss = [];
        
        lineGuide(coords, poss, -1, 0, this.color);
        
        lineGuide(coords, poss, 1, 0, this.color);
        
        lineGuide(coords, poss, 0, -1, this.color);
        
        lineGuide(coords, poss, 0, 1, this.color);
        
        for(let id of poss) {
            document.getElementById(id).setAttribute("possible","true");
            document.getElementById(id).style.background = "orange";
        }
    };

    //Reorganize these into objects of objects
    function start() {
        localStorage.clear();
        clear();
        //A fresh start. Replacing all the pieces and clearing localstorage.
        bsBlack1 = new Bishop('13', "Black", 'bsBlack1');
        bsBlack2 = new Bishop('16', "Black", 'bsBlack2');
        kgBlack = new King('14', "Black", 'kgBlack');
        knBlack1 = new Knight('12', "Black", 'knBlack1');
        knBlack2 = new Knight('17', "Black", 'knBlack2');
        pnBlack1 = new Pawn('21',"Black", 'pnBlack1');
        pnBlack2 = new Pawn('22',"Black", 'pnBlack2');
        pnBlack3 = new Pawn('23',"Black", 'pnBlack3');
        pnBlack4 = new Pawn('24',"Black", 'pnBlack4');
        pnBlack5 = new Pawn('25',"Black", 'pnBlack5');
        pnBlack6 = new Pawn('26',"Black", 'pnBlack6');
        pnBlack7 = new Pawn('27',"Black", 'pnBlack7');
        pnBlack8 = new Pawn('28',"Black", 'pnBlack8');
        qnBlack = new Queen('15',"Black", 'qnBlack');
        rkBlack1 = new Rook('11',"Black", 'rkBlack1');
        rkBlack2 = new Rook('18',"Black", 'rkBlack1');
        
        bsWhite1 = new Bishop('83', "White", 'bsWhite1');
        bsWhite2 = new Bishop('86', "White", 'bsWhite2');
        kgWhite = new King('84', "White", 'kgWhite');
        knWhite1 = new Knight('82', "White", 'knWhite1');
        knWhite2 = new Knight('87', "White", 'knWhite2');
        pnWhite1 = new Pawn('71',"White", 'pnWhite1');
        pnWhite2 = new Pawn('72',"White", 'pnWhite2');
        pnWhite3 = new Pawn('73',"White", 'pnWhite3');
        pnWhite4 = new Pawn('74',"White", 'pnWhite4');
        pnWhite5 = new Pawn('75',"White", 'pnWhite5');
        pnWhite6 = new Pawn('76',"White", 'pnWhite6');
        pnWhite7 = new Pawn('77',"White", 'pnWhite7');
        pnWhite8 = new Pawn('78',"White", 'pnWhite8');
        qnWhite = new Queen('85',"White", 'qnWhite');
        rkWhite1 = new Rook('81',"White", 'rkWhite1');
        rkWhite2 = new Rook('88',"White", 'rkWhite2');
        
        
        toPiece = {
            'bsBlack1': bsBlack1,
            'bsBlack2': bsBlack2,
            'kgBlack': kgBlack,
            'knBlack1': knBlack1,
            'knBlack2': knBlack2,
            'pnBlack1': pnBlack1,
            'pnBlack2': pnBlack2,
            'pnBlack3': pnBlack3,
            'pnBlack4': pnBlack4,
            'pnBlack5': pnBlack5,
            'pnBlack6': pnBlack6,
            'pnBlack7': pnBlack7,
            'pnBlack8': pnBlack8,
            'qnBlack': qnBlack,
            'rkBlack1': rkBlack1,
            'rkBlack2': rkBlack2,
            'bsWhite1': bsWhite1,
            'bsWhite2': bsWhite2,
            'kgWhite': kgWhite,
            'knWhite1': knWhite1,
            'knWhite2': knWhite2,
            'pnWhite1': pnWhite1,
            'pnWhite2': pnWhite2,
            'pnWhite3': pnWhite3,
            'pnWhite4': pnWhite4,
            'pnWhite5': pnWhite5,
            'pnWhite6': pnWhite6,
            'pnWhite7': pnWhite7,
            'pnWhite8': pnWhite8,
            'qnWhite': qnWhite,
            'rkWhite1': rkWhite1,
            'rkWhite2': rkWhite2,
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
                if((turn % 2 === 0 && this.className.includes("B")) || (turn % 2 !== 0 && this.className.includes("W"))) {
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
                
                if(((localStorage.getItem("clickedpiece").includes('W') && this.className.includes('B'))) || ((localStorage.getItem("clickedpiece").includes('B') && this.className.includes('W')))) {
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
                
            } else if(((localStorage.getItem("clickedpiece").includes("B") && this.className.includes("B")) || (localStorage.getItem("clickedpiece").includes('W') && this.className.includes('W')))) {
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
