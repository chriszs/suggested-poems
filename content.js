
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
                                    .replace(/(playing\W|played\W|play\W)?Pok(è|é|e)mon\WGo/gi, 'going outside')
                                    .replace(/(a\W)?Pok(é|e)mon/gi, 'fresh air')
                                    .replace(/lure\Wmodule/gi, 'big tent')
                                    .replace(/Pok(è|é|e)(\W)?stop/ig, 'place outside');

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