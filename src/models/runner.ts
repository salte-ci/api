import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ modelName: 'runner' })
export class RunnerModel extends Model<RunnerModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;
}
