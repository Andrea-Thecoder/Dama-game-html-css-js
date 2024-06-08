import { salvaPartita, noToken, victoryMessage } from "./function.js"
import { Player, players} from "./classi.js"
let data ="", positionSX ="", positionDX="", colorGlobal=""
let dropAudio = new Audio("./assets/drop.wav")
export let turno = false


//questa funzione viene creeasta per essere poi eseguita nel file app.js. qui dentro effettuerà i lsalvataggio prima dell'eventuale chiusura/reflesh della pagina
export function OtherSaveEvent(){
window.onunload = () => salvaPartita(players,document.querySelectorAll("div.square.black"),turno)
}


//in quanto le variabili importate vengono considerate di sola lettura (const) ho dovuto creare una funzione per bypassare questo blocco di sistema
export function turnLoad(){
    turno = JSON.parse(localStorage.getItem("turno"))
}



//funzione per il drop. Semplicemente appende come figlio il  dato caricato durante la fase del drag, nel nostro caso i ltag img.
export function Dropping(e){
    e.preventDefault()
    let data1=e.dataTransfer.getData("text/html")
    /* console.log(data,e.target) */
    this.appendChild(data)
    disabledDropZone()
    dropAudio.play()
    /* console.log(data.parentNode.id.split("-")[1]) */
    if (victoryCheck(data.parentNode.id.split("-")[1],data.id.split("-")[0])) {victoryMessage(data.parentNode.id.split("-")[1] == "1" ? players.find(player => player.color == "black") : players.find(player => player.color == "white") )}
    if (positionSX !="" || positionDX !="") {
        if (e.target == positionSX ) {
            eatToken(positionSX,"SX") 
        }
        if (e.target == positionDX) {
            eatToken(positionDX,"DX")
        }
    }
    positionSX=""
    positionDX=""
    colorGlobal=""
    turno = !turno
    new Player().takeTurn()
    salvaPartita(players,document.querySelectorAll("div.square.black"),turno)
    data=""
    noToken(players)
    
}


export function disabledDropZone(){
    document.querySelectorAll("div.square.black").forEach(element => {
        element.removeEventListener("dragover",DragOverStop)
        element.removeEventListener("drop",Dropping)    
        element.classList.remove("valid")
        element.classList.remove("no-valid","eat")
    }) //quest'evento serve per disattivare la dropzone della cella che abbiamo usato per droppare l'immagine.
}
//funzione per il drag. Prende come dato il tag targettato, in questo caso il tag img. Da notare che per il corretto funzionamento bisogna mettere la variabile data in globale e non in locale.

export function Dragging(e){
    data= e.target
    e.target.addEventListener("dragend",() => this.classList.remove("valid"))
    allowedSquare(e.target)
    /* console.log (e.clientX, e.clientY)
    console.log(e.target.getBoundingClientRect()) */ //return informazioni di coordinazione
    e.dataTransfer.setData("text*html",data)
    e.dataTransfer.effectAllowed = "move";


}


//funzione necessaria per prevenire il comportamento dei browser di default quando si sta in drop over.
export function DragOverStop(e){
    e.preventDefault()
}


//necessità dei casi particolari: 
// Abbiamo appurato l'esigenza di effettuare una serie di controlli a lfine del corretto funzionamento della Dama. Dato questo fino il primo dei controlli da fare è il far capire quale siano le caselle di drop interessate dal drag.  

function allowedSquare(token){
    let id1="" , id2=""
    let square1="", square2=""
    let tokenColor=token.id.split("-")[0]
    let idArray=token.parentNode.id.split("-") //spacchetto l'id del genitore padre dove si trova la pedina per estrapolare le informazioni delle coordinate.

    //i seguenti id1 e 2 ricostruiscono l'id delle caselle frontali diagonali della pedina che dovra muoversi.
    //il seguente controllo  viene effettuasto per verificare se la pedina da muvoere sia del giocatore del bianco o del nero e quindi applicare le giuste coordinate.
    if(tokenColor ==="black"){
        id1= idCompile(parseInt(idArray[1]) - 1,parseInt(idArray[2]) - 1)
        id2= idCompile(parseInt(idArray[1]) - 1,parseInt(idArray[2]) + 1)
    } else {
        id1= idCompile(parseInt(idArray[1]) + 1,parseInt(idArray[2]) - 1)
        id2= idCompile(parseInt(idArray[1]) + 1,parseInt(idArray[2]) + 1)  
    }
   /*  console.log(id1,id2) */
    //blocco di controllo per i bordi scacchiera
    if (id1 === false && id2 === false ) return
    if (id1 === false) { 
        square2= document.querySelector(id2)
        ConflictTokenType(square2,tokenColor,2)
    } else {
        if (id2 === false) { 
            square1= document.querySelector(id1)
            ConflictTokenType(square1,tokenColor,1)

        } else {
            square1= document.querySelector(id1),
            square2= document.querySelector(id2);
            ConflictTokenType(square1,tokenColor,1)
            ConflictTokenType(square2,tokenColor,2)
        }
    }
}

//funzione per la compilazione dell ID in stringa, in modo da poterlo usare per i queryselector etc.
function idCompile(coord1,coord2){
    if (coord1 ===0 || coord1 === 9) return false
    if (coord2 === 0 || coord2 === 9) return false 
    return `#D-${coord1}-${coord2}`
}

//La seguente funzione identifica se la cella adiacente sia libera od occupata, in quest'ultimo caso se è occupata da pedina amica o nemica, e quindi attiverà le celle ove è possibile muoversi

function ConflictTokenType(cell,color,position) { 
    let result=""
    result = cellIdentification(cell,color)

    switch(result){
        case true: //in questo case il movimentodella pedina è libero, in quanto non ci sono pedine nelle caselle adiacenti.
        position == 1 ?
        positionSX= "" :
        positionDX= "" 
            cell.addEventListener("drop",Dropping)
            cell.addEventListener("dragover",DragOverStop)  
        break;

        case false:  //in questo case il movimento della pedina è impossibile.
            position == 1 ?
                positionSX= "" :
                positionDX= "" 
            /* console.log("Movimento impossibile!") */
        return

        default: //in questo case è stata trovata una pedina nemica adiacente, quindi effettuerà dei controlli per verificare se la cella successiva, diagonalmente, a quella stuiata sia libera ed in caso affermativo allora potrà mangiare. La funzione di mangiare deve essere eseguita nella dropzone.
        /* console.log("situazione del mangia") */
        cell.classList.add("no-valid")
        let nextId =""
        nextId= nextIdentification(result,color,position)
        if (nextId == false ) return
        let nextCell= document.querySelector(nextId)
        if (cellIdentification(nextCell,color) === true) {
            nextCell.addEventListener("drop",Dropping)
            nextCell.addEventListener("dragover",DragOverStop)
            nextCell.classList.add("valid")
            position == 1 ?
                positionSX= nextCell :
                positionDX= nextCell 
            colorGlobal= color
            cell.classList.add("eat")
            
        }
        break
    }
    
    
}

// funzione per identificare la cella successiva  aquella dove è presente la pedina nemica. una notazione sul position: questo parametro accetta un valore di 1 o 2, in base a quale cella stiamo andando ad esaminare. L'idea di base è che dato un piano cartesiano l'asse delle X è la position che va a SX quando ha valore 1 ed a DX quando ha valore 2. In questo modo posso dividere esattamente in 2 la zona di controllo (sinistra=position:1, destra=position:2) e procedere con l'identificazione. Cosi facendo questa funziona resta generica e valida per tutte e 4 le dirizioni di controllo(valiutando anche il colore della pedina). Lascio in fondo un "disegno" dell'idea del piano cartesiano (Pic 1.1)
function nextIdentification(result,color,position){
    let idArray= result
    let id =""
   /*  console.log(idArray,color,position) */
    switch(color.toLowerCase()){
        case "black":
            if(position == 1){
                if (((idArray[1]) - 1) === 0 || (parseInt(idArray[2]) - 1) === 0) return false
                id= idCompile(parseInt(idArray[1]) - 1,parseInt(idArray[2]) - 1)
            } else {
                if (((idArray[1]) - 1) === 0 || (parseInt(idArray[2]) + 1) === 9) return false
                id= idCompile(parseInt(idArray[1]) - 1,parseInt(idArray[2]) + 1)
            }
        return id
        case "white":
            if (position == 1) {
                if ((parseInt(idArray[1]) + 1) === 9 || (parseInt(idArray[2]) - 1) === 0 ) return false
                id= idCompile(parseInt(idArray[1]) + 1,parseInt(idArray[2]) - 1)
            } else {
                if ((parseInt(idArray[1]) + 1) === 9 || (parseInt(idArray[2]) + 1) === 9 ) return false
                id= idCompile(parseInt(idArray[1]) + 1,parseInt(idArray[2]) + 1)
            }
            /* console.log(id) */
        return id
    }


}

function cellIdentification(cell,color){
   /*  console.log(cell.children) */
   if (cell == null || cell == undefined) {
    /*console.log("evocation"); */ 
    return
    }
    if (cell.children.length != 0){   
        if(cell.children[0].id.split("-")[0] === color){
            cell.classList.add("no-valid")
            /* console.log("Stesso colore nei token no move") */
            return false //pedine adiacenti uguali = movimento impossibile.
        }
        else {
           /*  console.log("Colore differente, rilascia id ") */
            return cell.id.split("-") //valutazione mangiare
        }
    } else {
        /* console.log("campo libero") */
        cell.classList.add("valid")
        return true} //nessun ostacolo, movimento accettato.
}


function eatToken(where,position) {
    if (where.id == undefined || where =="" || where.id == null) return
    let divToken=""
    switch(colorGlobal){
        case "white":
            if (position == "SX"){
                divToken=idCompile(parseInt(where.id.split("-")[1])-1,parseInt(where.id.split("-")[2])+1)
            } else {
                divToken=idCompile(parseInt(where.id.split("-")[1])-1,parseInt(where.id.split("-")[2])-1)
            }
        break
        case "black":
            if (position == "SX"){
                divToken=idCompile(parseInt(where.id.split("-")[1])+1,parseInt(where.id.split("-")[2])+1)
            } else {
                divToken=idCompile(parseInt(where.id.split("-")[1])+1,parseInt(where.id.split("-")[2])-1)
            }

    }
    let eatCoordination=document.querySelector(divToken)
    let idToken=eatCoordination.children[0].id
    players.forEach(player => {
        player.token.forEach((token,index) => {
            if (token.id == idToken) {
                let idHtml=`#C-${player.id}`
                player.token.splice(index,1)
                document.querySelector(idHtml).innerHTML+=`
                <span class="deathToken ${idToken.split("-")[0]}"></span>`
            }
        })//chiude foreach
    })//chiude foreach esterno
    /* console.log(idToken,players) */
    eatCoordination.innerHTML=""
}

function victoryCheck(dropPosition,color){
    switch (color){
        case "black":
            if (dropPosition == "1") return true 
        break;
        case "white":
            if (dropPosition == "8") return true
    }

}



/* Pic 1.1 : piano cartesiano per comprensione della funzione che identifichi la cella successiva a quella dove si trovi una pedina nemica:
Asse X = position (sx = 1, dx = 2)
Asse Y = color (alto = black, basso = white)
O = cella di inizio controllo.
*= cella adiacente a quella dove stiamo controllando.

                             black
                               ^
                               |
                      -1/-1    |      -1/+1
                        *      |        *
                               |
                               |
-------------------------------O------------------------------>
1                              |                              2
                               |
                        *      |        *
                      +1/-1    |       +1/+1
                               |
                             white


nell'esempio soprastante posiamo notare come per una pedina black che deve muoversi verso l'alto (quindi disposta sull'asse Y verso i valori positivi) essa si muoverà sempre di un valore -1 per quanto riguarda l'asse Y (deve salire quindi valore negarivo) mentre in base alla sua position, il valore della X varierà di +/-1. 
Nota: i valori che trovate sopra i punti(*) nel grafico sono invertiti, ovvero il primo identifica asse Y il secondo l'asse X.
Nota2: ricordo che questo piano a 4 scelte col position vale unicamente per la ricerca della successiva cella quando si incontra una cella occupata da una pedina avversaria. PEr il movimento normale (ovvero identificare le 2 celle adiacenti dalla posizione di partenza) si può usare un ragionamento simile ma senza i position ed usando solo i quadranti interessati dal ocolore (1-2 per black 3-4 per white)
*/