const mongoose = require("mongoose");

const connectMongoDB = () => {
    console.log('Connecting to MongoDB ...')
    mongoose.connect(
        process.env.MONGODB_URI,
      {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
    )
    .then(() => {
      console.log('MongoDB connection SUCCESS');
    })
    .catch((err) => {
      console.error('MongoDB connection FAIL', err)
    });
}

module.exports = {connectMongoDB}