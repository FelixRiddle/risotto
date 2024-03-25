import express from "express";

import { LocationSelection } from "felixriddle.location-selection";

const locationRouter = express.Router();

/**
 * Discovery route
 * 
 * When a request is received this will tell projects to update environment variables, or any
 * configuration that requires connecting to other servers.
 */
locationRouter.get("/update", (req, res) => {
    try {
        console.log(`GET /srv/update`);
        
        const loc = new LocationSelection();
        loc.updateLocationUrls();
        
        return res.send({
            serversUpdated: true,
            messages: []
        });
    } catch(err) {
        console.error(err);
        
        return res.send({
            serversUpdated: false,
            messages: []
        });
    }
})

export default locationRouter;
