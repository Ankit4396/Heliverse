const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String
    }
},
{
    timestamps: true
}


);

const User = mongoose.model('User',userSchema,'Users');
module.exports = User;
