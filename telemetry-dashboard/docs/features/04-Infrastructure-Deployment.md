# PM2 Infrastructure & Deployment

## Overview
Because the Next.js CLI wrappers do not run stably as Windows background daemons, the Telemetry Dashboard utilizes a custom pure-Node environment proxy and an explicit PM2 Ecosystem configuration to guarantee 100% startup resilience.

## Architecture
- **Process Manager:** PM2 (running globally)
- **Environment:** Windows Node.js `fork` mode
- **Entrypoint:** `server.js`

## Key Files

### `server.js`
A raw `http` Node module that bootstraps the compiled Next.js production build (`pnpm build`). It manually handles the routing requests, fundamentally removing the reliance on the flaky `npm run start` shell aliases that PM2 struggles with on Windows.

### `ecosystem.config.js`
The declarative PM2 cluster configuration file.
```javascript
module.exports = {
  apps: [
    {
      name: 'antigravity-dashboard',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 9999
      }
    }
  ]
};
```

### `start_dashboard.bat`
A legacy fallback batch script. While PM2 handles the daemon, this script is provided as an alternative for quickly spinning up the background process without global PM2 installations (via `pnpm start`). 

## Run Instructions
The PM2 daemon is permanently bound. To view, edit, or terminate the process:
```powershell
pm2 status
pm2 logs antigravity-dashboard
pm2 stop antigravity-dashboard
```
