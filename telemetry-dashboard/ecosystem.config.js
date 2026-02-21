module.exports = {
    apps: [
        {
            name: 'antigravity-dashboard',
            script: 'server.js',
            instances: 1,
            exec_mode: 'fork',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 9999
            }
        }
    ]
};
