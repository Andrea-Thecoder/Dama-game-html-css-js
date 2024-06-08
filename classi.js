import {DragOverStop,Dragging, turno, disabledDropZone, turnLoad} from "./drag-drop.function.js"
import {victoryToken} from "./function.js"



// #region const/let zone
export let pWhite=[], pBlack = [], players = [];
let time = 600;
let load=false

// #endregion const/let zone 



export class Token {
    constructor(colore,id){
        this.color = colore;
        this.id = id 
    }

}

export class HTMLcostructor  {
    constructor(){
        this.body = document.querySelector("body")
    }

    creaGriglia(){
    document.querySelector(".containerStart").remove()
    this.body.classList.replace("bg-body-start","bg-body-chess")
    this.body.innerHTML=`<main>
    <div class="wrapper">
        <div id="timer">TIMER</div>
        <div class="pedineMangiate uno">
            <section>
                <h3 id="player-one">Giocatore 1</h3>
                <div id="C-1"></div>
            </section>
        </div>
        <div class="containerChessboard">
        </div>
        <div class="pedineMangiate due">
            <section>
                <div id="C-2"></div>
                <h3 id="player-two">Giocatore 2</h3>
            </section>
        </div>
</main>`
    let chessboard= document.querySelector(".containerChessboard")
    let cont = 1
    let str =""
    str=`<div class="chessboard">`
    for (let i=1; i<9;i++){

        for (let j=1;j<9;j++){
            str += `<div id="D-${i}-${j}" class="square ${cont % 2 == 0 ? "black" : "white"}"> </div>`
            cont++
        }
    cont++
    }
    str += `</div>`
    chessboard.innerHTML += str
    this.StartPedina()
}

    StartPedina(){
        document.querySelectorAll("div.square.black").forEach((cella,index) => {
            /* console.log(cella.id.split("-")) */
            switch(load){
                case false:
                if(cella.id.split("-")[1] <=3) {
                    pWhite.push(new Token("white",`white-${index}`))
                cella.innerHTML+=`<img draggable="true" src="../pic/whitetoken.webp" alt="pedina-${pWhite[0].color}" id="${pWhite[0].color}-${index}">`
                } //chiude if
                if(cella.id.split("-")[1] >=6) {
                    pBlack.push(new Token("black",`black-${index -8}`))
                    cella.innerHTML+=`<img draggable="true" src="../pic/blacktoken.webp" alt="pedina-${pBlack[0].color}" id="${pBlack[0].color}-${index - 8}">`
                }//chiude if
                break;
                case true:
                    const divblack = JSON.parse(localStorage.getItem("tokenposition"))
                    divblack.forEach( div => {
                        if (cella.id === div.id) cella.innerHTML= div.html
                    }) //chiudi 
                 /*console.log(cella) */
                break;
                }//chiude switch 
            })// chiusura ciclo foreach
            if (!load){ 
                players.forEach(player => {
                player.color == "white" ? player.token = pWhite : player.token = pBlack
            })//chiude secondo ciclo for
            } //chiude if
        
        /* console.log(pBlack) */
    }

    playerSetup(){
        document.querySelector("#start").addEventListener("click",() => {
            if(!load){
                const player1 = document.querySelector("#player-1")
                const player2 = document.querySelector("#player-2")
                if (player1.value.trim().length == 0 || player2.value.trim().length == 0) {
                    alert("Inserire nomi dei giocatori!") 
                    return
                }
                players.push(new Player(player1.value.trim(),player1.id.split("-")[1]))
                players.push(new Player(player2.value.trim(),player2.id.split("-")[1]))
          
            this.creaGriglia()
            this.startGame()
            new Player().takeTurn()  
            }
        })
    }

    loadingGame(){
        document.querySelector("#loading").addEventListener("click",()=> {
            if (JSON.parse(localStorage.getItem("playerstatus")).length == 0 || JSON.parse(localStorage.getItem("tokenposition")).length == 0){ return}
            load=true
            players = JSON.parse(localStorage.getItem("playerstatus"))
            const trova = players.find (trova => trova.turn == true)
            /* console.log(trova.color) */
            this.creaGriglia()
            this.startGame()
            turnLoad()
            new Player().takeTurn()
        })
    }

    startGame(){
        document.querySelector("#timer").innerHTML=""
        document.querySelector("#player-one").innerHTML=players[0].player
        document.querySelector("#player-two").innerHTML=players[1].player
        if (load) {time=parseInt(localStorage.getItem("timer"))}
        const timer= setInterval(() => {
            time--
        localStorage.setItem("timer",JSON.stringify(time))
        /* console.log(victoryToken) */
        if(victoryToken) clearInterval(timer)
        const minuti = Math.floor(time / 60)
        const secondi = time % 60
        this.headerHTMLSetup(minuti,secondi)
        if (time <=  0 ) {
                alert("Tempo scaduto! La partita termina in un Pareggio")
                clearInterval(timer)
            
            }
        },1000)
    }

    headerHTMLSetup(min,sec) {
       let timerZone= document.querySelector("#timer")
       if (timerZone == null || timerZone == undefined) return
       timerZone.innerHTML=""
       let str = ` <p> ${min} : ${sec} </p>`
       timerZone.innerHTML = str
    }
}


export class Player {

    static randomColor; 

    constructor(name,id){
        this.player = name
        this.id = id
        this.color = this.assignColor()
        this.turn =  this.color=="white" ? true : false
        this.token =[]
    }
    assignColor(){
        let random = Math.round(Math.random())
       /*  console.log(random,Player.randomColor) */
        if (Player.randomColor != undefined) {
            /* console.log("primo if no undefined") */
            if (random === Player.randomColor) {
                /* console.log("secondo if le botte") */
                random === 0 ? random = 1 : random =0  
            }
        } else { 
            /* console.log("else quindi undefined")*/ 
            Player.randomColor = random 
        }
       return random == "1" ? "white" : "black"

    }
    takeTurn(){
        let p1=document.querySelector("#player-one")
        let p2=document.querySelector("#player-two")
            switch(turno){
                case false:
                    turnOver("white","black")
                    players.forEach ( 
                        (player,index) => {
                        if (player.color=="white"){
                            index==0 ? p1.classList.add("turnColor") : p2.classList.add("turnColor")
                        } else {
                            index==0 ? p1.classList.remove("turnColor") : p2.classList.remove("turnColor")
                        }
                    })
                break;
                case true:
                    turnOver("black","white")
                    players.forEach ( 
                        (player,index) => {
                        if (player.color=="black"){
                            index==0 ? p1.classList.add("turnColor") : p2.classList.add("turnColor")
                        } else {
                            index==0 ? p1.classList.remove("turnColor") : p2.classList.remove("turnColor")
                        }
                    })
                break;
            } // chiude switch
    }
}



//la seguente funzione serve per far si che durante il turno di uno dei due colori l'altro non possa effettuare nessuna mossa. going è il parametro di ingresso per il colore che detiene il turno, notGoing del suo avversario, accettano stringhe in cui viene scritto il loro colore.
function turnOver(going,notGoing) {
    document.querySelectorAll(`div > img[alt='pedina-${going}'`).forEach(element =>  {
        element.addEventListener("dragstart",Dragging)
        element.addEventListener("dragover",DragOverStop)
        element.addEventListener("dragend",disabledDropZone)
    })
    document.querySelectorAll(`div > img[alt='pedina-${notGoing}'`).forEach(element =>  {
        element.removeEventListener("dragstart",Dragging)
        element.removeEventListener("dragover",DragOverStop)
        element.removeEventListener("dragend",disabledDropZone)
    })
    if (going =="white") {
        players[0].turn=true
        players[1].turn = false
        } else{
            players[0].turn=false 
            players[1].turn = true  
        }
}
