import { Table, BelongsTo, Column, ForeignKey, Model, DataType } from 'sequelize-typescript';
import { RepoModel } from './repo';

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
  @ForeignKey(() => RepoModel)
  repo_id: string;

  @BelongsTo(() => RepoModel, 'repo_id')
  repo: RepoModel;
}
