import fs from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRECTORIES = new Set([
    "node_modules", ".git", "dist", "build",
    "coverage", ".next", "vendor", "__pycache__"
]);

const IGNORED_FILES = new Set([
    ".env", ".env.local", ".env.production",
    "id_rsa", "id_ed25519"
]);

const SOURCE_EXTENSIONS = new Set([
    ".js", ".jsx", ".ts", ".tsx",
    ".py", ".java", ".c", ".cpp", ".h",
    ".cs", ".go", ".rs", ".php",
    ".html", ".css", ".json", ".yml", ".yaml",
    ".md", ".sql", ".sh"
]);

const MAX_FILES = 500;
const MAX_FILE_SIZE = 100_000;

export async function inspectRepository(rootDirectory) {
    const root = await fs.realpath(path.resolve(rootDirectory));
    const files = [];

    async function walk(directory) {
        if (files.length >= MAX_FILES) return;

        const entries = await fs.readdir(directory, {
            withFileTypes: true
        });

        for (const entry of entries) {
            if (files.length >= MAX_FILES) break;

            const fullPath = path.join(directory, entry.name);

            if (entry.isDirectory()) {
                if (!IGNORED_DIRECTORIES.has(entry.name)) {
                    await walk(fullPath);
                }
                continue;
            }

            if (!entry.isFile() || IGNORED_FILES.has(entry.name)) {
                continue;
            }

            const extension = path.extname(entry.name).toLowerCase();

            if (!SOURCE_EXTENSIONS.has(extension) && entry.name !== "README") {
                continue;
            }

            const stats = await fs.stat(fullPath);

            if (stats.size > MAX_FILE_SIZE) continue;

            const content = await fs.readFile(fullPath, "utf8");

            files.push({
                path: path.relative(root, fullPath),
                size: stats.size,
                content
            });
        }
    }

    await walk(root);

    return {
        root,
        totalFiles: files.length,
        files
    };
}
