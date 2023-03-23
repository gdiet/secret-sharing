"use strict";
// document utilitiy functions
let input = (id) => document.getElementById(id);
let button = (id) => document.getElementById(id);
let radio = (id) => document.getElementById(id);
let span = (id) => document.getElementById(id);
let div = (id) => document.getElementById(id);
let paragraph = (id) => document.getElementById(id);
let listen = (func, id, eventType, listener) => func(id).addEventListener(eventType, listener);
// text utility functions
let fromUTF8 = (text) => Array.from(new TextEncoder().encode(text));
let toUTF8 = (bytes) => new TextDecoder().decode(new Uint8Array(bytes));
let parseInts = (text, ifParseFails) => text && text.split(',').map(n => parseInt(n) || ifParseFails) || Array();
// numeric utility functions - min is inclusive and max is exclusive
let random = (min, max) => Math.floor(Math.random() * (max - min) + min);
let limit = (n, min, max) => Math.min(max - 1, Math.max(min, n));
// document content
let cont = {
    get secretText() { return input('secretTextInput').value; },
    get secretBytes() { return parseInts(input('secretBytesInput').value, 95); },
    get shareNumber() { return parseInt(input('shareNumberInput').value); },
    set shareNumber(k) { input('shareNumberInput').value = String(k); },
    shareInput: (index) => input(`share${index}Input`),
};
// document automation
listen(button, 'textToBytesButton', 'click', () => {
    input('secretBytesInput').value = fromUTF8(cont.secretText).join(',');
});
listen(button, 'bytesToTextButton', 'click', () => {
    input('secretTextInput').value = toUTF8(cont.secretBytes);
});
listen(input, 'shareNumberInput', 'change', () => {
    cont.shareNumber = limit(cont.shareNumber, 2, 7);
    for (let i = 1; i <= 5; i++)
        span(`share${i}Span`).hidden = i >= cont.shareNumber;
});
listen(button, 'fillWithRandomBytesButton', 'click', () => {
    for (let i = 1; i < cont.shareNumber; i++)
        cont.shareInput(i).value = cont.secretBytes.map(() => random(0, 256)).join(",");
});
//# sourceMappingURL=xor.js.map