import { application } from "express";
import mongoose, { Schema } from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
    name : {
        type : String,
        minLength : 2,
        maxLength : 50,
        required : true
    },
    email : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        },
        lowercase: true
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is not Strong')
            }
        } 
    },
    role :{
       type : String,
       required : true,
       validate(value){
       if(!['Admin', 'Team Leader', 'Customer', 'Agent'].includes(value)){
            throw new Error(`${value} is not defined`)
       }
       }
    },
    mobileNumber:{
        type : Number    
    },
    applications:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Application'
        }
    ]
},{
    timeStamps: true
})

const UserModel = mongoose.model('User',userSchema)

export default UserModel