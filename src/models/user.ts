import { Table, BelongsTo, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import { AccountModel } from './account';

@Table({ modelName: 'user' })
export class UserModel extends Model<UserModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  @ForeignKey(() => AccountModel)
  id: string;

  @BelongsTo(() => AccountModel, 'id')
  account: AccountModel;
}
