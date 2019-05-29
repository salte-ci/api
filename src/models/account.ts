import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { LinkedAccountModel } from './linked-account';
import { BotModel } from './bot';
import { UserModel } from './user';

@Table({ modelName: 'account' })
export class AccountModel extends Model<AccountModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  id: string;

  @HasMany(() => LinkedAccountModel, 'account_id')
  linkedAccounts: LinkedAccountModel[];

  @HasMany(() => BotModel, 'id')
  bots: BotModel[];

  @HasMany(() => UserModel, 'id')
  users: UserModel[];
}
