import bodyParser from "body-parser";
import cors from 'cors';
import express, { Express } from 'express';
import cookieParser from "cookie-parser";

import { SERVERS_DEFAULT_LOCATION, PublicFolder } from "felixriddle.configuration-mappings";
import { LocationSelection } from "felixriddle.location-selection";
import { AppNames, ServersLocation } from "felixriddle.my-types";

import { ServerOptions } from "./Server";
import useGeneralModels from './useGeneralModels';
import { publicGetUser } from "./index";
import configRoutes from "./routes/index";

/**
 * Server
 */
export default class ServerWrapper {
    app: Express;
    
    constructor() {
        const app = express();
        this.app = app;
    }
    
    /**
     * Start serving requests
     */
    async serve(appName: AppNames) {
        console.log(`Starting to serve`);
        // Complete implementation of port(env, default and ephemeral) management
        const locSelector = new LocationSelection(appName);
        
        try {
            // This updates server environment variables
            locSelector.updateLocationUrls();
        } catch(err) {
            // Ignore
        }
        
        // We will use any location
        await locSelector.selectConfigOverEphemeral(this.app);
    }
    
    /**
     * Serve on default port
     */
    async serveDefaultPort(appName: AppNames) {
        const serverLocation: string = SERVERS_DEFAULT_LOCATION[appName as keyof ServersLocation];
        const location = new URL(serverLocation);
        this.app.listen(location.port, () => {
            console.log(`Serving at ${serverLocation}`);
        });
    }
    
    /**
     * Setup all
     */
    setup() {
        this.setupMiddleware();
        
        // Public user folder, so they upload thingies
        // createPublicUserFolder();
        const publicFolder = new PublicFolder();
        publicFolder.create();
    }
    
    /**
     * Mount routes
     */
    mountRoutes(routes: express.Router, options: ServerOptions) {
        console.log(`Mount routes`);
        // Use a single instance of sequelize for every connection
        this.app.use(useGeneralModels());
        
        // For every route, try to fetch the user
        // this.app.use(getUser, routes);
        if(options.allFetchUser) {
            this.app.use(publicGetUser, routes);
        } else {
            this.app.use(routes);
        }
        
        // Configuration route
        this.app.use(configRoutes);
    }
    
    /**
     * Enable CSP
     * 
     * TODO: Eval should be removed, but there's a package that uses it, I don't even know which one.
     * TODO: A lot of things should be banned, that's the point of CSP.
     */
    enableCsp() {
        // CSP policy
        let cspPolicy = (() => {
            // Array of allowed domains
            // Note that subdomains are disallowed by default, so you must set the star
            // to allow every subdomain.
            let allowedDomains = [
                "unpkg.com",
                "*.unpkg.com",
                "openstreetmap.org",
                "*.openstreetmap.org",
                "cloudflare.com",
                "*.cloudflare.com",
                "cdnjs.cloudflare.com",
                "geocode-api.arcgis.com",
                "cdn.jsdelivr.net",
                // My domains
                "*.perseverancia.com.ar",
                "perseverancia.com.ar",
            ];
            
            // Add domains to the list
            let domains = "";
            for(let domain of allowedDomains) {
                domains += `${domain} `;
            }
            
            // Unsafe things
            // let scriptSrc = `script-src ${domains}'self' 'unsafe-eval' 'unsafe-inline';`;
            // let styleSrc = `style-src ${domains}'self' 'unsafe-inline';`;
            // let defaultSrc = `default-src ${domains}'self' 'unsafe-eval' 'unsafe-inline';`;
            
            // A lil more safe
            let scriptSrc = `script-src ${domains}'self';`;
            let styleSrc = `style-src ${domains}'self';`;
            let imgSrc = `img-src ${domains}'self' data:;`;
            let defaultSrc = `default-src ${domains}'self';`;
            let fontAndFrame = "font-src 'self'; frame-src 'self';";
            
            let cspPolicy = `${fontAndFrame} ${defaultSrc} ${scriptSrc} ${styleSrc} ${imgSrc}`;
            
            return cspPolicy;
        })();
        
        // Set CSP
        this.app.use((req, res, next) => {
            res.setHeader(
                'Content-Security-Policy',
                cspPolicy
            );
            next();
        });
    }
    
    /**
     * Setup some things
     */
    setupMiddleware() {
        this.enableCsp();
        
        // Parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));
        
        // Parse application/json
        this.app.use(bodyParser.json())
        console.log(`Json middleware parser setup`);
        
        // Enable cookie parser
        this.app.use(cookieParser());
        
        const URL = LocationSelection;
        
        // Cors whitelist
        const whitelist = [
            SERVERS_DEFAULT_LOCATION['backdoor-server-access'],
            SERVERS_DEFAULT_LOCATION['express-authentication'],
            SERVERS_DEFAULT_LOCATION['express-real-estate'],
            SERVERS_DEFAULT_LOCATION['good-roots'],
            
            URL.expressAuthentication(),
            URL.backdoorServerAccess(),
            URL.realEstate(),
            
            "http://localhost:3000",
            "http://localhost:3003",
            "http://localhost:3004"
        ];
        
        // And another one
        const nextFrontendUrl = process.env.GOOD_ROOTS_NEXT_FRONTEND_URL;
        if(nextFrontendUrl) whitelist.push(nextFrontendUrl);
        // Forget it, when it causes trouble I'll make a whole library for it hehe
        // else console.log(`Warning: Next frontend url not found!!!`);
        
        this.app.use(cors({
            credentials: true,
            origin: [
                ...whitelist,
            ]
        }));
        
        // Enable cookie parser
        // this.app.use(cookieParser());
        console.log(`Middleware setup`);
    }
};
