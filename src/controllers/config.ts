import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { publicConfig, computed } from '../shared/config';

@Controller('config')
export class ConfigController {

  @Get('/')
  public async get(req: Request, res: Response): Promise<any> {
    return res.status(200).json({
      ...computed,
      ...publicConfig,
    });
  }
}
