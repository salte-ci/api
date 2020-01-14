import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { LinkedAccountModel } from './linked-account';
import { InstallationModel } from './installation';
import { EnvironmentVariableModel } from './environment-variable';
import { RepositoryModel } from './repository';
import { OrganizationModel } from './organization';

export const PROVIDER_TYPES = ['bitbucket', 'github', 'gitlab'];

@Table({
  modelName: 'provider',
  defaultScope: {
    attributes: { exclude: ['client_secret', 'private_key'] }
  },
  scopes: {
    admin: {
      attributes: {
        include: ['client_secret', 'private_key']
      }
    }
  }
})
export class ProviderModel extends Model<ProviderModel> {
  @HasMany(() => InstallationModel, 'provider_id')
  installations: InstallationModel[];

  @HasMany(() => LinkedAccountModel, 'provider_id')
  linkedAccounts: LinkedAccountModel[];

  @HasMany(() => EnvironmentVariableModel, 'provider_id')
  environmentVariables: EnvironmentVariableModel[];

  @HasMany(() => OrganizationModel, 'provider_id')
  organizations: OrganizationModel[];

  @HasMany(() => RepositoryModel, 'provider_id')
  repositories: RepositoryModel[];

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  app_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  client_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  client_secret: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  private_key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  friendly_name: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: PROVIDER_TYPES
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  api_url: string;
}
