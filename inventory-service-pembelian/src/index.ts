import express, { urlencoded } from 'express';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(urlencoded())

app.use(router)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
