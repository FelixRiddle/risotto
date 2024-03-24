/**
 * Get user
 * 
 * Different from protectRoute, because in this middleware the user is optional.
 */
import { Request, Response } from "express";

import { UserAPI } from "felixriddle.good-roots-ts-api";
import { CompleteUserData } from "felixriddle.my-types";

const GET_USER_DEBUG = false;

// Get user
export default async (req: Request, res: Response, next: any) =>  {
    // Validate token
    try {
        // Check token
        // Get and rename token
        let { _token: token } = req.cookies;
        
        if(token) {
            // Verify user
            let userData: CompleteUserData | undefined;
            try {
                // const jwtData = jwt.verify(token, process.env.JWT_SECRET_KEY);
                // decoded = jwtData;
                const userApi = await UserAPI.fromJWT(token);
                userData = await userApi.getUserData();
            } catch(err) {
                if(GET_USER_DEBUG) {
                    console.log(`The token couldn't be verified, maybe it has expired!`);
                }
            }
            
            if(!userData) return next();
            
            // Validate user
            const userModel = req.models.user();
            const user = await userModel.scope("deletePassword").findByPk(userData.id);
            
            // Store user on the request
            if(user) {
                req.user = user;
            } else {
                if(GET_USER_DEBUG) {
                    console.log(`The user doesn't exists`);
                }
            }
        } else {
            if(GET_USER_DEBUG) {
                console.log(`The token wasn't found!`);
            }
        }
    } catch(err) {
        if(GET_USER_DEBUG) {
            console.log(`Error when veryfing token`);
        }
    }
    
    // Regardless of whether the token was found or not
    return next();
}
