// Simple metrics collection for monitoring
interface Metrics {
  requests: number;
  errors: number;
  aiGenerations: number;
  projectsCreated: number;
  startTime: Date;
}

let metrics: Metrics = {
  requests: 0,
  errors: 0,
  aiGenerations: 0,
  projectsCreated: 0,
  startTime: new Date(),
};

export const incrementRequests = () => {
  metrics.requests++;
};

export const incrementErrors = () => {
  metrics.errors++;
};

export const incrementAIGenerations = () => {
  metrics.aiGenerations++;
};

export const incrementProjectsCreated = () => {
  metrics.projectsCreated++;
};

export const getMetrics = () => {
  const uptime = Date.now() - metrics.startTime.getTime();
  return {
    ...metrics,
    uptime: Math.floor(uptime / 1000), // seconds
    requestsPerMinute: Math.floor((metrics.requests / (uptime / 1000)) * 60),
    errorRate: metrics.requests > 0 ? (metrics.errors / metrics.requests) * 100 : 0,
  };
};

export const resetMetrics = () => {
  metrics = {
    requests: 0,
    errors: 0,
    aiGenerations: 0,
    projectsCreated: 0,
    startTime: new Date(),
  };
};

export default metrics;