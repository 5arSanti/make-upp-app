import { supabase } from "../config/supabase-client";
import { UserRole, ProductCategory } from "../services/enums";

export interface SeedData {
  roles: Array<{
    name: UserRole;
    description: string;
  }>;
  categories: Array<{
    name: ProductCategory;
    description: string;
  }>;
  sampleProducts: Array<{
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
  }>;
}

const seedData: SeedData = {
  roles: [
    { name: UserRole.ADMIN, description: "Administrador del sistema" },
    { name: UserRole.CUSTOMER, description: "Usuario comprador" },
    { name: UserRole.SELLER, description: "Vendedor de productos" },
  ],
  categories: [
    {
      name: ProductCategory.HOGAR,
      description: "Productos para el hogar: textiles, decoración, menaje",
    },
    {
      name: ProductCategory.ELECTRODOMESTICOS,
      description:
        "Lavadoras, neveras, aire acondicionado, pequeños electrodomésticos",
    },
    {
      name: ProductCategory.ROPA_Y_ACCESORIOS,
      description: "Ropa, calzado y complementos",
    },
    {
      name: ProductCategory.AUTOMOTRIZ,
      description: "Accesorios y repuestos para vehículos",
    },
    {
      name: ProductCategory.JUGUETES_Y_BEBES,
      description: "Juguetes, puericultura y artículos para bebés",
    },
    {
      name: ProductCategory.DEPORTES_Y_FITNESS,
      description: "Artículos deportivos y equipamiento fitness",
    },
    {
      name: ProductCategory.SALUD_Y_BELLEZA,
      description: "Cuidado personal, cosméticos y bienestar",
    },
  ],
  sampleProducts: [
    {
      name: "Toallas de Baño",
      description: "Toallas de baño de alta calidad, 100% algodón",
      price: 45.99,
      category: ProductCategory.HOGAR,
    },
    {
      name: "Lavadora",
      description: "Lavadora de alta capacidad, 10 kg",
      price: 349.99,
      category: ProductCategory.ELECTRODOMESTICOS,
    },
    {
      name: "Secadora",
      description: "Secadora de alta capacidad, 10 kg",
      price: 299.99,
      category: ProductCategory.ELECTRODOMESTICOS,
    },
    {
      name: "Aire Acondicionado",
      description: "Aire acondicionado split 12000 BTU",
      price: 449.99,
      category: ProductCategory.ELECTRODOMESTICOS,
    },
    {
      name: "Refrigerador",
      description: "Refrigerador no frost 350 L",
      price: 549.99,
      category: ProductCategory.ELECTRODOMESTICOS,
    },
    {
      name: "Camiseta Básica",
      description: "Camiseta de algodón orgánico, tallas S a XXL",
      price: 19.99,
      category: ProductCategory.ROPA_Y_ACCESORIOS,
    },
    {
      name: "Zapatillas Running",
      description: "Zapatillas ligeras para running y caminata",
      price: 89.99,
      category: ProductCategory.DEPORTES_Y_FITNESS,
    },
    {
      name: "Crema Hidratante",
      description: "Crema facial con ácido hialurónico",
      price: 24.99,
      category: ProductCategory.SALUD_Y_BELLEZA,
    },
  ],
};

export class DatabaseSeeder {
  async seedRoles(): Promise<void> {
    console.log("🌱 Seeding roles...");

    for (const role of seedData.roles) {
      const { error } = await supabase
        .from("roles")
        .upsert(role, { onConflict: "name" });

      if (error) {
        console.error(`Error seeding role ${role.name}:`, error);
        throw error;
      }
    }

    console.log("✅ Roles seeded successfully");
  }

  async seedCategories(): Promise<void> {
    console.log("🌱 Seeding categories...");

    for (const category of seedData.categories) {
      const { error } = await supabase
        .from("categories")
        .upsert(category, { onConflict: "name" });

      if (error) {
        console.error(`Error seeding category ${category.name}:`, error);
        throw error;
      }
    }

    console.log("✅ Categories seeded successfully");
  }

  async seedSampleProducts(): Promise<void> {
    console.log("🌱 Seeding sample products...");

    for (const product of seedData.sampleProducts) {
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("name", product.name)
        .single();

      if (existingProduct) {
        console.log(
          `⏭️  Product "${product.name}" already exists, skipping...`
        );
        continue;
      }

      // Get category ID
      const { data: category, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", product.category)
        .single();

      if (categoryError) {
        console.error(
          `Error finding category ${product.category}:`,
          categoryError
        );
        continue;
      }

      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: category.id,
        available: true,
      };

      const { error } = await supabase.from("products").insert(productData);

      if (error) {
        console.error(`Error seeding product ${product.name}:`, error);
        throw error;
      }
    }

    console.log("✅ Sample products seeded successfully");
  }

  async createAdminProfile(adminUserId: string): Promise<void> {
    console.log("🌱 Creating admin profile...");

    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", UserRole.ADMIN)
      .single();

    if (roleError) {
      console.error("Error finding admin role:", roleError);
      throw roleError;
    }

    const adminProfile = {
      id: adminUserId,
      username: "admin",
      full_name: "Administrador del Sistema",
      role_id: adminRole.id,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(adminProfile, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) {
      console.error("Error creating admin profile:", error);

      // If RLS error, provide instructions
      if (error.code === "42501") {
        console.log("\n⚠️  RLS Policy Violation Detected!");
        console.log(
          "The admin profile cannot be created due to Row Level Security policies."
        );
        console.log("\n📋 Manual Steps Required:");
        console.log("1. Go to your Supabase Dashboard");
        console.log("2. Navigate to Authentication > Users");
        console.log("3. Create a new user with email: admin@tienda.com");
        console.log("4. Copy the user ID and run this SQL in the SQL Editor:");
        console.log("\n```sql");
        console.log(
          `INSERT INTO profiles (id, username, full_name, role_id, updated_at)`
        );
        console.log(
          `VALUES ('${adminUserId}', 'admin', 'Administrador del Sistema', ${adminRole.id}, NOW());`
        );
        console.log("```\n");
        console.log(
          "Or temporarily disable RLS for the profiles table during seeding."
        );
        return; // Don't throw error, just skip admin creation
      }

      throw error;
    }

    console.log("✅ Admin profile created successfully");
  }

  async seedAll(adminUserId?: string): Promise<void> {
    try {
      console.log("🚀 Starting database seeding...");

      await this.seedRoles();
      await this.seedCategories();
      await this.seedSampleProducts();

      if (adminUserId) {
        try {
          await this.createAdminProfile(adminUserId);
        } catch {
          console.log(
            "⚠️  Admin profile creation failed, but seeding continues..."
          );
          console.log(
            "The basic data (roles, categories, products) was seeded successfully."
          );
        }
      }

      console.log("🎉 Database seeding completed successfully!");

      // Display summary
      await this.displaySummary();
    } catch (error) {
      console.error("❌ Database seeding failed:", error);
      throw error;
    }
  }

  async displaySummary(): Promise<void> {
    console.log("\n📊 Database Summary:");

    // Count roles
    const { count: rolesCount } = await supabase
      .from("roles")
      .select("*", { count: "exact", head: true });

    // Count categories
    const { count: categoriesCount } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    // Count products
    const { count: productsCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    console.log(`   Roles: ${rolesCount}`);
    console.log(`   Categories: ${categoriesCount}`);
    console.log(`   Products: ${productsCount}`);
  }
}

// Export singleton instance
export const databaseSeeder = new DatabaseSeeder();
