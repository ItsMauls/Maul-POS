import express, { urlencoded } from 'express';
import router from './routes';
import { authenticate } from '@shared-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', router)

app.get('/halo', authenticate, (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
