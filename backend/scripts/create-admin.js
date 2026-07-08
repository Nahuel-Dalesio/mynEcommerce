//create-admin.js

import bcrypt from "bcryptjs";

const password = "usuario";

const run = async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
};

run();