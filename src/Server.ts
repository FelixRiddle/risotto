import ServerWrapper from "./ServerWrapper";
import cluster from 'cluster';
import OS from 'os';

import { isEmailDisabled } from "./env";
import { Router } from "express";

const numCPUs = OS.cpus().length;

/**
 * Create server
 */
export default class Server {
    routesMounted = false;
    server: ServerWrapper;
    
    constructor() {
        this.server = new ServerWrapper();
    }
    
    /**
     * Start cluster server
     */
    async startClusterServer() {
        // Clusters events
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
        
        let index = 1;
        cluster.on('listening', (worker, address) => {
            console.log(`Worker(${index}) ${worker.process.pid} listening`);
            index++;
        });
        
        // The primary will fork childs
        if(cluster.isPrimary) {
            console.log(`Number of CPUs: `, numCPUs);
            console.log(`Primary process pid: `, process.pid);
            console.log(`Is email disabled?: `, isEmailDisabled());
            
            // Fork processes
            for(let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
        } else {
            // Workers can share any TCP connection
            this.startServer();
        }
    }
    
    /**
     * Start single server
     */
    async startServer() {
        // Setup middleware, mount routes
        this.server.setup();
        
        // Serve
        await this.server.serve();
    }
    
    /**
     * Set server routes
     */
    mountRoutes(routes: Router) {
        if(this.routesMounted) {
            throw Error("You've tried to mount routes twice!");
        }
        
        this.server.mountRoutes(routes);
        
        this.routesMounted = true;
        
        return this;
    }
    
    /**
     * Express use
     * 
     * Alternative: Instead of doing this, you can use 'Router.use'
     */
    use(fn: any) {
        this.server.app.use(fn);
    }
}
