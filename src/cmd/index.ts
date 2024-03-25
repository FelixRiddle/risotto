import { ArgumentParser } from "argparse";

import executeTests from "./test";

const parser = new ArgumentParser({
    description: "Argparse example"
});

parser.add_argument("--test", {
    help: "Execute tests",
    action: "store_true"
});

parser.add_argument("--test-cluster", {
    help: "Start a cluster server",
    action: "store_true"
});

/**
 * Execute commands
 */
export default async function executeCommands() {
    const args = parser.parse_args();

    await executeTests(args);
    
    // process.exit(0);
};

executeCommands();
