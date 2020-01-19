import { Table, Column, ForeignKey, BelongsTo, Model, DataType } from 'sequelize-typescript';
import { RepositoryModel } from './repository';

@Table({ modelName: 'build' })
export class BuildModel extends Model<BuildModel> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  @ForeignKey(() => RepositoryModel)
  repository_id: string;

  @BelongsTo(() => RepositoryModel)
  repos: RepositoryModel;
}
