import {QueryInterface, DataTypes} from 'sequelize';

export const up = async ({context}: {context: QueryInterface}) => {
  await context.createTable('Places', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    googlePlaceId: {
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
    createdBy: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};
export const down = async ({context}: {context: QueryInterface}) => {
  await context.dropTable('Places');
};
