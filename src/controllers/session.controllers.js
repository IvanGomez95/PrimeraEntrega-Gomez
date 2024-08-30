import { createToken } from "../utils/jwt.js";
import { respUserDto } from "../dto/user.dto.js";

const newUser = async (req, res) => {
    try {
      res.status(201).json({ status: "OK", msg: "User has been created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
      const token = createToken(req.user);
  
      res.cookie("token", token, { httpOnly: true });
      
      return res.status(200).json({ status: "OK", payload: req.user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};


const loginGoogle = async (req, res) => {
    try {
      return res.status(200).json({ status: "OK", payload: req.user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
  };

//*Aquí se aplica el DTO que no muestra la contraseña ni el mail.
const currentSession = async (req, res) => {
    try {
      const userDto = respUserDto(req.user);
      res.status(200).json({ status: "OK", user: userDto });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
  }


export default {
    newUser,
    loginUser,
    loginGoogle,
    currentSession
};

