import cors from 'cors';
import express from 'express';
import { healthMetricListMockData } from './health-metric.mockapi';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const corsOptions = {
  origin: ['http://localhost:4222'],
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/api/metrics', (req, res) => {
  res.send(healthMetricListMockData);
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
