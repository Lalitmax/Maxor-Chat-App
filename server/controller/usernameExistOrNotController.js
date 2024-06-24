
import Register from "../model/register.js";

const isUserExistOrNot = async (req, res) => {
    try {
        const { username } = req.query;
        const existingUser = await Register.findOne({username} );
        if (existingUser) {
            return res.status(200).json({ exist: true });
        }
        res.status(200).json({ exist: false });
    } catch (error) {
        console.error('Error checking if user exists:', error);
        res.status(500).json({ error: "Failed to check if user exists" });
    }
};

export default isUserExistOrNot;


 







