export interface TelemetryData {
    conversations: {
        count: number;
        totalSizeInMB: number;
        longestSessionMinutes: number;
    };
    projectsTracked: number;
    trackedFileEdits: number;
    browserRecordings: number;
    artifactsGenerated: {
        tasks: number;
        plans: number;
        walkthroughs: number;
    };
    recentActivity: ActivityItem[];
}

export interface ActivityItem {
    type: string;
    name: string;
    date: string;
}
