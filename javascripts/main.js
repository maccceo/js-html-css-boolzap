$(document).ready(function() {

	// INVIO MESSAGGIO
	
	// al click del tasto Spedisci
	$(".fa-paper-plane").click(sendMessage);
	// alla pressione del tasto invio
	$("#rcol__chat-input__textinput").keypress(function(event) {
		if(event.which == 13) {
			sendMessage();
		}
	});
});




function sendMessage() {
	var textInput = $("#rcol__chat-input__textinput");
	
	// acquisisco contenuto text input e lo svuoto
	var message = textInput.val();
	textInput.val("");

	// vado a prendere il template di aggiunta messaggi
	var messageInHTML = $(".template .user").clone();
	// gli inserisco il messaggio acquisito
	messageInHTML.text(message);

	// aggiungo il messaggio pronto in HTML alla chat
	$("#rcol__chat").append(messageInHTML);	

	// avvio la funzione di risposta al messaggio
	replyMessage();
}

function replyMessage() {
	var lastAccessText = $(".navbar__user-info__lastaccess");

	// backup ultimo accesso e sovrascrivo con Sta scrivendo
	var lastAccessTextBackup = lastAccessText.text();
	lastAccessText.text("Sta scrivendo ...");

	setTimeout(function() {
		// template visualizzazione messaggio ricevuto
		var replyMessage = $(".template .other").clone();
		// aggiungo contenuto messaggio
		replyMessage.text("Ok");
		// visualizzo il messaggio
		$("#rcol__chat").append(replyMessage);	

		// ritorno a visualizzare l'ultimo accesso
		lastAccessText.text(lastAccessTextBackup);
	}, 1000);
	
}