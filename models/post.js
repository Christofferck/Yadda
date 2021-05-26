const mongoose = require('mongoose');
const PostSchema  = new mongoose.Schema({
  caption :{
      type  : String,
      default : ""
  } ,
  image :{
      type  : String,
      default : ""
  } ,
  video :{
    type  : String,
    default : ""
} ,
type :{
    type  : String,
    default : ""
} ,
createdAt :{
    type  : Date,
    default : Date.now
} ,
comments :[{
    user: {
      _id: {
        type: String
      },
      name: {
        type: String
      },
      profileImage: {
        type: String
      }
    },
    comment :{
        type  : String,
    createdAt :{
        type  : Date,
        default : Date.now
      },
    },
    type: Array
  },

],
user :{

    _id: {
      type: String
    },
    name: {
      type: String
    },
    username: {
      type: String
    },


    type  : Object,
}
});
const Post = mongoose.model('posts',PostSchema);

module.exports = {
  Post
}
