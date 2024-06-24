import mongoose from "mongoose";

const {Schema} =mongoose;

const registerSchema = new Schema({
    username:{type:String,unique:true},
    name:{type:String,required:true},
    password:{type:String,required:true}

});


const userSchema  = new Schema({
    username: [],

})

const Register =  mongoose.model('Register', registerSchema);
export default Register;






