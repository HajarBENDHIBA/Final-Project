import User from '../models/User.js'; 

// Controller function to get all users
export const getAllUsers = async (req, res) => {
    try {
      // Assuming users have a role field or isAdmin field to differentiate regular users from admins
      const users = await User.find({ role: 'user' }); // Change role: 'user' if you're using a different field to identify users
      
      // Only include the necessary fields, like username and email
      const userList = users.map(user => ({
        username: user.username,
        email: user.email,
        _id: user._id,
      }));
  
      res.json(userList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Controller function to delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};