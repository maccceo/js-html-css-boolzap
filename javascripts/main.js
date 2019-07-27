$(document).ready(function() {
	// #PRENDO ORA ULTIMO MESSAGGIO E LA VISUALIZZO NEI CONTATTI E NELL'INTESTAZIONE DELLA CHAT
	initHours();

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
			else {
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
	$(".rcol__chat").on("click", ".rcol__chat__message__icon", messageDetails);
});




function initHours() {
	var contactID, lastMsg, lastAccess;
	$(".lcol__contact").each(function() {
		// prendo il person ID del contatto
		contactID = $(this).attr("person");
		
		// salvo l'ora dell'ultimo messaggio presente nella chat
		lastMsg = $(".rcol__chat[person='" + contactID + "']").find(".rcol__chat__message__time:last").text();

		// la inserisco come informazione del contatto
		$(this).find(".lcol__contact__recived").text(lastMsg);
	});

	// salvo l'ora dell'ultimo messaggio in chat RICEVUTO
	lastAccess = $(".rcol__chat.show").find(".other .rcol__chat__message__time:last").text();
	// se non c'erano messaggi ricevuti invento l'ora
	if (!lastAccess) {
		lastAccess = "03:44";
	}
	// la scrivo come ultimo accesso
	$(".navbar__user-info__lastaccess>span").text(lastAccess);
}

function sendMessage() {
	var textInput = $("#rcol__chat-input__textinput");
	
	// acquisisco contenuto text input e lo svuoto
	var message = textInput.val();
	textInput.val("");
	// genero l'ora di invio messaggio
	var hour = hourGenerator();
	// la inserisco nelle info del contatto
	$(".selected").find(".lcol__contact__recived").text(hour);

	// inizializzo il template dei messaggi
	var source   = document.getElementById("message-template").innerHTML;
	var template = Handlebars.compile(source);
	// popolo il template con i dati richiesti
	var context = {class: "user", message: message, time: hour};
	var html    = template(context);

	// visualizzo il messaggio nella chat del contatto attualmente attivo
	$(".show").append(html);

	// resetto icona microfono
	$("#rcol__chat-input__mic").show();
	$("#rcol__chat-input__send").hide();
	
	// avvio la funzione di risposta al messaggio
	replyMessage();
}

function replyMessage() {
	var lastAccessText = $(".navbar__user-info__lastaccess");

	// sovrascrivo l'ultimo accesso con Sta scrivendo
	lastAccessText.text("Sta scrivendo ...");

	setTimeout(function() {
		var hour = hourGenerator();
		// aggiorno l'ora nelle info del contatto
		$(".selected").find(".lcol__contact__recived").text(hour);

		/// inizializzo il template dei messaggi
		var source   = document.getElementById("message-template").innerHTML;
		var template = Handlebars.compile(source);
		// popolo il template con i dati richiesti
		var context = {class: "other", message: "Ok", time: hour};
		var html    = template(context);

		// stampo la risposta nella chat attiva
		$(".show").append(html);

		// torno a visualizzare l'ultimo accesso con la nuova ora
		lastAccessText.text("Ultimo accesso oggi alle " + hour);
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
	var contactInfo = {};

	//coloro di grigio il contatto cliccato
	$(".lcol__contact").removeClass("selected");
	$(this).addClass("selected");

	//prelevo nome e foto e piazzarli nell'intestazione della chat
	contactInfo.name = $(this).find(".lcol__contact__name").text();
	contactInfo.photo = $(this).find(".lcol__contact__photo").html();
	contactInfo.hour =  $(this).find(".lcol__contact__recived").text();
	$(".navbar__user-info__name").text(contactInfo.name);
	$(".navbar__user-info__photo").html(contactInfo.photo);
	$(".navbar__user-info__lastaccess>span").text(contactInfo.hour);

	//prendo il codice univoco del contatto per aprire la chat corrispondente
	var contactID = $(this).attr("person");

	//apro la chat corrispondente
	$(".rcol__chat").removeClass("show");
	$(".rcol__chat[person='" + contactID + "']").addClass("show");
}

function messageDetails() {
	//visualizzo il menù della freccina selezionata
	$(this).next().toggle();

	//cancella messaggio
	$(".rcol__chat").on("click", ".message__delete", function(){
		$(this).parents(".rcol__chat__message").remove();
	});
}

function hourGenerator() {
	var d = new Date();
	var p = [];
	p.push(d.getHours().toString());
	p.push(d.getMinutes().toString());
	// aggiungo prima uno 0 se la cifra è singola
	for (var i = 0; i < p.length; i++) {
		if (p[i].length == 1) {
			p[i] = '0' + p[i]
		}
	}
	// ritorno una stringa "hh:mm"
	return  p[0] + ':' + p[1];
}