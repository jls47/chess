export const capture = (spot, fullname, imagetext) => {
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
    };

    export const move = (coords, newspot, color, captured, fullname, imagetext) => {
        this.coords = coords.split("");
        this.newspot = newspot.split("");
        var move = absMatMath(coords, newspot);
        var amove = regMatMath("ubtract",coords, newspot);
        if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'false'){
            placement(fullname, imagetext, newspot);
            despawn(coords);
            turn += 1;
        }else if((document.getElementById(newspot).getAttribute("possible") == "true") && captured == 'true'){
            capture(newspot, fullname, imagetext);
            placement(fullname, imagetext, newspot);
            despawn(coords);
            turn += 1;
        }else{
            alert('Cannot move there!');   
        }
    };