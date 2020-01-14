import { WhereOptions } from 'sequelize';
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Op } from 'sequelize';
import { database } from '../models/database';

@Controller('repositories')
export class RepositoryController {

  @Get('/')
  public async get(req: Request, res: Response): Promise<Response> {
    const { RepositoryModel, BuildModel } = await database();

    const { scope, organization_id } = req.query;

    const where: WhereOptions = {
      private: false
    };

    if (scope) {
      where.slug = {
        [Op.like]: `${scope.replace('*', '')}%`
      };
    }

    // NOTE(nick-woodward): This will most likely return
    // multiple results since its joining the build table.
    // We'll need to resolve this once we get a few builds in the database.
    const repos = await RepositoryModel.findAll({
      where: {
        ...where,
        organization_id,
      },
      include: [{
        model: BuildModel,
        attributes: [],
        required: true
      }]
    });

    return res.status(200).json(repos);
  }
}
