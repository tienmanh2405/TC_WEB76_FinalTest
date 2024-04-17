import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createUser = async (req, res) => {
    try {
        const { userName, password, email, gender, dayOfBirth, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ userName, password: hashedPassword, email, gender, dayOfBirth, phoneNumber });
        await newUser.save();
        res.status(201).json({ msg: "User created successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { userName, password, email, gender, dayOfBirth, phoneNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateUser = await UserModel.findByIdAndUpdate(userId, { userName, password: hashedPassword, email, gender, dayOfBirth, phoneNumber }, { new: true });
        if (!updateUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User updated successfully", user: updateUser });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "User deleted successfully", user: deletedUser });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await UserModel.findOne({ email });
        if (!checkUser) throw new Error('User not found');
        const isValidPassword = await bcrypt.compare(password, checkUser.password);
        if (!isValidPassword) throw new Error('incorrect account password');

        const secretKey = process.env.secretKey;
        const token = jwt.sign({ userId: checkUser._id }, secretKey, { expiresIn: '1h' });
        res.json({ msg: "Sign up success", token });
    } catch (error) {
        res.status(400).json({ msg: error.error });
    }
}

export {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    login
}
