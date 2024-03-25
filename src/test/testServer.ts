import express from "express";

import Server from "../Server";

/**
 * Test server route
 * 
 * This test was just to check that there are no types error
 */
export function testServerRoute() {
    const router = express.Router();
    
    router.get("/", (req, res) => {
        
    });
    
    const server = new Server('good-roots');
    server.mountRoutes(router)
        .startServer();
}

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
