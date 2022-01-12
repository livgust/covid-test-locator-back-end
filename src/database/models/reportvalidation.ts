import {DataType, Model, ModelStatic, Sequelize} from 'sequelize';
export class ReportValidation extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: {[key: string]: ModelStatic<Model>}) {
    // define association here
    ReportValidation.belongsTo(models.Report);
  }
}
export default (sequelize: Sequelize, DataTypes: {[key: string]: DataType}) => {
  ReportValidation.init(
    {
      reportId: DataTypes.NUMBER,
      createdBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ReportValidation',
    }
  );
  return ReportValidation;
};
