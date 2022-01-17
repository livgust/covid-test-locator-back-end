import {QueryInterface, DataTypes} from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async ({context}: {context: any}) => {
  const queryInterface = context.getQueryInterface() as QueryInterface;
  await queryInterface.createTable('reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    place_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'places',
        key: 'id',
      },
    },
    available: {
      type: DataTypes.BOOLEAN,
    },
    type: {
      type: DataTypes.STRING,
    },
    limit: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.STRING,
    },
    reported_at: {
      type: DataTypes.DATE,
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
  await queryInterface.dropTable('reports');
};
