const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, disconnectDB } = require('../utils/dbConnect');
let mongod;

module.exports = async () => {};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  process.env.WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'dummy';
  await connectDB(uri);
});

afterAll(async () => {
  await disconnectDB();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  const { mongoose } = require('../utils/dbConnect');
  const collections = Object.keys(mongoose.connection.collections);
  for (const collName of collections) {
    await mongoose.connection.collections[collName].deleteMany({});
  }
});
