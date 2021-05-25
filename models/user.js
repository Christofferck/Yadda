const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  username :{
      type  : String,
      required : true,
  } ,
  email :{
    type  : String,
    required : true
} ,
password :{
    type  : String,
    required : true
} ,
gender :{
    type  : String,
    required : true
} ,
profileImage :{
    type  : String,
    default : "public/img/default_profile.jpg"
} ,
coverPhoto :{
    type  : String,
    default : "public/img/default_cover.jpg"
} ,
dob :{
    type  : String,
    default : ""
} ,
city :{
    type  : String,
    default : ""
} ,
country :{
    type  : String,
    default : ""
} ,
aboutMe :{
    type  : String,
    default : ""
} ,
following :{
    type : [String],
},
posts :{
    type : [String],
    default : ""
},
emailToken :{
    type : String
},
isVerified :{
    type : Boolean,
    required : true,
},
accessToken :{
    type : String,
    default : ""
}
});
const User = mongoose.model('users',UserSchema);

module.exports = {
  User
}
