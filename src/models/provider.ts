import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  modelName: 'provider',
  defaultScope: {
    attributes: { exclude: ['client_secret'] }
  },
  scopes: {
    admin: {
      attributes: {
        include: ['client_secret']
      }
    }
  }
})
export class ProviderModel extends Model<ProviderModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  client_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  client_secret: string;

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
    type: DataType.ENUM,
    allowNull: false,
    values: ['bitbucket', 'github', 'gitlab']
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  api_url: string;
}
