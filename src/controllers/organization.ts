import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { database } from '../models/database';

@Controller('organizations')
export class OrganizationController {

  @Get('/')
  public async get(req: Request, res: Response): Promise<Response> {
    const { OrganizationModel } = await database();

    const organizations = await OrganizationModel.findAll();

    return res.status(200).json(organizations);
  }
}
