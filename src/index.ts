import { ExpressServer } from './server';
import { config } from './shared/config';

const express = new ExpressServer();

express.listen(config.PORT);
