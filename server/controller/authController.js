import Register from "../model/register.js";
import bcrypt from 'bcrypt';

const register = async (req, res) => {
    try {
        const { username, name, password,profileImage} = req.body;
        const existingUser = await Register.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Register({ username, name, password: hashedPassword ,profileImage});
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user", details: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Register.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "Username does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Password is incorrect" });
        }

        res.status(200).json({ message: "User logged in successfully", user: { username: user.username, name: user.name } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: "Failed to login user", details: error.message });
    }
};




export default { register, login }