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

parser.add_argument("--test-cluster-2", {
    help: "Start cluster 2",
    action: "store_true"
});

// Test open single threaded servers
parser.add_argument("--open-single-authentication", {
    help: "Opens a single threaded authentication app",
    action: "store_true"
});

parser.add_argument("--open-single-good-roots", {
    help: "Opens a single threaded good roots app",
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
