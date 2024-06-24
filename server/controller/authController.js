import Register from "../model/register.js";

const register = async (req, res) => {
    try {
        const { username, name, password } = req.body;
        const existingUser = await Register.findOne({ username })
        if (existingUser) {
            return res.status(201).json({ message: "User already exists" });
        }
        // if user doesn't exist, register the new user
        const newUser = new Register({ username, name, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({ error: "Failed to register user",error});
    }
}

const login = async (req, res) => {
     try{
        const {username,password} = req.body;
        const newUser = {username,password};
        const user = await Register.findOne({ username })
        if (!user) {
            console.log('user in')
            return res.status(201).json({ error: "username not exist" });
        }else{
            if(user.password!=password){
                console.log('pp in')
                return res.status(201).json({ error: "Password incorrect" });
            }else{
                console.log('Go to home page')
                res.status(201).json({ message: "User Login successfully",newUser});
            }
        }
     }catch(error){
        console.error('Error login user:', error);
        res.status(500).json({ error: "Failed to login user" });
     }
}




export default { register, login }