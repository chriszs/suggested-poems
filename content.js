
function troncIt() {
    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text
                                    .replace(/pokemongo/ig, 'goingoutside')
                                    .replace(/(playing |played |play )?Pok(è|é|e)mon Go?/gi, 'going outside')
                                    .replace(/Pok(é|e)mon?/gi, 'fresh air')
                                    .replace(/lure module/gi, 'big tent')
                                    .replace(/Pok(è|é|e)stop/ig, 'place outside');

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
}

// Do it once
troncIt();

// AND KEEP ON DOING IT!
setInterval(troncIt, 1000);