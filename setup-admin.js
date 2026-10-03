const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const crypto = require("node:crypto");
const { db } = require("./server/db");
const { hashPassword, passwordIsStrong, validEmail, createTotpSecret, totpCode, verifyTotp, getTotpEncryptionKey, encryptTotpSecret, totpProvisioningUri } = require("./server/security");
const { id, now } = require("./server/core");
const SUPER_ADMIN_EMAIL = "kanikanishk66@gmail.com";
const PASSWORD_CHARACTERS = {
  lower: "abcdefghijkmnopqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%*-_=+"
};

function generatePassword() {
  const characters = [
    ...Array.from({ length: 8 }, () => PASSWORD_CHARACTERS.lower[crypto.randomInt(PASSWORD_CHARACTERS.lower.length)]),
    ...Array.from({ length: 8 }, () => PASSWORD_CHARACTERS.upper[crypto.randomInt(PASSWORD_CHARACTERS.upper.length)]),
    ...Array.from({ length: 4 }, () => PASSWORD_CHARACTERS.digits[crypto.randomInt(PASSWORD_CHARACTERS.digits.length)]),
    ...Array.from({ length: 4 }, () => PASSWORD_CHARACTERS.symbols[crypto.randomInt(PASSWORD_CHARACTERS.symbols.length)])
  ];
  for (let index = characters.length - 1; index > 0; index--) {
    const swapIndex = crypto.randomInt(index + 1);
    [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
  }
  return characters.join("");
}

async function createGeneratedSuperAdmin() {
  if (db.prepare("SELECT 1 FROM employees WHERE role_key = 'super_admin' LIMIT 1").get()) {
    throw new Error("A Super Admin already exists. Use the protected employee-management portal to add administrators.");
  }
  if (db.prepare("SELECT 1 FROM employees WHERE lower(email) = lower(?) OR lower(employee_id) = lower(?)").get(SUPER_ADMIN_EMAIL, SUPER_ADMIN_EMAIL)) {
    throw new Error("The primary administrator email or employee ID is already in use. No changes were made.");
  }
  getTotpEncryptionKey({ create: true });
  const password = generatePassword();
  const employeeKey = id();
  db.prepare(`INSERT INTO employees (id, employee_id, name, email, password_hash, role_key, status, price_limit_pct, totp_enabled, created_at)
    VALUES (?, ?, 'Kanishk', ?, ?, 'super_admin', 'active', 100, 0, ?)`)
    .run(employeeKey, SUPER_ADMIN_EMAIL, SUPER_ADMIN_EMAIL, await hashPassword(password), now());
  console.log("Super Admin account created. Save this generated password now; it will not be shown again.");
  console.log(`Email: ${SUPER_ADMIN_EMAIL}`);
  console.log(`Employee ID: ${SUPER_ADMIN_EMAIL}`);
  console.log(`Generated password: ${password}`);
  console.log("On first sign-in, the site will require authenticator setup and a valid six-digit code before granting access.");
}

function hiddenInput(label) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") throw new Error("Run this setup command in an interactive terminal.");
  return new Promise((resolve, reject) => {
    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = chunk => {
      for (const character of chunk) {
        if (character === "\u0003") {
          stdin.setRawMode(false);
          stdin.off("data", onData);
          stdout.write("\n");
          reject(new Error("Setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          stdin.setRawMode(false);
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= " ") value += character;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  if (process.argv.includes("--generate-credentials")) {
    await createGeneratedSuperAdmin();
    return;
  }
  if (db.prepare("SELECT 1 FROM employees WHERE role_key = 'super_admin' LIMIT 1").get()) {
    throw new Error("A Super Admin already exists. Use the protected employee-management portal to add administrators.");
  }
  const prompt = readline.createInterface({ input: stdin, output: stdout });
  const employeeId = (await prompt.question("Employee ID: ")).trim();
  const name = (await prompt.question("Full name: ")).trim();
  prompt.close();
  if (!employeeId || employeeId.length > 80 || !name || name.length > 120 || !validEmail(SUPER_ADMIN_EMAIL)) throw new Error("Employee ID or name is invalid.");
  const password = await hiddenInput("New password (input hidden): ");
  const confirmation = await hiddenInput("Confirm password (input hidden): ");
  if (password !== confirmation) throw new Error("Passwords do not match.");
  if (!passwordIsStrong(password)) throw new Error("Use 12-128 characters with uppercase, lowercase, a number, and a symbol.");
  getTotpEncryptionKey({ create: true });
  const totpSecret = createTotpSecret();
  console.log(`Super Admin email: ${SUPER_ADMIN_EMAIL}`);
  console.log("Add this account to an authenticator app, then enter its current code to finish setup:");
  console.log(totpProvisioningUri(totpSecret, SUPER_ADMIN_EMAIL));
  const code = await hiddenInput("Authenticator code (input hidden): ");
  if (!verifyTotp(totpSecret, code)) throw new Error("The authenticator code is invalid. No account was created; run setup again.");
  const employeeKey = id();
  db.prepare(`INSERT INTO employees (id, employee_id, name, email, password_hash, role_key, status, price_limit_pct, totp_secret, totp_enabled, created_at)
    VALUES (?, ?, ?, ?, ?, 'super_admin', 'active', 100, ?, 1, ?)`)
    .run(employeeKey, employeeId, name, SUPER_ADMIN_EMAIL, await hashPassword(password), encryptTotpSecret(totpSecret), now());
  console.log(`Super Admin created for ${SUPER_ADMIN_EMAIL}. Use Employee ID ${employeeId} plus your authenticator code at /staff.html.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => db.close());
