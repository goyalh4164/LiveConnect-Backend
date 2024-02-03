import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [{
    type: String,
    required: true,
  }],
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
