import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ modelName: 'build' })
export class BuildModel extends Model<BuildModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: string;
}
