const {Schema, model} = require('mongoose');

const BlogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    ip: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expireAfterSeconds: 86400 // 1 day
    }
})

module.exports = model('BlogViews', BlogSchema);