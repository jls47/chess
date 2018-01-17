localStorage.setItem("ospaces", "")
localStorage.setItem("xspaces", "")

var game = function(){
    var turn = 1;
    $(".board").children().click(function(){
        var id = $(this).attr('id');
        if(localStorage.getItem("xspaces").includes(id) || localStorage.getItem('ospaces').includes(id)){
            alert("Choose another square!");    
        }else{
            if(turn % 2 != 0){
                $('#'+id).css("background-image", 'url("x.png")')
                $('#'+id).css("background-size", "cover")
                turn += 1;
                var oldx = localStorage.getItem("xspaces");
                if( oldx === null){
                    localStorage.setItem("xspaces", id);
                }else{
                    localStorage.setItem("xspaces", oldx + ", " + id);
                };
                console.log(localStorage.getItem("xspaces"));
            }else{
                $('#'+id).css("background-image", 'url("o.png")')
                $('#'+id).css("background-size", "cover")
                turn += 1;
                var oldo = localStorage.getItem("ospaces")
                if( oldo === null){
                    localStorage.setItem("ospaces", id);
                }else{
                    localStorage.setItem("ospaces", oldo + ", " + id);
                };
                console.log(localStorage.getItem("xspaces"));
            };
        }
    })

    
}

$(".clear").click(function(){
    localStorage.clear();
    $(".board").children().css("background-image", "none")
    localStorage.setItem("ospaces", "")
    localStorage.setItem("xspaces", "")
})

game();