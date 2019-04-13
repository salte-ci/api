import * as express from 'express';
import { config } from './shared/config';
import { register } from './utils/register';
import { HealthRoute } from './routes/routes';

const app = express();

app.use(register(new HealthRoute()));

app.listen(config.PORT, () => {
  console.log(`Listening at: http://localhost:${config.PORT}`);
});
