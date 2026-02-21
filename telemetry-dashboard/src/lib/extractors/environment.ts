export function getEnvironmentState() {
    return {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        uptimeSeconds: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    };
}
