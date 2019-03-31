function insertTextAtCursor(text) {
    // https://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div

    let sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function insertBody(text) {
    let el = document.querySelector('div[aria-label="Message Body"]');

    if (el) {
        insertTextAtCursor(text);

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
        if (span.textContent == text && !span.getAttribute('role')) {
            found = span;
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

    let replyEl = selectByText('span','Reply');

    if (replyEl) {
        dispatchEvent(replyEl,'click');
    }

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
    let buttonsEl = document.querySelector('.suggestButtons');

    if (buttonsEl) {
        buttonsEl.remove();
    }

    buttonsEl = document.createElement('div');
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

function composePoem(seedText) {
    // http://www.rangakrish.com/downloads/RiTa-Generation.js
    let rm = new RiMarkov(3);
    rm.loadText(POETRY_CORPUS + ' ' + seedText);

    let sentences = rm.generateSentences(3);

    return sentences;
}

function composeHaiku(seedText) {
    let lexicon = new RiLexicon();

    // https://creative-coding.decontextualize.com/intro-to-ritajs/
    let firstLine  = "the " + 
        lexicon.randomWord("jj", 2) + " " +
        lexicon.randomWord("nn", 2);
    let secondLine = lexicon.randomWord("vbg", 2) +
        " in the " +
        lexicon.randomWord("jj", 2) + " " +
        lexicon.randomWord("nn", 1);
    let thirdLine = "I " +
        lexicon.randomWord("vbd", 2) + " " + 
        lexicon.randomWord("rb", 2);

    return [firstLine, secondLine, thirdLine];
}

function getText(textEls) {
    let text = '';

    for (el of textEls) {
        if (el.hasChildNodes()) {
            for (node of el.childNodes) {
                if (node.nodeType === 3 && node.nodeValue && node.nodeValue.trim() !== '') {
                    text += '\n' + node.nodeValue.trim();
                }
            }
        }
    }

    return text;
}

function getMessageText(messageEl) {
    let text = '';

    let quotedEls = messageEl.querySelectorAll('blockquote div:not(.gmail_attr):not([class*="signature"])')

    if (quotedEls) {
        text += getText(quotedEls);
    }

    let unquotedEls = messageEl.querySelectorAll('div:not(.gmail_attr):not([class*="signature"])')

    if (unquotedEls) {
        text = text + '\n' + getText(unquotedEls).replace(text,'');
    }

    let lines = text.split('\n');

    return lines.filter(line => line.length > 10).join('\n');
}

function init() {
    let messageEl = selectLastEl('[data-message-id]');

    if (!messageEl) {
        return false;
    }

    let buttonsEl = messageEl.nextSibling.classList.contains('suggestButtons');

    if (buttonsEl) {
        if (document.querySelector('div[aria-label="Message Body"]')) {
            messageEl.nextSibling.style.display = 'none';
        }
        else {
            messageEl.nextSibling.style.display = 'block';
        }

        return false;
    }

    let suggestions = composePoem(getMessageText(messageEl));

    replaceSuggestions(messageEl,suggestions);

    return false;
}

keepTrying(init,1000);
