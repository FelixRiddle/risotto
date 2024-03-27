import express from "express";

import Server from "../Server";
import { testCluster, testCluster2 } from "../test/testServer";

/**
 * Test open single authentication app server
 */
export async function singleAuthenticationApp() {
    const router = express.Router();
    
    router.get("/", (req, res) => {
        
    });
    
    const server = new Server('express-authentication');
    await server.mountRoutes(router)
        .startServer();
}

/**
 * Test open single good roots app server
 */
export async function singleGoodRootsApp() {
    const router = express.Router();
    
    router.get("/", (req, res) => {
        
    });
    
    const server = new Server('good-roots');
    await server.mountRoutes(router)
        .startServer();
}

/**
 * Run all tests
 */
export default async function executeTests(args: any) {
    // --- Single threaded servers ---
    if(args.test || args.open_single_authentication) {
        await singleAuthenticationApp();
    }
    
    if(args.open_single_good_roots) {
        await singleGoodRootsApp();
    }
    
    // --- Multi threaded servers ---
    if(args.test_cluster) {
        await testCluster();
    }
    
    if(args.test_cluster_2) {
        await testCluster2();
    }
}
