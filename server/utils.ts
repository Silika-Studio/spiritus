/** Loads the root .env variables into `process.env` */
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const loadConfig = () => require('dotenv').config({ path: require('find-config')('.env') });
