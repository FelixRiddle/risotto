// Typescript compiles ok with this file
// But on VSCode it shows like it's an error, moving it to the index.ts fixed it.
import { Models } from "felixriddle.ts-app-models";

declare global {
    namespace Express {
        export interface Request {
            models: Models,
        }
    }
}

