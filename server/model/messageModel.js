

import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for individual chat messages
const chatSchema = new Schema({
  text: { type: String, required: true },
  self: { type: Boolean, required: true }
}, { _id: false });

// Schema for friends and their associated chats
const friendAndChatsSchema = new Schema({
  friendUserName: { type: String, required: true },
  profileImage:{type:String,required:true},
  chats: [chatSchema]
}, { _id: false });

// Main User schema
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  friendAndChats: [friendAndChatsSchema]
});

const User = mongoose.model('User', userSchema);

export { User };
















