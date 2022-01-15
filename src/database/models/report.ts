import {DataType, Model, ModelStatic, Sequelize} from 'sequelize';
export class Report extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: {[key: string]: ModelStatic<Model>}) {
    // define association here
    Report.belongsTo(models.Place);
    Report.hasMany(models.ReportValidation);
  }
}
export default (sequelize: Sequelize, DataTypes: {[key: string]: DataType}) => {
  Report.init(
    {
      placeId: DataTypes.INTEGER,
      available: DataTypes.BOOLEAN,
      type: DataTypes.STRING,
      limit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Report',
    }
  );
  return Report;
};
