
import { authService } from './services/authService';
import { InsertUser } from '@shared/schema';

async function createAdmin() {
  try {
    const adminUser: InsertUser = {
      username: 'admin',
      password: 'admin123',
      email: 'admin@sonicpaths.com',
      role: 'admin',
    };

    const user = await authService.createUser(adminUser);
    console.log('✅ Admin user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    if (error.message.includes('Username already exists')) {
      console.log('ℹ️ Admin user already exists');
    } else {
      console.error('❌ Failed to create admin user:', error.message);
    }
  }
}

createAdmin();
import bcrypt from "bcrypt";
import { storage } from "./storage";

async function createAdmin() {
  try {
    const username = process.argv[2] || "admin";
    const password = process.argv[3] || "admin123";
    const email = process.argv[4] || "admin@sonicpaths.com";

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      console.log(`❌ User '${username}' already exists`);
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = await storage.createUser({
      username,
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`Username: ${adminUser.username}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${adminUser.role}`);

  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdmin()
    .then(() => {
      console.log("🎉 Admin creation completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Admin creation failed:", error);
      process.exit(1);
    });
}
