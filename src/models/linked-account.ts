import { Table, BelongsTo, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import { AccountModel } from './account';
import { ProviderModel } from './provider';

@Table({ modelName: 'linked_account' })
export class LinkedAccountModel extends Model<LinkedAccountModel> {
  @BelongsTo(() => AccountModel, 'account_id')
  account: AccountModel;

  @BelongsTo(() => ProviderModel, 'provider_id')
  provider: ProviderModel;

  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  @ForeignKey(() => AccountModel)
  account_id: string;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true
  })
  @ForeignKey(() => ProviderModel)
  provider_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  access_token: string;

  @Column(DataType.STRING)
  refresh_token: string;
}
