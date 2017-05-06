// Model for Collection posts

const mongoose = require('mongoose');

const postSchmea = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    author: {
        firstName: String,
        lastName: {type: String, required: true}
    },
    content: {type: String, required: true}
});

const Posts = mongoose.model('posts', postSchmea);
module.exports = {Posts};
