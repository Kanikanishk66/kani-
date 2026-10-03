const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const { DatabaseSync } = require("node:sqlite");

function backupDirectory() {
  return process.env.STUDIO_BACKUP_PATH ? path.resolve(process.env.STUDIO_BACKUP_PATH) : path.join(os.homedir(), ".kani-vision-studio", "backups");
}

function assertServerStopped(lockPath) {
  try {
    const pid = Number(require("node:fs").readFileSync(lockPath, "utf8").trim());
    if (Number.isInteger(pid) && pid > 0) {
      try { process.kill(pid, 0); throw new Error(`The platform server (PID ${pid}) is running. Stop it before restore.`); }
      catch (error) { if (error.code !== "ESRCH") throw error; }
    }
    require("node:fs").unlinkSync(lockPath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function verifyDatabase(filePath) {
  const database = new DatabaseSync(filePath, { readOnly: true });
  try {
    const integrity = database.prepare("PRAGMA integrity_check").get().integrity_check;
    if (integrity !== "ok") throw new Error("SQLite integrity check failed.");
    const required = new Set(database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(row => row.name));
    if (!required.has("products") || !required.has("employees") || !required.has("customers")) throw new Error("The selected file is not a Kani Studio database.");
  } finally { database.close(); }
}

async function main() {
  const backupName = process.argv[2];
  if (!backupName || !/^studio-\d{8}T\d{6}Z\.sqlite$/.test(backupName)) throw new Error("Usage: node restore-backup.js <backup filename>");
  const root = path.resolve(__dirname);
  const backupRoot = backupDirectory();
  const relativeBackup = path.relative(backupRoot, path.resolve(backupRoot, backupName));
  if (relativeBackup !== backupName) throw new Error("Backup filename is invalid.");
  const source = path.join(backupRoot, backupName);
  verifyDatabase(source);

  const target = process.env.STUDIO_DB_PATH ? path.resolve(process.env.STUDIO_DB_PATH) : path.join(root, "data", "studio.sqlite");
  const targetDirectory = path.dirname(target);
  const lockPath = process.env.STUDIO_LOCK_PATH
    ? path.resolve(process.env.STUDIO_LOCK_PATH)
    : process.env.STUDIO_DB_PATH
      ? `${path.resolve(process.env.STUDIO_DB_PATH)}.server.lock`
      : path.join(root, "data", "server.lock");
  assertServerStopped(lockPath);
  if (!stdin.isTTY) throw new Error("Run restore-backup.js from an interactive terminal.");
  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.mkdir(backupRoot, { recursive: true });

  const prompt = readline.createInterface({ input: stdin, output: stdout });
  const confirmation = await prompt.question(`Restore ${backupName} to ${target}? Type RESTORE to continue: `);
  prompt.close();
  if (confirmation !== "RESTORE") throw new Error("Restore cancelled.");

  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const temporary = `${target}.restore-tmp`;
  const safetyCopy = path.join(backupRoot, `before-restore-${stamp}.sqlite`);
  const currentExists = await fs.stat(target).then(() => true, () => false);
  if (currentExists) {
    const current = new DatabaseSync(target);
    try { current.exec(`VACUUM INTO '${safetyCopy.replace(/'/g, "''")}'`); }
    finally { current.close(); }
  }
  await fs.copyFile(source, temporary);
  verifyDatabase(temporary);
  const previous = `${target}.pre-restore-${stamp}`;
  if (currentExists) await fs.rename(target, previous);
  try { await fs.rename(temporary, target); }
  catch (error) {
    if (currentExists) await fs.rename(previous, target).catch(() => {});
    throw error;
  }
  console.log(`Database restored. Pre-restore safety copy: ${currentExists ? safetyCopy : "not available (no prior database)"}`);
  console.log("Restore uploaded media from its separate backup before reopening the site.");
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
