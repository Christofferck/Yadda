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
comments :{
    type  : [String],
    default : ""
} ,
user :{
    type  : Object,
    default : ""
}
});
const Post = mongoose.model('posts',PostSchema);

module.exports = {
  Post
}
