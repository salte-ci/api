import * as express from 'express';
import { config } from './shared/config';
import { register } from './utils/register';
import * as Routes from './routes/routes';

const app = express();

for (const [key, Route] of Object.entries(Routes)) {
  console.log(`Registering ${key}...`);
  app.use(register(new Route()));
}

app.listen(config.PORT, () => {
  console.log(`Listening at: http://localhost:${config.PORT}`);
});
