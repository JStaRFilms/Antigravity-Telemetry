const Database = require('better-sqlite3');
const path = require('path');

const brainDir = path.join(process.env.HOME || process.env.USERPROFILE, '.gemini', 'antigravity');

try {
    const db = new Database(path.join(brainDir, 'telemetry.db'), { readonly: true });
    console.log("=== TELEMETRY.DB SCHEMA ===");
    const tables = db.prepare("SELECT name, sql FROM sqlite_schema WHERE type='table'").all();
    tables.forEach(table => {
        console.log(`\nTable: ${table.name}`);
        console.log(table.sql);
        console.log(`Row count: ${db.prepare(`SELECT count(*) as c FROM ${table.name}`).get().c}`);
    });
    db.close();
} catch (e) {
    console.error("Error reading telemetry.db:", e.message);
}

console.log("\n=====================\n");

try {
    const activeDir = path.join(brainDir, 'code_tracker', 'active');
    const fs = require('fs');
    if (fs.existsSync(activeDir)) {
        const activeProjects = fs.readdirSync(activeDir);
        if (activeProjects.length > 0) {
            const dbPath = path.join(activeDir, activeProjects[0], 'tracker.db');
            if (fs.existsSync(dbPath)) {
                const db2 = new Database(dbPath, { readonly: true });
                console.log(`=== TRACKER.DB SCHEMA (${activeProjects[0]}) ===`);
                const tables = db2.prepare("SELECT name, sql FROM sqlite_schema WHERE type='table'").all();
                tables.forEach(table => {
                    console.log(`\nTable: ${table.name}`);
                    console.log(table.sql);
                    console.log(`Row count: ${db2.prepare(`SELECT count(*) as c FROM ${table.name}`).get().c}`);
                });
                db2.close();
            }
        }
    }
} catch (e) {
    console.error("Error reading tracker.db:", e.message);
}
