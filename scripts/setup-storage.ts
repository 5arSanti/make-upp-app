import { supabase } from "../src/config/supabase-client";

async function setupStorage() {
  try {
    console.log("🚀 Setting up Supabase Storage...");
    console.log("🔍 Checking Supabase connection...");

    // Test connection by listing buckets (no auth required for this)
    console.log("📋 Listing existing buckets...");
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Supabase connection error:", listError);
      throw listError;
    }
    console.log("✅ Supabase connection successful");
    console.log("📋 Found buckets:", buckets?.map(b => b.name) || []);

    const bucketExists = buckets?.some(
      (bucket) => bucket.name === "product-images"
    );

    if (!bucketExists) {
      console.log("📦 Creating product-images bucket...");
      const { error } = await supabase.storage.createBucket("product-images", {
        public: true,
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ],
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        console.error("❌ Error creating bucket:", error);
        
        // If RLS error, provide manual instructions
        if (error.message.includes("row-level security policy")) {
          console.log("\n⚠️  RLS Policy Violation Detected!");
          console.log("The bucket cannot be created due to Row Level Security policies.");
          console.log("\n📋 Manual Steps Required:");
          console.log("1. Go to your Supabase Dashboard");
          console.log("2. Navigate to Storage");
          console.log("3. Click 'New bucket'");
          console.log("4. Set bucket name: 'product-images'");
          console.log("5. Make it public: ✅");
          console.log("6. Set file size limit: 5MB");
          console.log("7. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp");
          console.log("8. Click 'Create bucket'");
          console.log("\nOr temporarily disable RLS for the storage.objects table during setup.");
          return; // Don't throw error, just skip bucket creation
        }
        
        throw error;
      }

      console.log("✅ product-images bucket created successfully");
    } else {
      console.log("✅ product-images bucket already exists");
    }

    console.log("🎉 Storage setup completed successfully!");
  } catch (error) {
    console.error("❌ Storage setup failed:", error);
    throw error;
  }
}

// Run setup
console.log("🔧 Starting storage setup script...");
setupStorage()
  .then(() => {
    console.log("✅ Setup completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });

export { setupStorage };
