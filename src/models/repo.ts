import { Table, BelongsTo, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import { ProviderModel } from './provider';

@Table({ modelName: 'repo' })
export class RepoModel extends Model<RepoModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => ProviderModel)
  provider_id: number;

  @BelongsTo(() => ProviderModel, 'provider_id')
  provider: ProviderModel;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  slug: string;
}
