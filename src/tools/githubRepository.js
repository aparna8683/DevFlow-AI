import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const WORKSPACE = path.resolve("workspace");

export function validateGitHubUrl(repositoryUrl) {
    let parsedUrl;

    try {
        parsedUrl = new URL(repositoryUrl);
    } catch {
        throw new Error("Invalid GitHub repository URL.");
    }

    if (
        parsedUrl.protocol !== "https:" ||
        parsedUrl.hostname !== "github.com" ||
        parsedUrl.username ||
        parsedUrl.password ||
        parsedUrl.port
    ) {
        throw new Error("Only HTTPS GitHub repository URLs are supported.");
    }

    const segments = parsedUrl.pathname
        .split("/")
        .filter(Boolean);

    if (
        segments.length !== 2 ||
        !segments.every(segment =>
            /^[a-zA-Z0-9_.-]+$/.test(segment)
        )
    ) {
        throw new Error("Expected URL format: https://github.com/owner/repository");
    }

    const owner = segments[0];
    const repository = segments[1].replace(/\.git$/i, "");

    if (!repository || repository === "." || repository === "..") {
        throw new Error("Invalid repository name.");
    }

    return {
        owner,
        repository,
        cloneUrl: `https://github.com/${owner}/${repository}.git`
    };
}

export async function cloneGitHubRepository(repositoryUrl) {
    const { owner, repository, cloneUrl } =
        validateGitHubUrl(repositoryUrl);

    await fs.mkdir(WORKSPACE, { recursive: true });

    const destination = path.join(WORKSPACE, `${owner}-${repository}`);

    try {
        await fs.access(destination);
        throw new Error(
            `Repository already exists at ${destination}.`
        );
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }

    await execFileAsync(
        "git",
        [
            "clone",
            "--depth", "1",
            "--no-tags",
            "--",
            cloneUrl,
            destination
        ],
        {
            timeout: 120000,
            maxBuffer: 10 * 1024 * 1024,
            windowsHide: true
        }
    );

    return {
        owner,
        repository,
        destination,
        cloned: true
    };
}
