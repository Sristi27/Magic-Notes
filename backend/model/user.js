const mongoose = require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
 
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
    
});

userSchema.plugin(uniqueValidator);
//validation of checking if 2 users have same email

module.exports=mongoose.model('User',userSchema);