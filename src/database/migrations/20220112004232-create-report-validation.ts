import {QueryInterface, DataTypes} from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const up = async ({context}: {context: any}) => {
  const queryInterface =
    context.sequelize.getQueryInterface() as QueryInterface;
  await queryInterface.createTable('report_validations', {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const down = async ({context}: {context: any}) => {
  const queryInterface = context.getQueryInterface() as QueryInterface;
  await queryInterface.dropTable('report_validations');
};
