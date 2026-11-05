export async function reviewFix({
    proposedChanges = [],
    testResults = [],
    debuggingReport = {}
}) {
    const findings = [];
    const risks = [];

    if (proposedChanges.length === 0) {
        findings.push("No proposed code changes were provided.");
        risks.push("There is no implementation to review.");
    }

    if (testResults.length === 0) {
        findings.push("No test results were provided.");
        risks.push("The proposed fix has not been validated by test evidence.");
    }

    const failedTests = testResults.filter(
        test => test.status === "failed"
    );

    if (failedTests.length > 0) {
        findings.push(`${failedTests.length} test(s) failed.`);
        risks.push("The proposed changes may introduce or leave defects.");
    }

    if (!debuggingReport.rootCause ||
        debuggingReport.rootCause === "Not established. Source-code evidence is required.") {
        findings.push("The root cause has not been established.");
        risks.push("The proposed fix may address symptoms rather than the actual cause.");
    }

    const approved =
        proposedChanges.length > 0 &&
        testResults.length > 0 &&
        failedTests.length === 0 &&
        risks.length === 0;

    return {
        reviewStatus: approved ? "APPROVED" : "CHANGES_REQUIRED",
        approved,
        findings,
        risks,
        recommendation: approved
            ? "The changes passed the available review checks. Human approval is still required before merging."
            : "Do not merge yet. Resolve the findings and provide supporting evidence.",
        humanApprovalRequired: true
    };
}
