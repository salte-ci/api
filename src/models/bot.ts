import { Table, BelongsTo, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import { AccountModel } from './account';

@Table({ modelName: 'bot' })
export class BotModel extends Model<BotModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  @ForeignKey(() => AccountModel)
  id: string;

  @BelongsTo(() => AccountModel, 'id')
  account: AccountModel;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  api_key: string;
}
