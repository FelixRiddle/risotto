import express from "express";

import { LocationSelection } from "felixriddle.location-selection";

const locationRouter = express.Router();

/**
 * Discovery route
 * 
 * When a request is received this will tell projects to update environment variables, or any
 * configuration that requires connecting to other servers.
 */
locationRouter.post("/update", (req, res) => {
    try {
        console.log(`POST /srv/location/update`);
        
        console.log(`Body: `, req.body);
        
        if(!req.body) {
            console.log(`No request body!`);
            return res.status(400).send({
                serversUpdated:false,
                messages: [{
                    message: "Request body empty",
                    error: true,
                }],
            });
        }
        
        const {
            appName
        } = req.body;
        
        // This updates every environment variable
        const loc = new LocationSelection(appName);
        loc.updateLocationUrls();
        
        console.log(`Authentication url: `, LocationSelection.expressAuthentication());
        console.log(`Backdoor url: `, LocationSelection.backdoorServerAccess());
        console.log(`Real estate url: `, LocationSelection.realEstate());
        
        return res.send({
            serversUpdated: true,
            messages: []
        });
    } catch(err) {
        console.error(err);
        
        return res.status(500).send({
            serversUpdated: false,
            messages: []
        });
    }
})

export default locationRouter;
