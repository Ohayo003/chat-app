import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


const UsersSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
        default: []
    },
},{ collection: 'users' , timestamps: true}
)
// UsersSchema.plugin( uniqueValidator, { message: 'Email already Exist '});
export default mongoose.model("Users", UsersSchema);