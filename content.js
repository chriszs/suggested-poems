
function replaceSuggestions() {
    let messageEls = document.querySelectorAll('[data-message-id]');

    if (messageEls.length > 0) {
    	let messageEl = messageEls[messageEls.length-1];

    	let messageText = messageEl.textContent;

    	console.log(messageText);
	}
}

// Do it once
replaceSuggestions();

// AND KEEP ON DOING IT!
setInterval(replaceSuggestions, 1000);
