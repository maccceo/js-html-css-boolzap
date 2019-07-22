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
	var messageInHTML = $(".template .rcol__chat__message").clone();
	// gli inserisco il messaggio acquisito
	messageInHTML.text(message);

	// aggiungo il messaggio pronto in HTML alla chat
	$("#rcol__chat").append(messageInHTML);	
}

$(document).keypress(function(e) {
  if(e.which == 13) {
    // enter pressed
  }
});