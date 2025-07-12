const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Starting cleanup of conflicting package managers...");

// Function to safely delete a file or folder
function safeDelete(filePath) {
	try {
		if (fs.existsSync(filePath)) {
			if (fs.lstatSync(filePath).isDirectory()) {
				console.log(`Removing directory: ${filePath}`);
				fs.rmSync(filePath, { recursive: true, force: true });
			} else {
				console.log(`Removing file: ${filePath}`);
				fs.unlinkSync(filePath);
			}
			return true;
		}
	} catch (error) {
		console.error(`Error deleting ${filePath}:`, error);
		return false;
	}
	return false;
}

// Delete all package manager lockfiles
safeDelete(path.join(__dirname, "package-lock.json"));
safeDelete(path.join(__dirname, "pnpm-lock.yaml"));
safeDelete(path.join(__dirname, "yarn.lock"));

// Delete node_modules
safeDelete(path.join(__dirname, "node_modules"));

// Delete .pnpm folder if it exists
safeDelete(path.join(__dirname, ".pnpm"));

console.log("\nCleanup complete! Now run:");
console.log("1. npm install");
console.log("2. npm start\n");
