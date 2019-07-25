$(document).ready(function() {
	// ##INVIO MESSAGGIO
	// al click del tasto Spedisci
	$(".fa-paper-plane").click(sendMessage);

	// alla pressione del tasto invio (solo se c'è un messaggio da inviare)
	$("#rcol__chat-input__textinput").keyup(function(event) {
		if (event.which == 13 && $("#rcol__chat-input__textinput").val().length > 0) {
			sendMessage();
		}

		// switch icone mic/send quando c'è/non c'è testo
		else if (event.which != 13) {
			// c'è testo = invia messaggio on
			if ($("#rcol__chat-input__textinput").val().length > 0) {
				$("#rcol__chat-input__mic").hide();
				$("#rcol__chat-input__send").show();
			}
			// non c'è testo = microfono on
			else if ($("#rcol__chat-input__textinput").val().length == 0) {
				$("#rcol__chat-input__mic").show();
				$("#rcol__chat-input__send").hide();
			}
		}
	});


	// ##RICERCA CONTATTI
	$("#lcol__searchbar__textinput").keyup(function(event) {
		searchContact();
	});


	// ##APERTURA CHAT CONTATTI
	$(".lcol__contact").click(openChat);


	// ##APERTURA DROPDOWN DETTAGLI MESSAGGIO
	$(".rcol__chat").on("click", ".fa-chevron-down", messageDetails);
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

	// lo visualizzo nella chat del contatto attualmente attivo
	$(".rcol__chat").each(function(index) {
		if ($(this).hasClass("show")) {
			$(this).append(messageInHTML);
		}
	});

	// resetto icona microfono
	$("#rcol__chat-input__mic").show();
	$("#rcol__chat-input__send").hide();
	
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

		// cerco la chat del contatto a cui devo rispondere
		$(".rcol__chat").each(function(index) {
			if ($(this).hasClass("show")) {
				// visualizzo il messaggio
				$(this).append(replyMessage);
			}
		});

		// ritorno a visualizzare l'ultimo accesso
		lastAccessText.text(lastAccessTextBackup);
	}, 1000);	
}

function searchContact() {
	// acquisisco quanto inserito nella barra di ricerca
	var contactName = $("#lcol__searchbar__textinput").val().toLowerCase();

	// nascondo tutti i contatti
	$(".lcol__contact").hide();

	//visualizzo solo quelli che corrispondono alla ricerca
	$(".lcol__contact__name").each(function(index) {
		if ($(this).text().toLowerCase().includes(contactName)) {
			// mostro il div del contatto trovato
			$(this).parents($(".lcol__contact")).show();
		}
	});
}

function openChat() {
	var contactName, contactPhoto;

	//coloro di grigio il contatto cliccato
	$(".lcol__contact").removeClass("selected");
	$(this).addClass("selected");

	//prelevo nome e foto e piazzarli nell'intestazione della chat
	contactName = $(this).find(".lcol__contact__name").text();
	contactPhoto = $(this).find(".lcol__contact__photo").html();
	$(".navbar__user-info__name").text(contactName);
	$(".navbar__user-info__photo").html(contactPhoto);

	//prendo il codice univoco del contatto per aprire la chat corrispondente
	var contactID = $(this).attr("person");

	//apro la chat corrispondente
	$(".rcol__chat").removeClass("show");
	$(".rcol__chat").each(function(index) {
		if ($(this).attr("person") === contactID) {
			$(this).addClass("show");
		}
	});
}

function messageDetails() {
	$(".rcol__chat__message__dropdown").css("display", "none");
	$(this).siblings(".rcol__chat__message__dropdown").css("display", "flex");

	//cancella messaggio
	$(".rcol__chat").on("click", ".message__delete", function(){
		$(this).parents(".rcol__chat__message").remove();
	});
}

