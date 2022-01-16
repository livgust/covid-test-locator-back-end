import {QueryInterface, DataTypes} from 'sequelize';

export const up = async ({context}: {context: QueryInterface}) => {
  await context.createTable('report_validations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    report_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'reports',
        key: 'id',
      },
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
  await context.dropTable('report_validations');
};
