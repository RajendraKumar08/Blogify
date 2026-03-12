const { Schema, model } = require('mongoose');

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  discription: {
    type: String
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdBy : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

module.exports = model('Blog', BlogSchema);
