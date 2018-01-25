var math = require('mathjs')


function Bishop(coords, newspot){
    this.coords = coords.split(",");
    this.newspot = math.matrix(newspot.split(","));
    var move = math.subtract(coords, newspot);

    for(var i = 0; i <= 1; i++){
        coords[i] = Math.abs(coords[i])
    }

}

Bishop('3,4', '2,3')

function King(coords, newspot){
    this.coords = coords.split(",");
    this.newspot = newspot.split(",");
    this.newspotset = function(){
        console.log('butkus')
    };

}
function Knight(coords, newspot){
    this.coords = coords.split(",");
    this.newspot = newspot.split(",");
    this.newspotset = function(){
        console.log('butkus')
    };

}
function Pawn(coords, newspot){
    this.coords = coords.split(",");
    this.newspot = newspot.split(",");
    this.newspotset = function(){
        console.log('butkus')
    };

}
function Queen(coords, newspot){
    this.coords = coords.split(",");
    this.newspot = newspot.split(",");
    this.newspotset = function(){
        console.log('butkus')
    };

}
function Rook(coords, newspot){
    this.coords = coords.split(",");
    this.newspot = newspot.split(",");
    this.newspotset = function(){
        console.log('butkus')
    };

}