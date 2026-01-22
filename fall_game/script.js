var character=document.getElementById("character");     
var game=document.getElementById("game");                
var counter=0;          //brojač blokova i za score
var interval;           //interval za kretanje
var both=0;             //provjera istovremenog pritiska
var currentBlocks=[]; 
var isPaused=true;
var playerName="";

function moveLeft(){
    var left=
    parseInt(window.getComputedStyle(character).getPropertyValue("left"));      //dohvati trenutnu poziciju
if(left>0){
        character.style.left=left-2+"px";}

}
function moveRight(){
    var left=
    parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        if(left<380){
            character.style.left=left+2+"px";}
}
//kontrola kretanja
document.addEventListener("keydown",event=>{
    if(isPaused)return;

    if(both==0){
        both++;
    }
    if(event.key==="ArrowLeft"){
        interval=setInterval(moveLeft,1);
    }
    if(event.key==="ArrowRight"){
        interval=setInterval(moveRight,1);}
});

document.addEventListener("keyup",event=>{  //zaustavljanje kretanja
    clearInterval(interval);
    both=0;
});

//glavni game loop
var blocks=setInterval(function(){

if(isPaused)return;

var blockLast =document.getElementById("block"+(counter-1));    //dohvati zadnji blok
var holeLast =document.getElementById("hole"+(counter-1));

if(counter>0){
 var blockLastTop=
    parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));   //dohvati njegovu poziciju
 var holeLastTop=
    parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
}

if(counter==0 || blockLastTop<400){

var block =document.createElement("div");   //kreiraj nove elemente
var hole =document.createElement("div");
block.setAttribute("class","block");
hole.setAttribute("class","hole");
block.setAttribute("id","block"+counter);
hole.setAttribute("id","hole"+counter);

block.style.top=(counter==0 ? 100 : blockLastTop + 100)+"px";
hole.style.top=(counter==0 ? 100 : holeLastTop + 100)+"px";
var random=Math.floor(Math.random()*360);

hole.style.left=random + "px";      //postavi rupu na random poziciju
game.appendChild(block);
game.appendChild(hole);
currentBlocks.push(counter);
counter++;
}

var characterTop=
     parseInt(window.getComputedStyle(character).getPropertyValue("top"));
var characterLeft=
     parseInt(window.getComputedStyle(character).getPropertyValue("left"));
var isFalling=true;

//game over provjera
if (characterTop<=0){
    let score=counter-9;
    let scores=JSON.parse(localStorage.getItem("scores"))||[];  //dohvati postojece rezultate
    scores.push({       //dodaj novi rez
        name:playerName,
        score:score
    });
    localStorage.setItem("scores",JSON.stringify(scores));      //spremi nazad
    alert(
       " Gameover!\n"+"Player:"+playerName+"\n"+"Score:"+score
    );
    clearInterval(blocks);
    location.reload();
}

for(var i=0;i<currentBlocks.length;i++){
    let current=currentBlocks[i];
    let iblock =document.getElementById("block"+current);
    let ihole =document.getElementById("hole"+current);
    let iblockTop= parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));

    iblock.style.top=iblockTop-0.5+"px";    //pomakni blokove i rupe dolje
    ihole.style.top=iblockTop-0.5+"px";
         if(iblockTop<-20){
            currentBlocks.splice(i,1);      //ukloni blok iz niza ako je izvan ekrana
            i--;
            iblock.remove();
            ihole.remove();
    }
    //provjera sudara
    if(characterTop+20>=iblockTop && characterTop + 20 <= iblockTop +20){
       isFalling=false;
        let iholeLeft=
        parseInt(window.getComputedStyle(ihole).getPropertyValue("left"));
    if(characterLeft>=iholeLeft && characterLeft+20 <= iholeLeft+40){
        isFalling=true;
    }
}
}
//gravitacija
if(isFalling){
    if(characterTop<480){
    character.style.top=characterTop+2+"px";
    }
}
else{
    character.style.top=characterTop-0.5+"px";    
}

},1);

document.getElementById("startBtn").addEventListener("click",()=>{
    playerName=prompt("Upiši svoje ime:");
    if(!playerName) playerName="Anonimno"
    isPaused=false;
    document.getElementById("startOverlay").style.display="none";
});

document.getElementById("resumeBtn").addEventListener("click",()=>{
    isPaused=false;
});
document.getElementById("pauseBtn").addEventListener("click",()=>{
    isPaused=true;
});
document.getElementById("restartBtn").addEventListener("click",()=>{
    location.reload();
});
function ShowScores(){
    let scores=JSON.parse(localStorage.getItem("scores"))||[];      //dohvati rezultate
    let html="<b>Scores:</b><br>";
    scores.forEach(s => {                    //prolazi kroz svaki element niza
        html+=s.name +":"+ s.score+"<br>";
    });
    document.getElementById("scoreList").innerHTML=html;
}
ShowScores();