import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please an email"], 
    unique: true,
    lowercase: true,
    validate: [validator.isEmail,"please Enter the valid email"]
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
}); 
//fire a function after doc saved to db 
UserSchema.pre('save',async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt)
  
}) 

const User = mongoose.model('User', UserSchema)

export default User;