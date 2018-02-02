var matrixsub = function(first, last){
    var move = [];
    for(var i = 0; i < 2; i++){
        console.log(first[i])
        console.log(last[i])
        move.push(Math.abs(first[i]-last[i]));
        console.log(i);
    }
    return move;
}

function Bishop(coords, newspot){
    this.coords = coords.split("");
    this.newspot = newspot.split("");
    var move = matrixsub(coords, newspot);
    if(move[0] = move[1]){
        console.log("move seems legit")
    }

}

Bishop('34', '23');

function King(coords, newspot){
    this.coords = coords.split("");
    this.newspot = newspot.split("");
    var move = matrixsub(coords, newspot);
    if((move[0] == 0 && move[1] == 1) || (move[0] == 1 && move[1] == 0)){
        console.log("move seems legit")
    }
}

King('34', '33');

function Knight(coords, newspot){
    this.coords = coords.split("");
    this.newspot = newspot.split("");
    var move = matrixsub(coords, newspot);
    if((move[0] == 1 && move[1] == 4) || (move[0] == 4 && move[1] == 1)){
        console.log("move seems legit")
    }
}

Knight('34','48');

function Pawn(coords, newspot){
    this.coords = coords.split("");
    this.newspot = newspot.split("");
    var move = matrixsub(coords, newspot);
    if(move[0] == 0 && move[1] == 1){
        console.log("move seems legit")
    }else if(((move[0] == 0 && move[1] == 2) && coords[0] == 1) || ((move[0] == 0 && move[1] == 2) && coords[2] == 7)){
        console.log("move seems legit")
    }
}
Pawn('34','35');

function Queen(coords, newspot){
    this.coords = coords.split("");
    this.newspot = newspot.split("");
    var move = matrixsub(coords, newspot);
    if(move[0] == move[1] || move[0] == 0 || move[1] == 0){
        console.log("move seems legit")
    }
}

Queen('34','38');

function Rook(coords, newspot){
    this.coords = coords.split("");
    this.newspot = newspot.split("");
    var move = matrixsub(coords, newspot);
    if(move[0] == 0 || move[1] == 0){
        console.log("move seems legit");
    }
}
Rook('34', '74');
