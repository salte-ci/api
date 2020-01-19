import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { RepositoryModel } from './repository';
import { ProviderModel } from './provider';

@Table({ modelName: 'organization' })
export class OrganizationModel extends Model<OrganizationModel> {
  @HasMany(() => RepositoryModel, 'organization_id')
  builds: RepositoryModel[];

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: 'provider_slug'
  })
  @ForeignKey(() => ProviderModel)
  provider_id: number;

  @BelongsTo(() => ProviderModel)
  provider: ProviderModel;
}
