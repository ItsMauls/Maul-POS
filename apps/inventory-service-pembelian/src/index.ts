import express, { urlencoded } from 'express';
import router from './routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));

app.use('/api/inventory-pembelian', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
