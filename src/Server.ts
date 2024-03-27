import { Router } from "express";
import cluster from 'cluster';
import OS from 'os';

import { AppNames } from "felixriddle.my-types";

import { isEmailDisabled } from "./env";
import ServerWrapper from "./ServerWrapper";

const numCPUs = OS.cpus().length;

export interface ServerOptions {
    allFetchUser: boolean,
}

/**
 * Create server
 */
export default class Server {
    appName: AppNames;
    routesMounted = false;
    server: ServerWrapper;
    options: ServerOptions;
    
    /**
     * allFetchUser: Try to fetch the user for every route
     */
    constructor(appName: AppNames, options: ServerOptions = {
        allFetchUser: true,
    }) {
        this.appName = appName;
        this.server = new ServerWrapper();
        
        this.options = options;
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
        // Serve
        await this.server.serve(this.appName);
    }
    
    /**
     * Set server routes
     */
    mountRoutes(routes: Router) {
        // This has to run before anything else
        // Setup middleware, mount routes
        this.server.setup();
        
        if(this.routesMounted) {
            throw Error("You've tried to mount routes twice!");
        }
        
        this.server.mountRoutes(routes, this.options);
        
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
