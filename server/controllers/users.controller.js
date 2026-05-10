const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({}).select("-salt -hash");
    res.json({ success: true, users });
});

module.exports.updateUserRole = catchAsync(async (req, res, next) => {
    const { role } = req.body;
    
    if (!['citizen', 'admin'].includes(role)) {
        throw new ExpressError(400, "Invalid role specified.");
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-salt -hash");
    
    if (!user) {
        throw new ExpressError(404, "User not found");
    }
    res.json({ success: true, message: "User role updated successfully", user });
});

module.exports.getUserStats = catchAsync(async (req, res, next) => {
    const totalUsers = await User.countDocuments();
    res.json({ success: true, totalUsers });
});

module.exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    if (id === req.user.id) {
        throw new ExpressError(400, "You cannot delete your own admin account.");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ExpressError(404, "User not found.");
    }

    await User.findByIdAndDelete(id);
    
    res.json({ success: true, message: "User deleted successfully." });
});
