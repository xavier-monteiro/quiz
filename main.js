var h1Pergunta = document.getElementById("pergunta");
var h1Categoria = document.getElementById("categoria");

var certas=document.getElementById("certas");
var resul=document.getElementById("resultado")

var btnResposta1 = document.getElementById("resposta1");
var btnResposta2 = document.getElementById("resposta2");
var btnResposta3 = document.getElementById("resposta3");
var btnResposta4 = document.getElementById("resposta4");

var btnComecar = document.getElementById("comecar");

btnComecar.addEventListener("click",chamarAPI);

var respostaAPI;
var contar =0;
var respostascertas=0

var arrayTodasRespostas = [];
var arrayTeste = [];
var arrayBtnTeste = [btnResposta1,btnResposta2,btnResposta3,btnResposta4];

//Variavel para verificar se o jogo ja começou (default false)
var GamaHasStarted = false;

var contarTempo;
var contarTimer;

var timer;

var btn5050 = document.getElementById("btn5050");

var CanUse = false;
var HasUsed = false;

function chamarAPI()
{
    //Background Music
    let bgMusic= document.createElement("audio");
    bgMusic.src ="bmusic.mp3";
    bgMusic.autoplay= true;
    bgMusic.volume = 0.2;


    chamarJogador()

    fetch("https://opentdb.com/api.php?amount=10")
    .then((response)=>{ return response.text()})
    .then((r) => {respostaAPI =JSON.parse(r); console.log(respostaAPI);novaPergunta()})

    //Fez o pedido e no fim invocou a funçao novaPergunta;
}

//FUNCAO PARA CHAMAR JOGADOR
function chamarJogador()
{
    //input em html
    var nome=document.getElementById("nome").value

    if(nome=="")
    {
        document.getElementById("texto").innerHTML = "Player";
    }
    else
    {
        document.getElementById("texto").innerHTML = nome;
    }
    
}




btnResposta1.addEventListener("click", respostaUtilizador);
btnResposta2.addEventListener("click", respostaUtilizador);
btnResposta3.addEventListener("click", respostaUtilizador);
btnResposta4.addEventListener("click", respostaUtilizador);

function respostaUtilizador(event)
{

    if(GamaHasStarted==false)
    return console.log("game not started");

    switch (event.target.id) {
        case "resposta1":
            validarResposta(event.target.innerHTML);
            break;
        case "resposta2":
            validarResposta(event.target.innerHTML);
            break;
        case "resposta3":
            validarResposta(event.target.innerHTML);
            break;
        case "resposta4":
            validarResposta(event.target.innerHTML);
                break;

        default:
            break;
    }
}

//Funcao para validar a Resposta
function validarResposta(resposta)
{
    console.log("Resposta: "+resposta);
    //Resetar o Timer
    clearInterval(contarTempo);
    contarTimer=16;

    //Se a resposta for a correta
    if(resposta==respostaAPI.results[contar].correct_answer)
    {
        //Aqui que vai-se adicionar os pontos
        console.log("acertou");
        //Pedi 10 perguntas passa para a proxima
        contar++;
        //Conta as respostas certas
        respostascertas++
        certas.innerText="Pontuação: " + respostascertas 

        //Som de acertou
        let correctSound= document.createElement("audio");
        correctSound.src ="correct.mp3";
        correctSound.autoplay= true;
        correctSound.volume = 0.5;

        novaPergunta();
    }
    else 
    {
          //Pedi 10 perguntas passa para a proxima
        contar++;

        console.log("errou");

        //Som de errou
        let incorrectSound= document.createElement("audio");
        incorrectSound.src ="incorrect.mp3";
        incorrectSound.autoplay= true;
        incorrectSound.volume = 0.5;


        novaPergunta();
    }
}


function novaPergunta()
{
    //Se nao houver mais perguntas
    if(contar>=10)
    {
        jogoAcabou();
        
        return console.log("jogo acabou, de reset á pagina");
    }

    

//Voltar a por o display do 3 e 4 botao pk eles desaparecem se a pergunta é de verdadeiro e falso

    for(var i=0;i<4;i++)
    {
        if(arrayBtnTeste[i].style.display=="none")
        {
            console.log("some were hidden");
            arrayBtnTeste[i].style.display="inline";
        }
    }

    //Atribuir a pergunta ao h1 especifico
    h1Pergunta.innerHTML = respostaAPI.results[contar].question;
    //Atribuir a categoria ao h1 especifico
    h1Categoria.innerHTML = respostaAPI.results[contar].category;


    //Se a pergunta for de verdadeiro e falso
    if(respostaAPI.results[contar].incorrect_answers[0]=="False" || respostaAPI.results[contar].incorrect_answers[0]=="True")
    {
        console.log("pergunta com resposta Verdadeiro ou Falso");
        CanUse = false;
        //Desaparece o 3 e 4 butao
        btnResposta3.style.display ="none";
        btnResposta4.style.display ="none";

        //Adiciona ao array com Todas as respostas para aquela pergunta(as incorretas+corretas)
        arrayTodasRespostas.push(respostaAPI.results[contar].incorrect_answers);
        arrayTodasRespostas.push(respostaAPI.results[contar].correct_answer);
    }
    else 
    {
        CanUse = true;
        //Faz o mesmo do de cima mas como tem mais respostas fiz um for
        for(var i =0;i<respostaAPI.results[contar].incorrect_answers.length;i++)
        {
        arrayTodasRespostas.push(respostaAPI.results[contar].incorrect_answers[i])
        }

    arrayTodasRespostas.push(respostaAPI.results[contar].correct_answer);

    console.log(arrayTodasRespostas);

    }
    arrayTeste = arrayTodasRespostas;
    
    //Isto faz o shuffle das respostas
    for(var i=0;i<arrayBtnTeste.length;i++)
    {
        //Random numero entre 0 e array.length(no inicio vai de 0-4 mas vai diminuir pk eu removo do array)
        let numero = Math.floor(Math.random() * arrayTodasRespostas.length);

        //O butao i (neste momento o 1(na posicao 0 fica o primeiro butao eu declarei em cima de todo)) fica com a pergunta duma posicao random do array de respostas
        arrayBtnTeste[i].innerHTML = arrayTodasRespostas[numero];

        //Remove a resposta do array
        arrayTodasRespostas.splice(numero,1);
    }

    //O jogo começou
    GamaHasStarted = true;

    
    contarTimer =16;
    contarTempo=setInterval(()=>{
        console.log("do some1");
        contarTimer--;
        timer.innerHTML="Tempo restante: "+contarTimer;
        if(contarTimer==0)
        {
            console.log("time is over");
            contar++;
            clearInterval(contarTempo);
            novaPergunta();
            
        }
    },1000);
   
}

btn5050.addEventListener("click",()=>{


    console.log("50/50 clicked");
    //Se ja clickou no botao antes agr é inutil pk eu pus o botao invisivel
    if(HasUsed==true)
    return console.log("already used");



    if(CanUse==true)
    {
        console.log("canUse");
        let  arrayTeste2 = arrayBtnTeste;
        let position;
        for(var i=0;i<arrayBtnTeste.length;i++)
        {
            //Saber em que botao esta a resposta correta
            if(arrayTeste2[i].innerHTML==respostaAPI.results[contar].correct_answer)
            {
                position=i;
            
            }
            
            
        }   
        //Retirar do array de botoes o botao com a resposta correta    
        arrayTeste2.splice(position,1);                     
        let numero = Math.floor(Math.random() * arrayTeste2.length);
        //Retirar do array uma resposta errada aleatoria

        arrayTeste2.splice(numero,1);

        //As 2 erradas que ficaram no array desaparecem
         arrayTeste2[0].style.display="none";
         arrayTeste2[1].style.display="none";    
        
        HasUsed=true;
        btn5050.style.display="none";

        //Isto tinha dado um bug entao voltei a adicionar td ao array "original"
        arrayBtnTeste = [btnResposta1,btnResposta2,btnResposta3,btnResposta4];
    }else
    {
        return console.log("cant use");
    }


});

var player;
var nomePlayer;

//Funcao quando o as perguntas acabam
function jogoAcabou()
{
    GamaHasStarted = false;
    contar =0;

    MudarFim()

    resul.innerText="O jogador " + nome.value + " acertou " + respostascertas + " respostas"
    player = new Player(nomePlayer,respostascertas*10);
    gravar(player);
}

//Funcao que muda de formulario (do form de nome do jogador para as perguntas)
function MudarForm() {
      timer = document.getElementById("timer");
    var x = document.getElementById("jogador");
    var y = document.getElementById("form");
    var txt = document.getElementById("nome");
    nomePlayer= txt.value;
    console.log("Nome player: "+nomePlayer);
    
    if (x.style.display === "none") {
      x.style.display = "block"
     
    } else {
      x.style.display = "none"
      y.style.display = "block"
      console.log("here");
  
      timer.display = "block";
      timer.innerHTML="Tempo restante: 15";
    }
  }

  //Funcao que muda de formulario (do form das perguntas para o resultado)
  function MudarFim() {
    var x = document.getElementById("form")
    var y = document.getElementById("fim")
    if (x.style.display === "none") {
      x.style.display = "block"
    } else {
      x.style.display = "none"
      y.style.display = "block"
    }

    
  }

  function Player(nome,pontos){
    this.nome = nome;
    this.pontos = pontos;
    this.natureza ="Player";
}

function gravar(player){
    var playerASerLido = (JSON.parse(localStorage.getItem(player.nome)));
    if(playerASerLido)
    {
        if(player.pontos>playerASerLido.pontos)
        {
            localStorage.setItem(player.nome, JSON.stringify(player))
        }else 
        return;
            
    }
    else 
    {
        localStorage.setItem(player.nome, JSON.stringify(player))
    }
    

    //Escrever um metodo para so gravar a melhor pontuação
}

var btnLeaderBoard = document.getElementById("leaderboard");
btnLeaderBoard.addEventListener("click",leitura);

function leitura(){

    var endForm = document.getElementById("fim");
    endForm.style.display = "none";

    var leaderboardDiv = document.getElementById("showLeaderBoard");
    leaderboardDiv.style.display = "block";



    var newArray = [];
    Object.keys(localStorage).forEach(function(key,index) {
        // key: the name of the object key
        // index: the ordinal position of the key within the object 
        console.log(key);
        var playerASerLido = (JSON.parse(localStorage.getItem(key)));

        var maiorScore = document.getElementById("bestP");
        var nome = document.getElementById("bestN");

        var scoreM = Number(maiorScore.innerHTML);
        console.log(scoreM);
        console.log(nome.innerHTML);

        if(playerASerLido.natureza == "Player"){

            console.log(playerASerLido);

            if(playerASerLido.nome=="")
            {
                localStorage.removeItem("");
            }

            if(playerASerLido.pontos>scoreM)
            {
                nome.innerHTML = playerASerLido.nome;
                maiorScore.innerHTML = playerASerLido.pontos;
            }else 
            {
                newArray.push(playerASerLido);
            }
          

           
        }
       

    });

    newArray = newArray.sort((a,b)=> b.pontos-a.pontos);
    newArray.forEach(element => {
        var table = document.getElementById("tabela");

        var newP = document.createElement("tr");
        
        var newNome = document.createElement("td");
        var newPontos = document.createElement("td");

        newNome.innerHTML = element.nome;
        newPontos.innerHTML = element.pontos;

        table.append(newP,newNome,newPontos);
    });
    
}

var respostaAPI2;
var btnNovaPergunta = document.getElementById("novaPergunta");
btnNovaPergunta.addEventListener("click",()=>{

   
    fetch("https://opentdb.com/api.php?amount=1")
    .then((response)=>{ return response.text()})
    .then((r) => {respostaAPI2 =JSON.parse(r); console.log(respostaAPI2); mudarPergunta()})

    btnNovaPergunta.style.display="none";
    

})


function mudarPergunta()
{
//Atribuir a pergunta ao h1 especifico
h1Pergunta.innerHTML = respostaAPI2.results[0].question;
//Atribuir a categoria ao h1 especifico
h1Categoria.innerHTML = respostaAPI2.results[0].category;


//Se a pergunta for de verdadeiro e falso
if(respostaAPI2.results[0].incorrect_answers[0]=="False" || respostaAPI2.results[0].incorrect_answers[0]=="True")
{
    console.log("pergunta com resposta Verdadeiro ou Falso");
    CanUse = false;
    //Desaparece o 3 e 4 butao
    btnResposta3.style.display ="none";
    btnResposta4.style.display ="none";

    //Adiciona ao array com Todas as respostas para aquela pergunta(as incorretas+corretas)
    arrayTodasRespostas.push(respostaAPI2.results[0].incorrect_answers);
    arrayTodasRespostas.push(respostaAPI2.results[0].correct_answer);
}
else 
{
    CanUse = true;
    //Faz o mesmo do de cima mas como tem mais respostas fiz um for
    for(var i =0;i<respostaAPI2.results[0].incorrect_answers.length;i++)
{
    arrayTodasRespostas.push(respostaAPI2.results[0].incorrect_answers[i])
}

arrayTodasRespostas.push(respostaAPI2.results[0].correct_answer);

console.log(arrayTodasRespostas);

}

arrayTeste = arrayTodasRespostas;

//Isto faz o shuffle das respostas
for(var i=0;i<arrayBtnTeste.length;i++)
{
    //Random numero entre 0 e array.length(no inicio vai de 0-4 mas vai diminuir pk eu removo do array)
    let numero = Math.floor(Math.random() * arrayTodasRespostas.length);

    //O butao i (neste momento o 1(na posicao 0 fica o primeiro butao eu declarei em cima de todo)) fica com a pergunta duma posicao random do array de respostas
    arrayBtnTeste[i].innerHTML = arrayTodasRespostas[numero];

    //Remove a resposta do array
    arrayTodasRespostas.splice(numero,1);
}

//O jogo começou
GamaHasStarted = true;


/*contarTimer =16;
contarTempo=setInterval(()=>{
    console.log("do some1");
    contarTimer--;
    timer.innerHTML="Tempo restante: "+contarTimer;
    if(contarTimer==0)
    {
        console.log("time is over");
        contar++;
        clearInterval(contarTempo);
        novaPergunta();
        
    }
},1000);*/


}