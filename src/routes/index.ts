// Servers must implement this route at the root part
import express from "express";

import srvRouter from "./srv/index";

const configRoutes = express.Router();

configRoutes.use("/srv", srvRouter);

export default configRoutes;
