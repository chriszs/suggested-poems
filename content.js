function insertBody(text) {
    let el = document.querySelector('div[aria-label="Message Body"]');

    if (el) {
        el.innerHTML = text + el.innerHTML;

        /*
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(el.childNodes[2], text.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);*/

        return true;
    }
    else {
        return false;
    }
}

function selectByText(tag, text) {
    // https://stackoverflow.com/questions/3813294/how-to-get-element-by-innertext
    let spans = document.getElementsByTagName(tag);

    let found;

    for (span of spans) {
        if (span.textContent == text) {
            found = span;
            break;
        }
    }
    return found;
}

function dispatchEvent(el, etype) {
    // https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
    let evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
}

function handleClick(text) {
    let buttonEls = document.querySelector('.suggestButtons');

    if (buttonEls) {
        buttonEls.style.display = 'none';
    }

    dispatchEvent(selectByText('span','Reply'),'click');

    keepTrying(insertBody.bind(this,text),1000);
}

function appendButton(el, text) {
    let buttonEl = document.createElement('div');
    buttonEl.classList.add('suggestButton');
    buttonEl.innerText = text;

    buttonEl.addEventListener('click', handleClick.bind(this,text));

    el.appendChild(buttonEl);
}

function selectLastEl(selector) {
    let els = document.querySelectorAll(selector);

    return els.length > 0 ? els[els.length-1] : null;
}

function replaceSuggestions(el,suggestions) {
    let buttonsEl = document.createElement('div');
    buttonsEl.classList.add('suggestButtons');

    for (suggestion of suggestions) {
        appendButton(buttonsEl,suggestion);
    }

    el.parentNode.insertBefore(buttonsEl, el.nextSibling);
}

function keepTrying(func, time) {
    let result = func();

    if (!result) {
        setTimeout(keepTrying.bind(this,func,time),time);
    }
}

function init() {
    let messageEl = selectLastEl('[data-message-id]');

    if (!messageEl) {
        return false;
    }

    //let messageText = messageEl.textContent;

    // let rs = RiString(messageText);
    // console.log(rs.features());

    const suggestions = [
        'Jumanji!',
        'Wherefore art thou Romeo?',
        'Jinkies.'
    ];

    replaceSuggestions(messageEl,suggestions);

    return true;
}

keepTrying(init,1000);
