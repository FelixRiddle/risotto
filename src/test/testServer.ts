import express from "express";

import Server from "../Server";

/**
 * Test cluster
 */
export async function testCluster() {
    const router = express.Router();
    
    router.get("/", (req, res) => {
    });
    
    const server = new Server('good-roots');
    await server.mountRoutes(router)
        .startClusterServer();
}

/**
 * Test another cluster
 */
export async function testCluster2() {
    const router = express.Router();
    
    router.get("/", (req, res) => {
    });
    
    const server = new Server('express-authentication');
    await server.mountRoutes(router)
        .startClusterServer();
}
