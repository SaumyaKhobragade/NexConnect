import ConnectionRequest from "../models/connections.model.js";
import User from "../models/users.model.js";

export const sendRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const userId = req.user._id;

        if (!targetUserId) {
            return res
                .status(400)
                .json({ message: "Target user ID is required" });
        }

        if (userId.toString() === targetUserId) {
            return res
                .status(400)
                .json({ message: "Cannot send request to yourself" });
        }

        const targetUser = await User.findOne({
            _id: targetUserId,
            active: true,
        });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check existing request in either direction
        const existing = await ConnectionRequest.findOne({
            $or: [
                { userId, connectionId: targetUserId },
                { userId: targetUserId, connectionId: userId },
            ],
        });

        if (existing) {
            if (existing.status_accepted === true) {
                return res
                    .status(400)
                    .json({ message: "Already connected" });
            }
            if (existing.status_accepted === null) {
                return res
                    .status(400)
                    .json({ message: "Request already pending" });
            }
            // Previously rejected — allow re-sending
            existing.userId = userId;
            existing.connectionId = targetUserId;
            existing.status_accepted = null;
            await existing.save();
            return res
                .status(200)
                .json({ message: "Connection request re-sent", request: existing });
        }

        const request = new ConnectionRequest({
            userId,
            connectionId: targetUserId,
        });
        await request.save();

        return res
            .status(201)
            .json({ message: "Connection request sent", request });
    } catch (err) {
        console.error("sendRequest error:", err);
        return res
            .status(500)
            .json({ message: "Failed to send request" });
    }
};

export const respondToRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body; // "accept" or "reject"

        if (!["accept", "reject"].includes(action)) {
            return res
                .status(400)
                .json({ message: "Action must be 'accept' or 'reject'" });
        }

        const request = await ConnectionRequest.findById(requestId);
        if (!request) {
            return res
                .status(404)
                .json({ message: "Request not found" });
        }

        // Only the recipient can respond
        if (request.connectionId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (request.status_accepted !== null) {
            return res
                .status(400)
                .json({ message: "Request already responded to" });
        }

        request.status_accepted = action === "accept";
        await request.save();

        const message =
            action === "accept"
                ? "Connection accepted"
                : "Connection rejected";
        return res.status(200).json({ message, request });
    } catch (err) {
        console.error("respondToRequest error:", err);
        return res
            .status(500)
            .json({ message: "Failed to respond to request" });
    }
};

export const getIncomingRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            connectionId: req.user._id,
            status_accepted: null,
        }).populate("userId", "name username email profilePicture");

        return res.status(200).json({ requests });
    } catch (err) {
        console.error("getIncomingRequests error:", err);
        return res
            .status(500)
            .json({ message: "Failed to fetch requests" });
    }
};

export const getOutgoingRequests = async (req, res) => {
    try {
        const requests = await ConnectionRequest.find({
            userId: req.user._id,
            status_accepted: null,
        }).populate("connectionId", "name username email profilePicture");

        return res.status(200).json({ requests });
    } catch (err) {
        console.error("getOutgoingRequests error:", err);
        return res
            .status(500)
            .json({ message: "Failed to fetch requests" });
    }
};

export const getMyConnections = async (req, res) => {
    try {
        const connections = await ConnectionRequest.find({
            $or: [
                { userId: req.user._id },
                { connectionId: req.user._id },
            ],
            status_accepted: true,
        })
            .populate("userId", "name username email profilePicture")
            .populate("connectionId", "name username email profilePicture");

        return res.status(200).json({ connections });
    } catch (err) {
        console.error("getMyConnections error:", err);
        return res
            .status(500)
            .json({ message: "Failed to fetch connections" });
    }
};

export const removeConnection = async (req, res) => {
    try {
        const { connectionId } = req.params;

        const connection = await ConnectionRequest.findOne({
            _id: connectionId,
            status_accepted: true,
            $or: [
                { userId: req.user._id },
                { connectionId: req.user._id },
            ],
        });

        if (!connection) {
            return res
                .status(404)
                .json({ message: "Connection not found" });
        }

        await ConnectionRequest.findByIdAndDelete(connectionId);
        return res.status(200).json({ message: "Connection removed" });
    } catch (err) {
        console.error("removeConnection error:", err);
        return res
            .status(500)
            .json({ message: "Failed to remove connection" });
    }
};
