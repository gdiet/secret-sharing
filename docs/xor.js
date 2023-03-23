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
// document automation
listen(button, 'textToBytesButton', 'click', () => {
    input('numbersInput').value = fromUTF8(input('textInput').value).join(',');
});
listen(button, 'bytesToTextButton', 'click', () => {
    input('textInput').value = toUTF8(input('numbersInput').value.split(',').map(n => parseInt(n) || 95));
});
//# sourceMappingURL=xor.js.map