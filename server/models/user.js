import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: 'Name field cannot be empty.' },
        is: /^[a-z ]+$/i,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          message: 'Please input a valid email address.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Password field cannot be empty.',
        }
      },
    },
    roleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          as: 'documents',
        });

        User.belongsTo(models.Role, {
          foreignKey: 'roleType',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  User.beforeCreate((user) => {
    user.email = user.email.toLowerCase();
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });
  User.beforeUpdate((user) => {
    if (user._changed.password) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    }
  });
  return User;
};
