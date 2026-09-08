import User from "../models/User.model.js";

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const results = await User.find().select("-password").lean();
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  },
};

export default userController;