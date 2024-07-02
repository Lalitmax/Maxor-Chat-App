
import Register from "../model/register.js";

const getUserProfileImage = async (req, res) => {
    try {
        const { username } = req.query;
        const existingUser = await Register.findOne({username} );
        if (existingUser) {
            return res.status(200).json({ profileImage: existingUser.profileImage });
        }
        res.status(401).json({ error: "User img not Found" });
    } catch (error) {
        console.error('Error while get imageril:', error);
        res.status(500).json({ error: "Faild to get imageUrl" });
    }
};

export default getUserProfileImage;


 







