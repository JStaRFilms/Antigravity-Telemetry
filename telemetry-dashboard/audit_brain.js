const fs = require('fs');
const path = require('path');

const brainDir = path.join(process.env.HOME || process.env.USERPROFILE, '.gemini', 'antigravity', 'brain');

function statSafe(p) {
    try { return fs.statSync(p); } catch (e) { return null; }
}

// Keep track of unique file types, extensions, and schema shapes
const globalAudit = {
    extensions: new Set(),
    directories: new Set(),
    jsonSchemas: {} // Key: filename pattern or extension, Value: array of top-level keys
};

function auditFile(filePath, fileName) {
    const stat = statSafe(filePath);
    if (!stat || stat.isDirectory()) return;

    const ext = path.extname(fileName) || fileName;
    globalAudit.extensions.add(ext);

    // If it's a JSON file or a known log, try to peek at the schema
    if (ext.endsWith('.json') || fileName.includes('metadata')) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsed = JSON.parse(content);
            const keys = Object.keys(parsed).slice(0, 15).join(', '); // grab top-level keys

            // Group schemas by filename or extension to find patterns
            const groupKey = fileName.endsWith('.json') ? (fileName.includes('metadata') ? 'metadata.json' : ext) : fileName;
            if (!globalAudit.jsonSchemas[groupKey]) {
                globalAudit.jsonSchemas[groupKey] = new Set();
            }
            globalAudit.jsonSchemas[groupKey].add(keys);
        } catch (e) {
            // Not parsing as JSON, ignore
        }
    }
}

function deepCrawl(dir, currentDepth = 0, maxDepth = 4) {
    if (currentDepth > maxDepth) return;

    let items;
    try {
        items = fs.readdirSync(dir);
    } catch (e) { return; }

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = statSafe(fullPath);

        if (stat && stat.isDirectory()) {
            globalAudit.directories.add(item);
            deepCrawl(fullPath, currentDepth + 1, maxDepth);
        } else if (stat) {
            auditFile(fullPath, item);
        }
    }
}

console.log("=== Deep Auditing 20 Random Folders in Brain... ===\n");

const convos = fs.readdirSync(brainDir).filter(f => statSafe(path.join(brainDir, f))?.isDirectory());

// Shuffle and pick 20
const shuffled = convos.sort(() => 0.5 - Math.random());
const sample = shuffled.slice(0, 20);

console.log(`Selected ${sample.length} conversation folders to deep crawl.\n`);

sample.forEach((convoId, index) => {
    deepCrawl(path.join(brainDir, convoId));
});

console.log("=== Final Audit Results ===");
console.log(`\n1. Found Sub-Directory Types (Hidden/System):`);
Array.from(globalAudit.directories)
    .filter(d => d.startsWith('.') || d.includes('log') || d.includes('sys') || d.includes('track'))
    .forEach(d => console.log(`   - ${d}`));

console.log(`\n2. Found File Extensions/Types:`);
Array.from(globalAudit.extensions).forEach(ext => console.log(`   - ${ext}`));

console.log(`\n3. Discovered JSON Data Schemas (Top-level keys):`);
for (const [group, schemas] of Object.entries(globalAudit.jsonSchemas)) {
    console.log(`   -> [${group}] schemas detected:`);
    Array.from(schemas).slice(0, 3).forEach(schema => console.log(`      Keys: { ${schema} }`));
}

// Let's also peek at the global context_state
console.log(`\n=== Implicit State Files ===`);
const implicitDir = path.join(path.dirname(brainDir), 'implicit');
if (statSafe(implicitDir)) {
    console.log(`Found 'implicit' directory containing Protobufs mapping to system intents.`);
}
