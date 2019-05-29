import { Table, Column, ForeignKey, BelongsTo, Model, DataType, HasMany } from 'sequelize-typescript';
import { ProviderModel } from './provider';
import { BuildModel } from './build';

@Table({ modelName: 'repo' })
export class RepoModel extends Model<RepoModel> {
  @HasMany(() => BuildModel, 'repo_id')
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
  providers: ProviderModel;

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
}
