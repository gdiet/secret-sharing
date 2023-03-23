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
    set secretText(s) { input('secretTextInput').value = s; },
    get secretBytes() { return parseInts(input('secretBytesInput').value, 95); },
    set secretBytes(b) { input('secretBytesInput').value = b.join(','); },
    get shareNumber() { return parseInt(input('shareNumberInput').value); },
    set shareNumber(k) { input('shareNumberInput').value = String(k); },
    set shareKIndex(i) { span('shareKIndexSpan').innerHTML = String(i); },
    shareSpan: (index) => span(`share${index}Span`),
    shareInput: (index) => input(`share${index}Input`),
    get shareKInput() { return parseInts(input('shareKInput').value, 0); },
    set shareKInput(b) { input('shareKInput').value = b.join(','); },
    get reconstuctedBytes() { return parseInts(input('reconstructedSecretBytesInput').value, 0); },
    set reconstuctedBytes(b) { input('reconstructedSecretBytesInput').value = b.join(','); },
    set reconstuctedText(s) { input('reconstructedSecretTextInput').value = s; },
};
// ss: function(index: number) { return { set hidden(b: boolean) { span(`share${index}Span`).hidden = b } } },
// document automation
listen(button, 'textToBytesButton', 'click', () => {
    cont.secretBytes = fromUTF8(cont.secretText);
});
listen(button, 'bytesToTextButton', 'click', () => {
    cont.secretText = toUTF8(cont.secretBytes);
});
listen(input, 'shareNumberInput', 'change', () => {
    cont.shareNumber = limit(cont.shareNumber, 2, 7);
    cont.shareKIndex = cont.shareNumber;
    for (let i = 1; i <= 5; i++)
        cont.shareSpan(i).hidden = i >= cont.shareNumber;
});
listen(button, 'fillWithRandomBytesButton', 'click', () => {
    for (let i = 1; i < cont.shareNumber; i++)
        cont.shareInput(i).value = cont.secretBytes.map(() => random(0, 256)).join(",");
});
listen(button, 'createShareKButton', 'click', () => {
    let result = cont.secretBytes;
    for (let i = 1; i < cont.shareNumber; i++)
        result = result.map((value, index) => value ^ parseInts(cont.shareInput(i).value, 0)[index]);
    cont.shareKInput = result;
});
listen(button, 'reconstructSecretButton', 'click', () => {
    let result = cont.shareKInput;
    for (let i = 1; i < cont.shareNumber; i++)
        result = result.map((value, index) => value ^ parseInts(cont.shareInput(i).value, 0)[index]);
    cont.reconstuctedBytes = result;
});
listen(button, 'reconstructedBytesToTextButton', 'click', () => {
    cont.reconstuctedText = toUTF8(cont.reconstuctedBytes);
});
//# sourceMappingURL=xor.js.map