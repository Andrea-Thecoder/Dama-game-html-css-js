import {HTMLcostructor} from "./classi.js"
import { OtherSaveEvent } from "./drag-drop.function.js"



window.onload = () => {
    let costruzione = new HTMLcostructor()
    costruzione.playerSetup()
    costruzione.loadingGame()
    OtherSaveEvent()

}







