// AGGIUNGO IL LISTENER
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#avvio").addEventListener("click", inizio);
    
});


        let valori = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', ];
        let semi = ['b', 'c', 'd', 's'];

        function creaMazzo(){

            let mazzo = [];

            valori.forEach( (el) => {
                semi.forEach( (el2) => {
                    let immagine = document.createElement("img")
                    immagine.src = "img/" + el + el2 + ".png"
                    immagine.className = "card"
                    immagine.id = el + el2;
                    mazzo.push(immagine)
                })
            })

            return mazzo;

        }

class Mazzo{

    constructor(){
        this.carte = creaMazzo();
    }

    get getCarte(){
        return this.carte;
    }

    set setCarte(carte){
        this.carte = carte;
    }

    mischia(){
        this.carte.sort((a,b) =>  0.5 - Math.random())
    }

    distribuisci(){
        const carta = this.carte.pop() // prende l ultima carta e la cancella dal mazzo
        //const carta = this.carte.shift()   prende la prima carta e la cancella dal mazzo
       return carta;

    }

    
    }

    class Mano{
        carte;
        numeroPlayer;
        punteggio;

        constructor(numeroPlayer){
            this.carte = [];
            this.numeroPlayer = numeroPlayer;
            this.punteggio = [];
        }

        get getCarte(){
            return this.carte;
        }

        set setCarte(carte){
            this.carte=carte;
        }

        get getNumeroPlayer(){
            return this.numeroPlayer;
        }

        set setNumeroPlayer (numeroPlayer){
            this.numeroPlayer = numeroPlayer;
        }

        azzera (){
            this.carte=[];
        }

        aggiungiCarta(carta){
            this.carte.push(carta);
        }

        aggiungiCartaAlPunteggio(carta){
            this.punteggio.push(carta);
        }
    }


    let mazzo = new Mazzo();

    let player1 = new Mano(1);

    let player2 = new Mano(2);

    var banco = [];

    var turno = 1;

    var  conteggioCarteButtate = 0;


    function daiUnaSolaMano (player){
    
        // RIPETO FINO AD ARRIVARE A 3 CARTE
        for (var i = 0; i < 3; i++) {

            // PRELEVO CASUALMENTE LA POSIZIONE DI UNA CARTA
            var carta = mazzo.distribuisci();

            // AGGIUNGO LA CARTA al player
            player.aggiungiCarta(carta);

            // MOSTRO LE CARTE SUL piatto DEL GIOCATORE
            document.querySelector("#Player" + player.getNumeroPlayer).appendChild(carta);

        }
    }

    //metti 4 carte al centro del banco
    function daiCarteBanco(){

        if(banco.length == 0){

            let divBanco = document.getElementById('banco')

            for(let i=0 ; i < 4 ; i++){
                
                let cartaprova = mazzo.distribuisci();

                 banco.push(cartaprova);

                divBanco.appendChild(cartaprova);

            }
        }
        
    }

    function daiCarteMani (){

        daiUnaSolaMano(player1);

         daiUnaSolaMano(player2);
    }



    // QUESTA FUNZIONE VIENE RICHIAMATA OGNI VOLTA CHE VIENE CLICCATA UNA CARTA DA UN PIATTO
function cardClicked(event) {

    //prendere div in cui si trova l immagine che selezioniamo
    var div = event.target.parentNode
    //prendere id del div preso precedentemente
    var idDiv = div.id

    //prendere l ultima numero del id che sarebbe il numero del player che ha giocato
    let len = idDiv.length;
    numeroPlayer = idDiv.substring(len-1);


    //controllare se il player che vuole giocare è il suo turno
    if(turno == numeroPlayer){

        conteggioCarteButtate++;

        if(conteggioCarteButtate == 6){
            player1.azzera();
            player2.azzera();
            conteggioCarteButtate =0;
        }

        console.log(conteggioCarteButtate)

        
        //controllo se con la carta buttata possiamo prendere qualcosa
        if(!controllo(event.target)){

            //aggiungere carta cliccata al banco
            document.querySelector("#banco").appendChild(event.target)

            //aggiungere la carta ad un array banco solo se non prendiamo niente per poi fare una verifica in seguito
            banco.push(event.target);
        }

        // RIMUOVO IL LISTENER SULLA CARTA IN MODO CHE NON SIA PIÙ SPOSTABILE
        event.target.removeEventListener("click", cardClicked);
        turno ++

    }else{
        alert("non e il tuo turno")
    }

    // SE HO SUPERATO I due GIOCATORI RICOMINCIO IL GIRO
    if (turno > 2) {
        turno = 1;
    }

    if(mazzo.carte.length == 0 && player1.carte.length == 0){
        console.log("funziona")

        let h1 = document.createElement('h1')
        let divBanco2 = document.getElementById('banco')
        h1.appendChild(document.createTextNode(vincitore()));
        divBanco2.appendChild(h1);
    }

}



//controllare se nel banco possiamo prendere qualcosa
function controllo (cartaDaControllare){
   
    //trasforma la carta che buttiamo in array
    let cartaTransformata = transforma(cartaDaControllare);

    for(let i=0; i<banco.length; i++){

        //trasforma le carte del banco in array
       let cartaBanco = transforma(banco[i]);
       
       //verifica se la carta del banco è uguale alla carta che abbiamo buttato
        if(cartaTransformata[0] == cartaBanco[0]){

            //prendo il player che ha buttato la carta
            let divId = cartaDaControllare.parentNode.id
            let nPlayer = divId.substring(divId.length-1)

            if(nPlayer == 1){
                console.log("il giocatore 1 ha presso delle carte")
                player1.aggiungiCartaAlPunteggio(cartaTransformata);
                player1.aggiungiCartaAlPunteggio(cartaBanco);

            }else{
                console.log("il giocatore 2 ha presso delle carte")
                player2.aggiungiCartaAlPunteggio(cartaTransformata);
                player2.aggiungiCartaAlPunteggio(cartaBanco);
            }
            
            //eliminare carta buttata dal centro
            let cartaEliminare = document.getElementById(cartaDaControllare.id);
            cartaEliminare.remove();

            console.log("eliminata carta buttata")

            //elimina carta del banco
            let bancoElimina = document.getElementById(banco[i].id)
            bancoElimina.remove();

            //elimina carta dal array banco
            banco.splice(i, 1);

            console.log("eliminata carta banco")

            return true;
        }
    }
}

//trasforma id in valore e seme e metterli in un array
function transforma (immagine){
    let id = immagine.id;
    let valore = id.slice(0, -1);
    let seme = id.substr(-1);
    let carta = [valore, seme];
    return carta;
}


function vincitore(){
    let punteggioFinale1 = calcolaPunteggio(player1);
    let punteggioFinale2 = calcolaPunteggio(player2);

    if(punteggioFinale1 > punteggioFinale2){
        return "vince player 1";
    }if(punteggioFinale2 > punteggioFinale1){
        return "vince player 2";
    }else{
        return "la partita è finita in pareggio";
    }

}


function calcolaPunteggio (player){

    let conteggioPunteggio = 0;
    let conteggioSette =0;
    let conteggioCarte = player.punteggio.length
    let conteggioSetteBello = 0;
    let conteDenari = 0;

    for(let i=0; i<player.punteggio.length; i++){
        let punteggioplayer = player.punteggio;
        if(punteggioplayer[i][0] == 7){

            conteggioSette++;

            if(punteggioplayer[i][1] == 'd'){
                conteggioSetteBello = 1;
            }
        }

        if(punteggioplayer[i][1] == 'd'){
            conteDenari++
        }
    }

    if(conteggioSette >2){
        conteggioPunteggio++
    }

    if(conteggioCarte >20){
        conteggioPunteggio++
    }
    if(conteDenari>5){
        conteggioPunteggio++
    }
    if(conteggioSetteBello ==1){
        conteggioPunteggio++
    }

    console.log(conteggioPunteggio)
    return conteggioPunteggio;
}


function inizio(){

    mazzo.mischia();

    daiCarteBanco();   
    
    daiCarteMani();
    
    // RECUPERO TUTTE LE CARTE PRESENTI
    var cards = document.querySelectorAll(".card");

    // PER CIASCUNA CARTA AGGIUNGO UN EVENTO AL CLICK CHE RICHIAMA LA FUNZIONE cardClicked
    cards.forEach(function (item, index) {
        cards[index].addEventListener("click", cardClicked);
    });

}

    

