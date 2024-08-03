import express, { urlencoded } from 'express';
import router from './routes';
import errorMiddleware from './middlewares/error';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(urlencoded())

app.use(router)
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
