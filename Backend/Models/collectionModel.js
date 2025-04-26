const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('postgres://user:password@localhost:5432/mydb'); // your connection string

class Collection extends Model {}
Collection.init({
  collectionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  candidate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  programmingLanguage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  repositories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  repositoriesNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Collection',
  tableName: 'collections',
  timestamps: true,
});

class CollectionFile extends Model {}
CollectionFile.init({
  collectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Collection,
      key: 'id',
    },
  },
  fileId: {
    type: DataTypes.STRING(64),  // file_id is VARCHAR(64)
    allowNull: false,
  },
  addedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  sequelize,
  modelName: 'CollectionFile',
  tableName: 'collection_files',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['collectionId', 'fileId'],
    },
  ],
});

// Set up the association between the models
Collection.hasMany(CollectionFile, { foreignKey: 'collectionId' });
CollectionFile.belongsTo(Collection, { foreignKey: 'collectionId' });

module.exports = { Collection, CollectionFile, sequelize };
