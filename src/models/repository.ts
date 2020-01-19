import { Table, Column, ForeignKey, BelongsTo, Model, DataType, HasMany } from 'sequelize-typescript';
import { ProviderModel } from './provider';
import { BuildModel } from './build';
import { OrganizationModel } from './organization';

@Table({ modelName: 'repository' })
export class RepositoryModel extends Model<RepositoryModel> {
  @HasMany(() => BuildModel, 'repository_id')
  builds: BuildModel[];

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'provider_slug'
  })
  slug: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  private: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  @ForeignKey(() => OrganizationModel)
  organization_id: string;

  @BelongsTo(() => OrganizationModel)
  organizations: OrganizationModel;
}
