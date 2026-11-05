export async function triageBug(bugReport) {
    const report = bugReport.toLowerCase();

    let severity = "Low";
    let affectedModule = "Unknown";
    const evidence = [];
    const missingInformation = [];

    if (report.includes("500") || report.includes("server error")) {
        severity = "High";
        evidence.push("Server returned an HTTP 500 error.");
    }

    if (report.includes("login") || report.includes("authentication")) {
        affectedModule = "Authentication";
        evidence.push("The reported issue affects user login.");
    }

    if (report.includes("data loss") || report.includes("data corruption")) {
        severity = "Critical";
        evidence.push("The report mentions possible data loss or corruption.");
    }

    if (report.includes("all users") || report.includes("system outage")) {
        severity = "Critical";
        evidence.push("The report indicates broad service impact.");
    }

    if (!report.includes("expected behavior")) {
        missingInformation.push("Expected behavior before the failure.");
    }

    if (!report.includes("logs")) {
        missingInformation.push("Relevant application and server logs.");
    }

    if (!report.includes("steps to reproduce")) {
        missingInformation.push("Detailed reproduction steps.");
    }

    return {
        bugSummary: bugReport.trim(),
        affectedModule,
        severity,
        evidence,
        rootCauseHypotheses: [
            "The exact root cause has not yet been established."
        ],
        missingInformation,
        recommendedNextAction:
            "Send the report to the Debugging Agent for repository investigation."
    };
}
