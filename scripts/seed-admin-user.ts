import bcrypt from 'bcrypt';
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

const ADMIN_CREDENTIALS = {
  username: 'matt5ver',
  password: 'mat@5ver'
};

const SALT_ROUNDS = 12; // Strong salt rounds for password hashing

async function seedAdminUser() {
  try {
    console.log('🔐 Seeding admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, ADMIN_CREDENTIALS.username))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists, updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, SALT_ROUNDS);
      
      // Update existing admin password
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.username, ADMIN_CREDENTIALS.username));
      
      console.log('✅ Admin user password updated successfully!');
    } else {
      console.log('📝 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, SALT_ROUNDS);
      
      // Insert new admin user
      await db.insert(users).values({
        username: ADMIN_CREDENTIALS.username,
        password: hashedPassword
      });
      
      console.log('✅ Admin user created successfully!');
    }
    
    console.log(`👤 Admin credentials:
    Username: ${ADMIN_CREDENTIALS.username}
    Password: ${ADMIN_CREDENTIALS.password}
    `);
    
    // Verify the user was created/updated
    const verifyUser = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.username, ADMIN_CREDENTIALS.username))
      .limit(1);
    
    if (verifyUser.length > 0) {
      console.log('✅ Verification successful - Admin user exists in database');
      console.log(`   User ID: ${verifyUser[0].id}`);
      console.log(`   Username: ${verifyUser[0].username}`);
    } else {
      console.error('❌ Verification failed - Admin user not found in database');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedAdminUser()
  .then(() => {
    console.log('🎉 Admin user seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Admin user seeding failed:', error);
    process.exit(1);
  });

export { seedAdminUser };