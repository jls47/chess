

//Simple matrix math function.  I use cartesian coordinates for the spaces instead of e5, e3, etc. so that move legality can be determined easily.
export const absMatMath = (first, last) => {
    var move = [];
    for(var i = 0; i < 2; i++){
        move.push(Math.abs(first[i]-last[i]));
    }
   
    return move;
};

//Pawns, since they can only move forward, need to have a matrix function that doesn't rely on absolute values for moving.
//This will also come in handy for the guidance function and determining whether pieces can move past a certain point.
export const regMatMath = (operation, first, last) => {
    var move = [];
    if(operation == "subtract"){
        for(var i = 0; i < 2; i++){
            move.push(first[i]-last[i]);
        }
    }else if(operation == "add"){
        for(var i = 0; i < 2; i++){
            move.push(first[i] - last[i])
        }
    }
    return move;
};

