const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { handleApi } = require("./server/api");
const { HttpError, sendJson, now, loadSession } = require("./server/core");
const { db } = require("./server/db");
const { getTotpEncryptionKey } = require("./server/security");

const root = path.resolve(__dirname);
const dataDirectory = path.join(root, "data");
const serverLockPath = process.env.STUDIO_LOCK_PATH
  ? path.resolve(process.env.STUDIO_LOCK_PATH)
  : process.env.STUDIO_DB_PATH
    ? `${path.resolve(process.env.STUDIO_DB_PATH)}.server.lock`
    : path.join(dataDirectory, "server.lock");
const port = Math.max(1, Math.min(65535, Number(process.env.PORT || 8787)));
const host = process.env.HOST || "127.0.0.1";
const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".mp4": "video/mp4", ".webm": "video/webm"
};
const blockedRoots = new Set(["server", "data", "node_modules", ".git"]);

if (process.env.NODE_ENV === "production") {
  let publicOrigin;
  let emailWebhook;
  try { publicOrigin = new URL(process.env.PUBLIC_ORIGIN); emailWebhook = new URL(process.env.EMAIL_WEBHOOK_URL); }
  catch { throw new Error("Production requires PUBLIC_ORIGIN and EMAIL_WEBHOOK_URL."); }
  if (publicOrigin.protocol !== "https:" || emailWebhook.protocol !== "https:" || !process.env.EMAIL_WEBHOOK_SECRET || process.env.EMAIL_WEBHOOK_SECRET.length < 32) {
    throw new Error("Production requires HTTPS public/email origins and an email webhook secret of at least 32 characters.");
  }
  getTotpEncryptionKey();
}

fs.mkdirSync(path.dirname(serverLockPath), { recursive: true });
if (fs.existsSync(serverLockPath)) {
  const existingPid = Number(fs.readFileSync(serverLockPath, "utf8").trim());
  let processIsRunning = false;
  if (Number.isInteger(existingPid) && existingPid > 0) {
    try { process.kill(existingPid, 0); processIsRunning = true; }
    catch (error) { processIsRunning = error.code !== "ESRCH"; }
  }
  if (processIsRunning) throw new Error(`Platform server PID ${existingPid} is already running.`);
  fs.unlinkSync(serverLockPath);
}
fs.writeFileSync(serverLockPath, String(process.pid), { flag: "wx", mode: 0o600 });

function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; connect-src 'self' https:");
  if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Cache-Control", "no-store");
}

function staticPath(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath); } catch { return null; }
  const normalized = path.posix.normalize(`/${decoded.replace(/\\/g, "/")}`).replace(/^\/+/, "");
  const first = normalized.split(/[\\/]/)[0];
  if (!normalized || normalized.startsWith("..") || blockedRoots.has(first) || normalized.startsWith(".")) return null;
  const base = first === "uploads" ? path.resolve(process.env.STUDIO_UPLOADS_PATH || path.join(root, "uploads")) : root;
  const relativePath = first === "uploads" ? normalized.slice("uploads/".length) : normalized;
  const candidate = path.resolve(base, relativePath);
  if (!candidate.startsWith(base + path.sep) || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) return null;
  if (!mimeTypes[path.extname(candidate).toLowerCase()]) return null;
  return candidate;
}

function currentWebActor(req) {
  const employee = loadSession(req, "employee");
  if (employee) return employee;
  const customer = loadSession(req, "customer");
  return customer?.record.email_verified_at ? customer : null;
}

function loginLocation(url, pathname) {
  const login = new URL("/", url);
  const resetToken = url.searchParams.get("reset");
  const invitationToken = url.searchParams.get("invite");
  if (resetToken && ["customer.html", "staff.html"].includes(pathname)) {
    login.searchParams.set("reset", resetToken.slice(0, 256));
    login.searchParams.set("account", pathname === "staff.html" ? "employee" : "customer");
  }
  if (invitationToken && pathname === "staff.html") login.searchParams.set("invite", invitationToken.slice(0, 256));
  return `${login.pathname}${login.search}`;
}

function staticAccess(urlPath, actor) {
  if (urlPath === "index.html" || urlPath === "css/portal.css" || urlPath === "css/experience.css" ||
      urlPath === "css/login.css" || urlPath === "css/depth-effects.css" ||
      urlPath === "js/login.js" || urlPath === "js/depth-effects.js") return true;
  if (!actor) return false;
  if (urlPath === "customer.html" || urlPath.startsWith("js/customer")) return actor.type === "customer";
  if (urlPath === "staff.html" || urlPath.startsWith("js/staff")) return actor.type === "employee";
  return true;
}

function redirect(res, location) {
  res.writeHead(303, { Location: location, "Cache-Control": "no-store" });
  res.end();
}

async function requestHandler(req, res) {
  securityHeaders(res);
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) return await handleApi(req, res, url);
    if (req.method !== "GET" && req.method !== "HEAD") throw new HttpError(405, "Method not allowed.");
    let urlPath = url.pathname;
    if (urlPath === "/") urlPath = "index.html";
    else {
      try { urlPath = decodeURIComponent(urlPath); }
      catch { throw new HttpError(400, "Invalid URL path."); }
      urlPath = path.posix.normalize(`/${urlPath.replace(/\\/g, "/")}`).replace(/^\/+/, "");
    }

    if (urlPath === "favicon.ico") {
      res.writeHead(204, { "Cache-Control": "no-store" });
      return res.end();
    }

    const actor = currentWebActor(req);
    if (urlPath === "index.html" && actor && !url.searchParams.has("reset") && !url.searchParams.has("invite")) {
      return redirect(res, actor.type === "employee" ? "/staff.html" : "/customer.html");
    }
    if (["server", "data", "node_modules", ".git"].includes(urlPath.split("/")[0]) || urlPath.startsWith(".")) {
      throw new HttpError(404, "Resource not found.");
    }
    const requestedPage = urlPath.endsWith(".html");
    if (!staticAccess(urlPath, actor)) {
      if (requestedPage) return redirect(res, loginLocation(url, urlPath));
      throw new HttpError(actor ? 403 : 401, "Sign in to view this resource.");
    }

    const file = staticPath(urlPath);
    if (!file) {
      if (requestedPage && !actor) return redirect(res, loginLocation(url, urlPath));
      const fallback = path.join(root, "404.html");
      const content = fs.readFileSync(fallback);
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Content-Length": content.length });
      return req.method === "HEAD" ? res.end() : res.end(content);
    }
    const content = fs.readFileSync(file);
    const extension = path.extname(file).toLowerCase();
    const cacheControl = "private, no-store";
    res.writeHead(200, { "Content-Type": mimeTypes[extension], "Content-Length": content.length, "Cache-Control": cacheControl });
    if (req.method === "HEAD") return res.end();
    return res.end(content);
  } catch (error) {
    if (res.headersSent) return res.destroy();
    const status = error instanceof HttpError ? error.status : 500;
    if (status >= 500) console.error(error);
    return sendJson(res, status, { error: status >= 500 ? "An unexpected server error occurred." : error.message });
  }
}

const server = http.createServer(requestHandler);
server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.keepAliveTimeout = 5000;
server.listen(port, host, () => {
  console.log(`Kani Studio platform listening on http://${host}:${port}`);
  if (!db.prepare("SELECT 1 FROM employees WHERE role_key = 'super_admin' LIMIT 1").get()) {
    console.log("No Super Admin exists yet. Stop the server and run: node setup-admin.js");
  }
});
server.on("error", error => {
  fs.unlinkSync(serverLockPath);
  console.error(error);
  process.exitCode = 1;
});

const sessionCleanup = setInterval(() => {
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now());
  db.prepare("DELETE FROM two_factor_challenges WHERE expires_at <= ?").run(now());
  db.prepare("DELETE FROM password_resets WHERE expires_at <= ? OR used_at IS NOT NULL").run(now());
  db.prepare("DELETE FROM verification_codes WHERE expires_at <= ? OR used_at IS NOT NULL").run(now());
  db.prepare("UPDATE approval_requests SET status = 'expired', updated_at = ? WHERE status = 'pending' AND expires_at <= ?").run(now(), now());
}, 60 * 60 * 1000);
sessionCleanup.unref();

const backupIntervalHours = Number(process.env.STUDIO_BACKUP_INTERVAL_HOURS || 0);
if (!Number.isInteger(backupIntervalHours) || backupIntervalHours < 0 || backupIntervalHours > 720) throw new Error("STUDIO_BACKUP_INTERVAL_HOURS must be 0 or between 1 and 720.");
if (backupIntervalHours > 0) {
  const backupDirectory = process.env.STUDIO_BACKUP_PATH
    ? path.resolve(process.env.STUDIO_BACKUP_PATH)
    : path.join(os.homedir(), ".kani-vision-studio", "backups");
  const relativeBackupDirectory = path.relative(root, backupDirectory);
  if (relativeBackupDirectory === "" || (!relativeBackupDirectory.startsWith(`..${path.sep}`) && relativeBackupDirectory !== ".." && !path.isAbsolute(relativeBackupDirectory))) {
    throw new Error("Scheduled backup storage must be outside the public application directory.");
  }
  const retentionDays = Number(process.env.STUDIO_BACKUP_RETENTION_DAYS || 14);
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 3650) throw new Error("STUDIO_BACKUP_RETENTION_DAYS must be between 1 and 3650.");
  const scheduledBackup = setInterval(() => {
    try {
      fs.mkdirSync(backupDirectory, { recursive: true });
      const timestamp = now();
      const filename = `studio-${timestamp.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}.sqlite`;
      const destination = path.join(backupDirectory, filename).replace(/'/g, "''");
      db.exec(`VACUUM INTO '${destination}'`);
      const stat = fs.statSync(path.join(backupDirectory, filename));
      db.prepare(`INSERT INTO audit_logs (id, actor_type, actor_id, actor_label, actor_role, action, resource_type, resource_id, after_json, result, request_meta_json, created_at)
        VALUES (?, 'system', NULL, 'Scheduled backup', 'system', 'backup.create.scheduled', 'database_backup', ?, ?, 'success', '{}', ?)`)
        .run(crypto.randomUUID(), filename, JSON.stringify({ sizeBytes: stat.size }), timestamp);
      const cutoff = Date.now() - retentionDays * 86400000;
      for (const entry of fs.readdirSync(backupDirectory, { withFileTypes: true })) {
        if (!entry.isFile() || !/^studio-\d{8}T\d{6}Z\.sqlite$/.test(entry.name)) continue;
        const entryPath = path.join(backupDirectory, entry.name);
        if (fs.statSync(entryPath).mtimeMs < cutoff) {
          fs.unlinkSync(entryPath);
          db.prepare(`INSERT INTO audit_logs (id, actor_type, actor_id, actor_label, actor_role, action, resource_type, resource_id, result, request_meta_json, created_at)
            VALUES (?, 'system', NULL, 'Scheduled backup', 'system', 'backup.retention.delete', 'database_backup', ?, 'success', '{}', ?)`)
            .run(crypto.randomUUID(), entry.name, timestamp);
        }
      }
      console.info(`Scheduled database backup created: ${filename}`);
    } catch (error) { console.error("Scheduled database backup failed.", error.message); }
  }, backupIntervalHours * 60 * 60 * 1000);
  scheduledBackup.unref();
}

function shutdown() {
  server.close(() => {
    db.close();
    fs.unlinkSync(serverLockPath);
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
