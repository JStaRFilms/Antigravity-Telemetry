const fs = require('fs');
const path = require('path');

const pbPath = 'C:\\Users\\johno\\.gemini\\antigravity\\conversations\\3ea98d0c-76c2-4001-8ca7-7c6e5da698ee.pb';
const buffer = fs.readFileSync(pbPath);

// Extract printable strings from binary data
let strings = [];
let currentString = '';

for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    if (byte >= 32 && byte <= 126) {
        currentString += String.fromCharCode(byte);
    } else {
        if (currentString.length >= 10) {
            strings.push(currentString);
        }
        currentString = '';
    }
}
if (currentString.length >= 10) {
    strings.push(currentString);
}

// Just output a small subset to verify if tool calls, tokens, etc. are visible
fs.writeFileSync('C:\\Users\\johno\\.gemini\\antigravity\\playground\\frozen-skylab\\test_protodump.json', JSON.stringify(strings.slice(0, 500), null, 2));

console.log(`Found ${strings.length} strings. Dumped first 500 to test_protodump.json`);
