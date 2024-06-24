import { User } from '../model/messageModel.js';

const getFriends = async (req, res) => {
    try {
        const { username } = req.query; // Extract username from query parameters
 
        const user = await User.findOne({ username }); // Find user by username

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Extract friend usernames from user data
        const friends = user.friendAndChats.map(friend => friend.friendUserName);
 
        res.status(200).json(friends);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default getFriends
