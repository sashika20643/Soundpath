
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
