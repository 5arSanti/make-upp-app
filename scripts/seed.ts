import { config } from "dotenv";
import path from "path";

// Load environment variables from the project root
config({ path: path.resolve(process.cwd(), ".env") });

// Import databaseSeeder after loading env vars
import { databaseSeeder } from "../src/utils/databaseSeeder";

async function main() {
  try {
    console.log("🚀 Iniciando seed de base de datos...\n");

    // Check if admin user ID is provided as argument
    const adminUserId = process.argv[2];

    if (adminUserId) {
      console.log(`👑 Creating admin profile for user: ${adminUserId}`);
      await databaseSeeder.seedAll(adminUserId);
    } else {
      console.log("📊 Seeding basic data (roles, categories, products)...");
      await databaseSeeder.seedAll();
    }

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database seeding failed:", error);
    process.exit(1);
  }
}

main();
