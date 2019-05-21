import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

import { database } from '../models/database';
import { config } from '../shared/config';

export interface Auth {
  [key: string]: any;
}

export async function auth(request: Request): Promise<Auth | null> {
  const auth = request.header('authorization');

  if (!auth) return null;

  const match = auth.match(/^Bearer (.+)$/i);

  if (!match) throw new Error(`Token didn't match the expected format. "Bearer <token>"`);

  const [, token] = match;

  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.JWKS_URL
  });

  const decoded: Auth = await new Promise((resolve, reject) => {
    jwt.verify(token, (header: jwt.JwtHeader, callback) => {
      if (!header.kid) throw new Error(`Invalid kid in token.`);

      client.getSigningKey(header.kid, (error: Error, key: jwksClient.Jwk) => {
        callback(error, key.publicKey || key.rsaPublicKey);
      });
    }, {
      audience: config.AUDIENCE,
      issuer: config.ISSUER,
    }, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded as Auth);
    });
  });

  const { UserModel, AccountModel } = await database();

  const account = await AccountModel.findByPk(decoded.sub);
  if (!account) {
    await AccountModel.create({
      id: decoded.sub
    })
  }

  const user = await UserModel.findByPk(decoded.sub);
  if (!user) {
    await UserModel.create({
      id: decoded.sub
    })
  }

  return decoded;
}
