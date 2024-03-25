import { testServerRoute, testCluster } from "../test/testServer";

/**
 * Run all tests
 */
export default async function executeTests(args: any) {
    if(args.test) {
        testServerRoute();
    }
    
    if(args.test_cluster) {
        await testCluster();
    }
}
