import express, { urlencoded } from 'express';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', router)


app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
});
