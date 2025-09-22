interface RuntimeConfig {
  NODE_ENV: 'development' | 'production' | 'test';
}


const config: RuntimeConfig = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV as RuntimeConfig['NODE_ENV'],
};

export default config;