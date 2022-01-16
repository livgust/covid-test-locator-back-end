import {QueryInterface, DataTypes} from 'sequelize';

export const up = async ({context}: {context: QueryInterface}) => {
  await context.createTable('reports', {
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
  await context.dropTable('reports');
};
