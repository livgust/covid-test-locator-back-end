import {QueryInterface, DataTypes} from 'sequelize';

export const up = async ({context}: {context: QueryInterface}) => {
  await context.createTable('Reports', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    placeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'place',
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
  await context.dropTable('Reports');
};
