/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from 'cors';
import express from 'express';
import * as path from 'path';
import { blogsMockData } from './blogs.mockapi';
import { healthMetricListMockData } from './health-metric.mockapi';

const app = express();
const corsOptions = {
  origin: ['http://localhost:4222'],
};
app.use(cors(corsOptions));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to mockapi-express!' });
});

app.get('/metrics', (req, res) => {
  res.send(healthMetricListMockData);
});

app.get('/blogs', (req, res) => {
  res.send(blogsMockData);
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
