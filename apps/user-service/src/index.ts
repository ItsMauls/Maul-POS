import express, { urlencoded } from 'express';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/api/users', router);

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});
