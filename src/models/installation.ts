import { Table, Column, ForeignKey, BelongsTo, Model, DataType } from 'sequelize-typescript';
import { ProviderModel } from './provider';

@Table({ modelName: 'installation' })
export class InstallationModel extends Model<InstallationModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  id: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => ProviderModel)
  provider_id: number;

  @BelongsTo(() => ProviderModel)
  providers: ProviderModel;
}
