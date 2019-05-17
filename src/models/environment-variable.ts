import { Table, BelongsTo, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import { ProviderModel } from './provider';

@Table({ modelName: 'environment_variable' })
export class EnvironmentVariableModel extends Model<EnvironmentVariableModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  @ForeignKey(() => ProviderModel)
  provider_id: string;

  @BelongsTo(() => ProviderModel, 'provider_id')
  provider: ProviderModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true
  })
  scope: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true
  })
  key: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false
  })
  masked: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  value: string;
}
