//Initialize variables
const grid = document.querySelector(".GameContainer");
const win = document.querySelector(".win");
const validation = document.querySelector(".validationContainer");
var firstTile = null;
var finished = true;
var numberRevealed = 0;
var size=0;
var gen=0;

button4 = document.getElementById("4");
button6 = document.getElementById("6");
buttonBeginner = document.getElementById("beginner");
buttonInitiate = document.getElementById("initiate");
buttonExpert = document.getElementById("expert");
input = document.getElementById("gen");



function buildTile(id,size){
    //create the tile, its front and its back
    const tile = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");
    tile.append(front,back);

    tile.classList.add("tile");
    front.classList.add("front");
    back.classList.add("back");
    tile.setAttribute("tile-id",id);
    tile.setAttribute("revealed","false");

    //pokemon image
    const pok_img = document.createElement("img");
    var source = "pokemon_jpg/"+id+".jpg";
    pok_img.src = source ;
    pok_img.classList.add("image");
    tile.lastChild.appendChild(pok_img);

    //add the mechanism
    tile.addEventListener("click", () => game(tile,size));
    
    return tile;
}



async function game(tile,size){
    //if already revealed, same tile, or turn not finished
    var isRevealed = tile.getAttribute("revealed");
    if ((isRevealed==="true")||(firstTile === tile)||(!(finished))){
        return;
    }
    //flip the card
    tile.classList.add("flip");
    //if 1st card
    if (firstTile === null) {
        firstTile = tile;
        return;
    }
    //if 2nd card
    else { 
        finished = false;
        if (firstTile.getAttribute("tile-id")===tile.getAttribute("tile-id")){ //match
            //validation for initiate level
            if (level==="initiate"){
                gen = await playerInput();
                if (!(validate())) {
                    tile.classList.toggle("flip");
                    firstTile.classList.toggle("flip")}
                else {
                    firstTile.setAttribute("revealed","true");
                    tile.setAttribute("revealed","true");
                    numberRevealed += 2}
                firstTile = null;
                finished = true;
                }
            //no need for validation
            else {
                firstTile.setAttribute("revealed","true");
                tile.setAttribute("revealed","true");
                firstTile = null;
                numberRevealed += 2;
                finished=true}
            } 

        else { // not match
            setTimeout(() => {
                tile.classList.toggle("flip");
                firstTile.classList.toggle("flip");
                firstTile = null;
                finished = true;
            }, 1000);
        }
    }
    //end of game ?
    if (numberRevealed===size*size){
        setTimeout(() => {   
            win.classList.add("active");
        }, 500);
    }
}


function playerInput() {
    return new Promise((resolve) => {
      validation.style.display = "block";
      function event (){
        var value = parseInt(input.value);
        console.log(value);
        validation.style.display = 'none'; 
        resolve(value);
      }
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter'){ event() }
      })
      input.removeEventListener('keypress', event);
    })
  }



function displayGrid(size){
    // reset grid if already one
    removeChild(grid);
    firstTile=null;
    numberRevealed=0;
    // adapt grid template size
    if (size === 4){
        grid.classList.remove("big");
        grid.classList.add("small");
    }
    else{
        grid.classList.remove("small");
        grid.classList.add("big");
    }
    // generate pairs of pokemon
    const pokemonID = chosePokemonGrid(size);
    // create tiles
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const id = pokemonID[size*i+j];
            const tile = buildTile(id,size);
            grid.appendChild(tile);
        }
    }
}




function chosePokemonGrid(size){
    var pokemonID=[];
    while (pokemonID.length < (size*size)){
        const randomID = Math.floor(Math.random() * 721)+1;
        if (!(pokemonID.indexOf(randomID)>=0)){
            pokemonID.push(randomID);
            pokemonID.push(randomID);
        }
    }
    pokemonID = pokemonID.sort(() => Math.random() - 0.5);
    return pokemonID;
}



function getGeneration(id){
    if (id<=151 && id>=1) return(1);
    if (id<=251 && id>=152) return(2);
    if (id<=386 && id>=252) return(3);
    if (id<=493 && id>=387) return(4);
    if (id<=649 && id>=494) return(5);
    if (id<=721 && id>=650) return(6);
}


function validate(){
    if (getGeneration(firstTile.getAttribute("tile-id"))===gen) return(true);
    else {return(false)}
}


//For the grid reset
function removeChild(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
}




//Effects of buttons (maybe not optimal...)
button4.addEventListener("click", () => {
    size=4;
    displayGrid(size);
    button4.classList.add("pushed");
    button6.classList.remove("pushed");
});

button6.addEventListener("click", () => {
    size=6;
    displayGrid(size);
    button6.classList.add("pushed");
    button4.classList.remove("pushed");
});

buttonBeginner.addEventListener("click", () => {
    displayGrid(size);
    buttonBeginner.classList.add("pushed");
    buttonInitiate.classList.remove("pushed");
    buttonExpert.classList.remove("pushed");
    level = "Beginner";
});

buttonInitiate.addEventListener("click", () => {
    displayGrid(size);
    buttonBeginner.classList.remove("pushed");
    buttonInitiate.classList.add("pushed");
    buttonExpert.classList.remove("pushed");
    level = "initiate";
});

buttonExpert.addEventListener("click", () => {
    displayGrid(size);
    buttonBeginner.classList.remove("pushed");
    buttonInitiate.classList.remove("pushed");
    buttonExpert.classList.add("pushed");
    level = "expert";
});





//Initialize game
button4.click();
buttonBeginner.click();
