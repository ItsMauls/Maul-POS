import express, { urlencoded } from 'express';
import router from './routes';
import cors from 'cors';
import { USER_SERVICE_URL } from './constants';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', router)


app.listen(PORT, () => {
  console.log(`User Service URL: ${USER_SERVICE_URL}`);
  console.log(`Auth Service is running on port ${PORT}`);
});
