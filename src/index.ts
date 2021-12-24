import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import routes from '@source/routes';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.listen(
    process.env.PORT || 3000,
    () => console.log('[server] -> start success.')
);