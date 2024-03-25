// Servers must implement this route at the root part
import express from "express";

import locationRouter from "./location";

const srvRouter = express.Router();

srvRouter.use("/location", locationRouter);

export default srvRouter;
