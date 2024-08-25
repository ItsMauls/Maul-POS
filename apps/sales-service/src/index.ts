import express, { urlencoded } from 'express';
import yaml from 'js-yaml';
import cors from 'cors';
import fs from 'fs';
import router from './routes';
import errorMiddleware from './middlewares/error';
import { authenticate } from '../../../libs/@auth/src/authenticate';

const app = express();
const configFile = process.env.CONFIG_FILE || './cmd/config.yml';
const config = yaml.load(fs.readFileSync(configFile, 'utf8')) as {
  APP_NAME: string;
  HTTP_PORT: string;
};
const PORT = config.HTTP_PORT || '3005';

app.use(cors())
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/api/sales', authenticate, router);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`${config.APP_NAME} listening on port ${PORT}`);
});
