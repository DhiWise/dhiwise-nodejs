const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

(async () => {
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'nodejs-code-generator',
      dbPath: path.join(__dirname, 'database'),
      storageEngine: 'wiredTiger',
    },
  });
  mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  const db = mongoose.connection;

  db.once('open', () => {
    // console.log('Connection Successful');
  });

  db.on('error', () => {
    // console.log('Error in mongodb connection');
  });
})();
module.exports = mongoose;
