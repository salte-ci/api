import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

@Controller('health')
export class HealthController {

  @Get('/')
  public async get(req: Request, res: Response): Promise<any> {
    return res.status(200).send({
      status: 'ok'
    });
  }
}
