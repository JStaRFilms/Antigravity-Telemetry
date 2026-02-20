const fs = require('fs');
const zlib = require('zlib');
const pbPath = 'C:\\Users\\johno\\.gemini\\antigravity\\conversations\\3ea98d0c-76c2-4001-8ca7-7c6e5da698ee.pb';

try {
    const buffer = fs.readFileSync(pbPath);
    const unzipped = zlib.gunzipSync(buffer);

    let strings = [];
    let currentString = '';
    for (let i = 0; i < Math.min(unzipped.length, 10000); i++) {
        const byte = unzipped[i];
        if (byte >= 32 && byte <= 126) {
            currentString += String.fromCharCode(byte);
        } else {
            if (currentString.length >= 10) strings.push(currentString);
            currentString = '';
        }
    }
    if (currentString.length >= 10) strings.push(currentString);
    fs.writeFileSync('C:\\Users\\johno\\.gemini\\antigravity\\playground\\frozen-skylab\\test_protodump_unzipped.json', JSON.stringify(strings, null, 2));
    console.log("Successfully unzipped! Strings extracted.");
} catch (e) {
    console.log("Not gzipped or error:", e.message);
}
