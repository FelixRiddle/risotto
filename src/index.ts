import { CompleteUserData } from "felixriddle.my-types"
import { Models } from "felixriddle.ts-app-models";

import authenticatedUserProtection from "./middleware/auth/public/authenticatedUserProtection";
import publicGetUser from "./middleware/auth/public/publicGetUser";
import Server from "./Server";

// Here extending works fine
declare global {
    namespace Express {
        export interface Request {
            models: Models,
            user?: CompleteUserData,
        }
    }
}

export {
    Server,
    
    authenticatedUserProtection,
    publicGetUser,
}
