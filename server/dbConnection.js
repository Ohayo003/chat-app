
import Mongoose from 'mongoose';

var url = "mongodb://localhost:27017/Chat-App-db";
var connection_URL = 'mongodb+srv://Ohayo003:zde57LkyLqDRtyER@cluster0.ow6qx.mongodb.net/Chat-App-db?retryWrites=true&w=majority'

const connectDB = () =>  Mongoose.connect(connection_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

export default connectDB

