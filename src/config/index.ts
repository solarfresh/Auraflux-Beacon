interface RuntimeConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  AURAFLUX_NEXUS_URL: string;
  AURAFLUX_WS_URL: string;
  WS_MAX_RECONNECT_ATTEMPTS: number;
  WS_INITIAL_BACKOFF_TIME_MS: number;
  WS_MAX_BACKOFF_TIME_MS: number;
}


const config: RuntimeConfig = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV as RuntimeConfig['NODE_ENV'],
  AURAFLUX_NEXUS_URL: import.meta.env.VITE_AURAFLUX_NEXUS_URL as string,
  AURAFLUX_WS_URL: import.meta.env.VITE_AURAFLUX_WS_URL as string,
  WS_MAX_RECONNECT_ATTEMPTS: import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS as number,
  WS_INITIAL_BACKOFF_TIME_MS: import.meta.env.VITE_WS_INITIAL_BACKOFF_TIME_MS as number,
  WS_MAX_BACKOFF_TIME_MS: import.meta.env.VITE_WS_MAX_BACKOFF_TIME_MS as number,
};

export default config;