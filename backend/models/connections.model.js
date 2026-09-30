import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        connectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status_accepted: {
            type: Boolean,
            default: null, // null = pending, true = accepted, false = rejected
        },
    },
    { timestamps: true },
);

// Prevent duplicate requests in the same direction
connectionRequestSchema.index(
    { userId: 1, connectionId: 1 },
    { unique: true },
);

const ConnectionRequest = mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema,
);

export default ConnectionRequest;
