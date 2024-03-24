import { Models } from "felixriddle.ts-app-models";

import Server from "./Server";

// Here extending works fine
declare global {
    namespace Express {
        export interface Request {
            models: Models,
        }
    }
}

export {
    Server
}
