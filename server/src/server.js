import app from "./app.js";
import { env } from "./config/env.js";
import { seedAdmin } from "./scripts/seedAdmin.js";

const startServer = async () => {
  try {
    await seedAdmin();
    app.listen(env.PORT, () => {
      console.log(`✅ Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
