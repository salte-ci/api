import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ modelName: 'provider' })
export class ProviderModel extends Model<ProviderModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  friendly_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    values: ['bitbucket', 'github', 'gitlab']
  })
  type: string;
}
