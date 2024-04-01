import { Request, Response } from "express";

import { UserAPI } from "felixriddle.good-roots-ts-api";

const PROTECT_ROUTE_DEBUG = true;

/**
 * Authenticated user protection
 * 
 * Protect route the only thing it does is to verify that a user is logged in, it doesn't have any
 * role checking, admin checking or security clearance checking.
 * 
 * Rules:
 * 1) This is supposed to be executed on other apps, so we can't use jwt.verify
 * 
 */
export default async (req: Request, res: Response, next: any) =>  {
    try {
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        // If there's no token, return error
        if(!token) {
            if(PROTECT_ROUTE_DEBUG) {
                console.log(`No token found`);
            }
            
            return res.send({
                messages: [{
                    error: true,
                    message: "No token found"
                }]
            });
        }
        
        // Fetch the user
        console.log(`Token: `, token);
        const userApi = await UserAPI.fromJWT(token);
        const user = await userApi.getUserData();
        console.log(`Found user on the database: `, user);
        
        // Validate that the user exists
        // The token should be decoded and the user validated before even validating the signature
        
        // Store user on the request
        if(user && user.email) {
            req.user = user;
        } else {
            if(PROTECT_ROUTE_DEBUG) {
                console.log(`User not existent`);
            }
            
            return res.send({
                messages: [{
                    error: true,
                    message: "User doesn't exists"
                }]
            });
        }
        
        return next();
    } catch(err) {
        if(PROTECT_ROUTE_DEBUG) {
            console.log(`Protect route middleware error`);
            console.error(err);
        }
        
        return res.status(401).send({
            messages: [{
                error: true,
                message: "Authentication error"
            }]
        });
    }
}
