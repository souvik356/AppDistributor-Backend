import validator from "validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password,role,mobileNumber } = req.body;
    if (!name || !email || !password || !role || !mobileNumber) {
      return res.status(400).json({
        message: "please provide field",
        error: true,
        success: false,
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "please provide valid email",
        error: true,
        success: false,
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "please provide valid password",
        error: true,
        success: false,
      });
    }

    const isEmailInDb = await UserModel.findOne({ email: email });

    if (isEmailInDb) {
      return res.status(400).json({
        message: "user is already registered",
        error: true,
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    const user = new UserModel({
      name,
      email,
      password: hashPassword,
      role,
      mobileNumber
    });

    const savedData = await user.save();

    return res.json({
      message: `user is registered successfully`,
      data: savedData,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "please provide all fields",
        error: true,
        success: false,
      });
    }

    const userInDb = await UserModel.findOne({ email : email})

    if(!userInDb){
        return res.status(400).json({
            message: "you are not registered please register",
            error: true,
            success: false,
          });
    }
    // console.log(userInDb.password);

    const isPasswordValid = await bcrypt.compare(password,userInDb.password)
    // console.log("is password valid",isPasswordValid);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid credentials",
            error: true,
            success: false,
          });
    }

    const token = await jwt.sign({userId : userInDb._id},process.env.SECRET_KEY)    // code for generating token

    res.cookie('accessToken',token,{
        expiresIn : '7d'
    })
 
    return res.json({
        message: `${userInDb.name} is Logged in successfull`,
        error: false,
        data : token,
        success: true,
        userDetail : userInDb
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const logOutController = async (req,res) => {
    try {
        const loggedInUser = req.user

        res.clearCookie("accessToken")

        return res.json({
            message : `${loggedInUser.name} is logged out`,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({ 
            message: error.message || error,
            error: true,
            success: false,
          });
    }
    
} 

export const getLoggedInUser = async (req,res) => {
  try {
    const loggedInUser = req.user

    const userDetail = await UserModel.findById(loggedInUser._id)

    if(!userDetail){
      return res.status(400).json({
        message : 'User not found',
        success : false,
        error : true
      })
    }
    return res.json({
      message : userDetail,
      success : true,
      error: false
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      error:true,
      message: error.message || error,
    })
  }
}