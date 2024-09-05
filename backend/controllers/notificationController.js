const asyncHandler = require('express-async-Handler');
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

// Function to create a notification
const createNotification = asyncHandler(async (req, res) => {
    const { userId, chatId, message } = req.body;

    if (!userId || !chatId || !message) {
        res.status(400);
        throw new Error("Incomplete notification data");
    }

    try {
        const newNotification = new Notification({
            user: userId,
            chat: chatId,
            message: message._id,
        });

        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Function to get notifications for a user
const getNotifications = asyncHandler(async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .populate("chat")
            .populate("message")
            .populate("user", "name pic email");

        res.json(notifications);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Function to delete a notification after it has been read
const deleteNotification = asyncHandler(async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { createNotification, getNotifications, deleteNotification };
