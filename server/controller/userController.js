import { User } from '../model/messageModel.js';

// User controller
const userController = async (req, res) => {
    try {
        const { username, friendUserName, chat } = req.body;
        // Find existing user
        let existingUser = await User.findOne({ username });

        if (existingUser) {
            let friendExists = false;
            // Check if the friend already exists
            for (let friend of existingUser.friendAndChats) {
                if (friend.friendUserName === friendUserName) {
                    friendExists = true;
                    // Add new chat to the existing friend's chats
                    friend.chats.push(chat);
                    break;
                }
            }

            if (!friendExists) {
                // If friend does not exist, add a new friend with the initial chat
                existingUser.friendAndChats.push({
                    friendUserName,
                });
                // Save the updated user
                await existingUser.save();
                return res.status(200).json({ message: 'Friend Added Successfully' });

            }

            // Save the updated user
            await existingUser.save();
            res.status(200).json({ message: 'User and chats updated successfully.' });

        } else {
            // Create a new user with the friend and chat
            const newUser = new User({
                username,
                friendAndChats: [{
                    friendUserName,
                    chats: [chat]
                }]
            });

            // Save the new user
            await newUser.save();
            res.status(201).json({ message: 'New user and chats created successfully.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export default userController;
