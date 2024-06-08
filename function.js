import { firework } from "./fireworks.js"
export let victoryToken = false

const audio = new Audio("./assets/victory.mp3")

export function salvaPartita(players,innerdiv,turno){
    let divblack = Array.from(innerdiv).map(div => {
        return { html: div.innerHTML, id: div.id }})
    localStorage.setItem("playerstatus",JSON.stringify(players)) //tiene traccia dei giocatori e tra le varie delle loro pedine
    localStorage.setItem("tokenposition",JSON.stringify(divblack)) //necesario per riposizionare le pedine nell'ordine lasciato.
    localStorage.setItem("turno",JSON.stringify(turno)) //tiene traccia del turno!
}


export function noToken(players){
        let loser = players.find(player => player.token.length == 0 )
        let winner = players.find(player => player.token.length > 0)
        if(loser != undefined || loser != null) {
            /* console.log(victoryToken) */
           victoryToken=true /* 
           console.log(victoryToken) */
           victoryMessage(winner)
        }
}

export function victoryMessage(winner){
    audio.play()
    audio.loop = true
    audio.volume= 0.2
    let body = document.querySelector("body")
    firework() 
    body.classList.replace("bg-body-chess","bg-black")
    body.innerHTML=""
    body.innerHTML= `
    <div class="vittoria">
    <h2>Il vincitore è ..</h2>
    <img src="https://cdn-0.emojis.wiki/emoji-pics/apple/crown-apple.png" alt="corona della vittoria">
    <span>${winner.player}</span>
    <button type="button" id="restart" >Inizia un'altra partita</button>
    </div>`
    restarter()
}

function restarter(){
    document.querySelector("#restart").addEventListener("click",() =>{
        localStorage.removeItem("timer")
        localStorage.removeItem("turno")
        localStorage.removeItem("playerstatus")
        localStorage.removeItem("tokenposition")
        location.reload()
    })
}






