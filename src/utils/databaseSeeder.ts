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
      name: ProductCategory.FACIAL_MAKEUP,
      description: "Productos para el rostro: bases, correctores, polvos",
    },
    {
      name: ProductCategory.EYE_MAKEUP,
      description: "Sombras, delineadores, máscaras de pestañas",
    },
    {
      name: ProductCategory.LIP_MAKEUP,
      description: "Labiales, brillos, delineadores de labios",
    },
    {
      name: ProductCategory.SKIN_CARE,
      description: "Cremas, limpiadores, tratamientos faciales",
    },
    {
      name: ProductCategory.MAKEUP_TOOLS,
      description: "Bróchas, esponjas, aplicadores",
    },
    { name: ProductCategory.FRAGRANCES, description: "Perfumes y colonias" },
    {
      name: ProductCategory.ACCESSORIES,
      description: "Bolsos, estuches, organizadores de maquillaje",
    },
  ],
  sampleProducts: [
    {
      name: "Base de Maquillaje Luxury",
      description: "Base de larga duración con acabado natural",
      price: 45.99,
      category: ProductCategory.FACIAL_MAKEUP,
    },
    {
      name: "Paleta de Sombras Premium",
      description: "12 sombras con pigmentos de alta calidad",
      price: 32.5,
      category: ProductCategory.EYE_MAKEUP,
    },
    {
      name: "Labial Mate de Larga Duración",
      description: "Labial mate que no se transfiere",
      price: 18.75,
      category: ProductCategory.LIP_MAKEUP,
    },
    {
      name: "Crema Hidratante Anti-Edad",
      description: "Crema con ácido hialurónico y vitamina C",
      price: 65.0,
      category: ProductCategory.SKIN_CARE,
    },
    {
      name: "Set de Brochas Profesionales",
      description: "12 brochas de alta calidad para maquillaje",
      price: 89.99,
      category: ProductCategory.MAKEUP_TOOLS,
    },
    {
      name: "Perfume Signature",
      description: "Fragancia exclusiva de Make-upp",
      price: 125.0,
      category: ProductCategory.FRAGRANCES,
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

      const { error } = await supabase
        .from("products")
        .upsert(productData, { onConflict: "name" });

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

    const { error } = await supabase
      .from("profiles")
      .upsert(adminProfile, { onConflict: "id" });

    if (error) {
      console.error("Error creating admin profile:", error);
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
        await this.createAdminProfile(adminUserId);
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
