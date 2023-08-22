import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  // Add more fields if needed
});

const User = mongoose.model("User", userSchema);

export default User;
