import {QueryInterface, DataTypes} from 'sequelize';

export const up = async ({context}: {context: QueryInterface}) => {
  await context.createTable('places', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    google_place_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    vicinity: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.JSON,
    },
    created_by: {
      type: DataTypes.STRING,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};
export const down = async ({context}: {context: QueryInterface}) => {
  await context.dropTable('places');
};
