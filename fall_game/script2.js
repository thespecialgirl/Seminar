let game = document.getElementById("game");
let counter = 0;          //brojač blokova i za score
let interval;           //interval za kretanje
let both = 0;             //provjera istovremenog pritiska
let currentBlocks = [];
let isPaused = true;
let playerName = "";

class Player {
    constructor() {
        this.el = document.getElementById("character");
        this.isFalling = true;
    }
       
    get top(){
            return parseInt(getComputedStyle(this.el).top);
        }

    get left() {
        return parseInt(getComputedStyle(this.el).left);
    }

    moveLeft(){
        if (this.left > 0) {
            this.el.style.left = this.left - 2 + "px";
        }
     }
    moveRight() {
        if (this.left < 380) {
            this.el.style.left =this.left + 2 + "px";
        }
    }
    fall(){
        if(this.top<480){
            this.el.style.top = this.top + 2 + "px";
        }
    }
    rise(){
        this.el.style.top = this.top - 0.5 + "px";
    }
}
let player=new Player();

//kontrola kretanja
document.addEventListener("keydown", event => {
    if (isPaused) return;

    if (both == 0) {
        both++;
    }
    if (event.key === "ArrowLeft") {
        interval = setInterval(()=>player.moveLeft(), 1);
    }
    if (event.key === "ArrowRight") {
        interval = setInterval(()=>player.moveRight(), 1);
    }
});

document.addEventListener("keyup", () => {  //zaustavljanje kretanja
    clearInterval(interval);
    both = 0;
});

//game loop
let blocks = setInterval(()=> {

    if (isPaused) return;
    player.isFalling = true;

    let blockLast = document.getElementById("block" + (counter - 1));    //dohvati zadnji blok
    let holeLast = document.getElementById("hole" + (counter - 1));

    let blockLastTop=0;
    let holeLastTop=0;

    if (counter > 0) {
        blockLastTop =parseInt(getComputedStyle(blockLast).top);   //dohvati njegovu poziciju
        holeLastTop =parseInt(getComputedStyle(holeLast).top);
    }

    if (counter === 0 || blockLastTop < 400) {

        let block = document.createElement("div");   //kreiraj nove elemente
        let hole = document.createElement("div");

        block.className = "block";
        hole.className = "hole";

        block.id = "block" + counter;
        hole.id = "hole" + counter;

        block.style.top = (counter === 0 ? 100 : blockLastTop + 100) + "px";
        hole.style.top = (counter === 0 ? 100 : holeLastTop + 100) + "px";

        let random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";      //postavi rupu na random poziciju

        game.appendChild(block);
        game.appendChild(hole);
        currentBlocks.push(counter);
        counter++;
    }

    for (let i = 0; i < currentBlocks.length; i++) {
        let id= currentBlocks[i];
        let block = document.getElementById("block" + id);
        let hole = document.getElementById("hole" + id);
        let blockTop = parseFloat(getComputedStyle(block).top);

        block.style.top = blockTop - 0.5 + "px";    //pomakni blokove i rupe dolje
        hole.style.top = blockTop - 0.5 + "px";

        if (blockTop < -20) {
            currentBlocks.splice(i, 1);      //ukloni blok iz niza ako je izvan ekrana
            i--;
            block.remove();
            hole.remove();
            continue;
        }
      //provjera sudara s rupom
     if (player.top + 20 >= blockTop && player.top + 20 <= blockTop + 20) {

            let holeLeft =parseInt(getComputedStyle(hole).left);

            if (player.left >= holeLeft && player.left + 20 <= holeLeft + 40) {
                player.isFalling = true;}
            else {
                player.isFalling = false;
            }
        }
    }
    if(player.isFalling) {
        player.fall();
    } else {
        player.rise();
    }

    //game over provjera
    if (player.top <= 0) {
        let score = counter - 9;
        let scores = JSON.parse(sessionStorage.getItem("scores")) || [];  //dohvati postojece rezultate
        scores.push({       //dodaj novi rez
            name: playerName,
            score
        });
        sessionStorage.setItem("scores", JSON.stringify(scores));      //spremi nazad
        ShowScores();
        alert(
            " Gameover!\n" + "Player:" + playerName + "\n" + "Score:" + score
        );
        clearInterval(blocks);
        location.reload();
    }
    }, 1);

//kontrole gumba

document.getElementById("startBtn").onclick = () => {
    playerName = prompt("Upiši svoje ime:");
    if (!playerName) playerName = "Anonimno"
    isPaused = false;
    document.getElementById("startOverlay").style.display = "none";
};

document.getElementById("pauseBtn").onclick = () => {
    isPaused = true;
};

document.getElementById("resumeBtn").onclick = () => {
    isPaused = false;
};

document.getElementById("restartBtn").onclick = () => {
    location.reload();
};
function ShowScores() {
    let scores = JSON.parse(sessionStorage.getItem("scores")) || [];      //dohvati rezultate
    let html = "<b>Scores:</b><br>";
    scores.forEach(s => {                    //prolazi kroz svaki element niza
        html += s.name + ":" + s.score + "<br>";
    });
    document.getElementById("scoreList").innerHTML = html;
}
ShowScores();