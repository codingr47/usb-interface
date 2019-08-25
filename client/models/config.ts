class AppConfig {
    server:string;
}
const config = new AppConfig();
config.server = 'ws://localhost:3000';

export default config;