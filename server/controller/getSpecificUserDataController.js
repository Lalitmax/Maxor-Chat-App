import { User } from '../model/messageModel.js';

const getSpecificUserData = async (req, res) => {
    try {
        const { username, friendUserName } = req.query;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the friend within the user's friendAndChats array
        const friendData = user.friendAndChats.find(friend => friend.friendUserName === friendUserName);

        if (!friendData) {
            return res.status(404).json({ message: 'Friend not found.' });
        }

        // Extract the chats for the specific friend
        const friendChats = friendData.chats;
        console.log(friendData.chats)
        res.status(200).json(friendChats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default getSpecificUserData;
