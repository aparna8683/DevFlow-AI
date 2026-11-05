import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { triageBug } from "./agents/triageAgent.js";
import { investigateBug } from "./agents/debuggingAgent.js";
import { reviewFix } from "./agents/reviewAgent.js";

async function main() {
    const bugReport = `
Users cannot log in to the application.
After entering valid credentials, the login endpoint
returns HTTP 500. The issue started after the latest deployment.
`;

    console.log("\n🚀 DEVFLOW AI - ENGINEERING WORKFLOW");
    console.log("========================================");

    try {
        // STAGE 1: TRIAGE
        console.log("\n🤖 STAGE 1: TRIAGE AGENT");

        const triageResult = await triageBug(bugReport);

        console.log(JSON.stringify(triageResult, null, 2));

        // STAGE 2: DEBUGGING
        console.log("\n🔍 STAGE 2: DEBUGGING AGENT");

        const debuggingResult = await investigateBug(
            triageResult.bugSummary,
            process.cwd()
        );

        console.log(JSON.stringify(debuggingResult, null, 2));

        // STAGE 3: REVIEW
        console.log("\n🛡️ STAGE 3: REVIEW AGENT");

        // No actual patch or test evidence exists yet.
        // The Review Agent must not approve an unverified fix.
        const reviewResult = await reviewFix({
            proposedChanges: [],
            testResults: [],
            debuggingReport: debuggingResult
        });

        console.log(JSON.stringify(reviewResult, null, 2));

        // STAGE 4: HUMAN APPROVAL GATE
        console.log("\n🔐 STAGE 4: HUMAN APPROVAL GATE");

        if (!reviewResult.approved) {
            console.log(
                "\nExecution blocked: the proposed fix has not passed review."
            );
            console.log("No repository files were modified.");
            return;
        }

        const rl = createInterface({ input: stdin, output: stdout });

        try {
            const answer = await rl.question(
                "\nDo you approve the proposed changes? (yes/no): "
            );

            if (answer.trim().toLowerCase() !== "yes") {
                console.log("\nApproval denied. No changes executed.");
                return;
            }

            console.log(
                "\nHuman approval received. Execution can now be authorized."
            );
        } finally {
            rl.close();
        }

        console.log("\n========================================");
        console.log("DEVFLOW AI WORKFLOW COMPLETED");
        console.log("========================================");

    } catch (error) {
        console.error("\nWorkflow failed:", error.message);
        process.exitCode = 1;
    }
}

main();
