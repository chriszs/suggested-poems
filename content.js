
function replaceSuggestions() {
    var messageEls = document.querySelectorAll('[data-message-id]');

    console.log(messageEls);
}

// Do it once
replaceSuggestions();

// AND KEEP ON DOING IT!
setInterval(replaceSuggestions, 1000);
