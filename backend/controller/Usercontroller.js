import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import crypto from "crypto";
import userModel from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getWelcomeTemplate } from "../email.js";
import { getPasswordResetTemplate } from "../email.js";

const backendurl = process.env.BACKEND_URL;

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Registeruser = await userModel.findOne({ email });
    if (!Registeruser) {
      return res.json({ message: "E-posta bulunamadı", success: false });
    }
    const isMatch = await bcrypt.compare(password, Registeruser.password);
    if (isMatch) {
      const token = createtoken(Registeruser._id);
      return res.json({ token, user: { name: Registeruser.name, email: Registeruser.email }, success: true });
    } else {
      return res.json({ message: "Geçersiz şifre", success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Sunucu hatası", success: false });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.json({ message: "Geçersiz e-posta", success: false });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Bu e-posta adresi zaten kayıtlı", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();
    const token = createtoken(newUser._id);

    // send email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to BuildEstate - Your Account Has Been Created",
      html: getWelcomeTemplate(name)
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Email gönderme hatası:", emailError);
      // Email hatası olsa bile kayıt başarılı sayılır
    }

    return res.json({ token, user: { name: newUser.name, email: newUser.email }, success: true });
  } catch (error) {
    console.error(error);
    // MongoDB duplicate key error check
    if (error.code === 11000) {
      return res.json({ message: "Bu e-posta adresi zaten kayıtlı", success: false });
    }
    return res.json({ message: "Sunucu hatası", success: false });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "E-posta bulunamadı", success: false });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.WEBSITE_URL}/reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset - BuildEstate Security",
      html: getPasswordResetTemplate(resetUrl)
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "E-posta gönderildi", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sunucu hatası", success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Geçersiz veya süresi dolmuş token", success: false });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "Şifre başarıyla sıfırlandı", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sunucu hatası", success: false });
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, success: true });
    } else {
      return res.status(400).json({ message: "Geçersiz kimlik bilgileri", success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sunucu hatası", success: false });
  }
};

const logout = async (req, res) => {
    try {
        return res.json({ message: "Çıkış yapıldı", success: true });
    } catch (error) {
        console.error(error);
        return res.json({ message: "Sunucu hatası", success: false });
    }
};

// get name and email

const getname = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    return res.json(user);
  }
  catch (error) {
    console.error(error);
    return res.json({ message: "Sunucu hatası", success: false });
  }
}



export { login, register, forgotpassword, resetpassword, adminlogin, logout, getname };