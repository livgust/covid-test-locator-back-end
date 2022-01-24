import {DataType, Model, ModelStatic, Sequelize} from 'sequelize';
export class Place extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models: {[key: string]: ModelStatic<Model>}) {
    // define association here
    Place.hasMany(models.Report);
  }
}
export default (sequelize: Sequelize, DataTypes: {[key: string]: DataType}) => {
  Place.init(
    {
      googlePlaceId: DataTypes.STRING,
      name: DataTypes.STRING,
      vicinity: DataTypes.STRING,
      latitude: DataTypes.DECIMAL,
      longitude: DataTypes.DECIMAL,
      createdBy: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      website: DataTypes.STRING,
    },
    {
      sequelize,
      underscored: true,
    }
  );
  return Place;
};
