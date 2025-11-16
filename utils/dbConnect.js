const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB(uri) {
	const mongoUri = uri || process.env.MONGO_URI;
	if (!mongoUri) {
		throw new Error('MONGO_URI is not defined');
	}
	return mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

async function disconnectDB() {
	return mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB, mongoose };
