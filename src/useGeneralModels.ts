import { Request, Response } from "express";

import { Models } from "felixriddle.ts-app-models";

/**
 * General models
 * 
 * This route will use a single instance of sequelize for every connection(How it should be).
 * 
 */
export default function useGeneralModels() {
    const models = new Models();
    
    // The middleware
    return function generalModelMiddleware(req: Request, res: Response, next: any) {
        // Every route will use models
        req.models = models;
        
        next();
    }
}
