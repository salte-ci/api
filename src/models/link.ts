import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ modelName: 'link' })
export class LinkModel extends Model<LinkModel> {
  @Column({
    type: DataType.STRING,
    primaryKey: true
  })
  id: number;
}
