import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ modelName: 'account' })
export class AccountModel extends Model<AccountModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  id: string;
}
