import {QueryInterface, DataTypes} from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async ({context}: {context: any}) => {
  const queryInterface = context.getQueryInterface() as QueryInterface;
  await queryInterface.createTable('places', {
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
    latitude: {
      type: DataTypes.DECIMAL(13, 8),
    },
    longitude: {
      type: DataTypes.DECIMAL(13, 8),
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async ({context}: {context: any}) => {
  const queryInterface = context.getQueryInterface() as QueryInterface;
  await queryInterface.dropTable('places');
};
