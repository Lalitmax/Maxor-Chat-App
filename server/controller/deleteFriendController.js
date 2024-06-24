import { User } from '../model/messageModel.js';

const deleteFriend = async (req, res) => {
  try {
    const { username, friendUserName } = req.query;

    // Find the user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Filter out the friend from the user's friendAndChats array
    user.friendAndChats = user.friendAndChats.filter(friend => friend.friendUserName !== friendUserName);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: `Friend ${friendUserName} deleted successfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export default deleteFriend;
