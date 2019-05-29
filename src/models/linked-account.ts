import { Table, Column, ForeignKey, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { AccountModel } from './account';
import { ProviderModel } from './provider';

@Table({ modelName: 'linked_account' })
export class LinkedAccountModel extends Model<LinkedAccountModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  @ForeignKey(() => AccountModel)
  account_id: string;

  @BelongsTo(() => AccountModel)
  account: AccountModel;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  @ForeignKey(() => ProviderModel)
  provider_id: number;

  @BelongsTo(() => ProviderModel)
  provider: ProviderModel;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  access_token: string;

  @Column(DataType.STRING)
  refresh_token: string;
}
