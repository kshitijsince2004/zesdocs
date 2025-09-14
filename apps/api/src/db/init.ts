import { testDatabaseConnection, disconnectDatabase } from './connection';

/**
 * Initialize database connection and run any setup tasks
 */
export async function initializeDatabase(): Promise<boolean> {
  console.log('🔌 Initializing database connection...');
  
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to database');
      return false;
    }

    console.log('✅ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

/**
 * Graceful shutdown of database connection
 */
export async function shutdownDatabase(): Promise<void> {
  console.log('🔌 Shutting down database connection...');
  await disconnectDatabase();
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await shutdownDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await shutdownDatabase();
  process.exit(0);
});
