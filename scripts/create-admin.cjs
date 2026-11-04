
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!url || !key || !username || !password) {
    throw new Error("Missing required environment variables.");
  }

  if (password.length < 12) {
    throw new Error("Use an initial password of at least 12 characters.");
  }

  const supabase = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const passwordHash = await bcrypt.hash(password, 12);

  const { error } = await supabase
    .from("admin_users")
    .insert({
      username,
      password_hash: passwordHash,
    });

  if (error) {
    throw new Error(error.message);
  }

  console.log("Administrator account created successfully.");
  console.log("Username:", username);
  console.log("Password stored as a hash.");
}

main().catch((error) => {
  console.error("Could not create administrator:", error.message);
  process.exit(1);
});
