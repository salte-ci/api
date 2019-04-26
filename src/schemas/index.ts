import * as Ajv from 'ajv';
import * as sockets from './sockets.json';

const ajv = new Ajv();
ajv.addSchema(sockets, 'sockets');

export function validate(schema: string, payload: any) {
  const valid = ajv.validate(schema, payload);

  if (valid) return true;
  else throw new Error('Payload was formatted incorrectly, please check the documentation to validate your request.');
}
