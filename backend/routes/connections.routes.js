import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    sendRequest,
    respondToRequest,
    getIncomingRequests,
    getOutgoingRequests,
    getMyConnections,
    removeConnection,
} from "../controllers/connections.controller.js";

const router = Router();

// All connection routes require authentication
router.use(auth);

router.post("/request", sendRequest);
router.put("/request/:requestId", respondToRequest);
router.get("/requests/incoming", getIncomingRequests);
router.get("/requests/outgoing", getOutgoingRequests);
router.get("/", getMyConnections);
router.delete("/:connectionId", removeConnection);

export default router;
