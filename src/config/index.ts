interface RuntimeConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  AURAFLUX_NEXUS_URL: string;
  AURAFLUX_WS_URL: string;
}


const config: RuntimeConfig = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV as RuntimeConfig['NODE_ENV'],
  AURAFLUX_NEXUS_URL: import.meta.env.VITE_AURAFLUX_NEXUS_URL as string,
  AURAFLUX_WS_URL: import.meta.env.VITE_AURAFLUX_WS_URL as string
};

export default config;