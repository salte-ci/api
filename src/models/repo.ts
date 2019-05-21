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

  @Column(DataType.STRING)
  @ForeignKey(() => ProviderModel)
  provider_id: string;

  @BelongsTo(() => ProviderModel, 'provider_id')
  provider: ProviderModel;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  slug: string;
}
