import { Pool } from 'pg';

// Add proper type declaration for the process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST?: string;
      POSTGRES_PORT?: string;
      POSTGRES_DB?: string;
      POSTGRES_USER?: string;
      POSTGRES_PASSWORD?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

// Create a connection pool to PostgreSQL database
export const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'betpal',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    const client = await pool.connect(); // Wait for the connection
    const result = await client.query('SELECT NOW()');
    console.log('PostgreSQL database connected successfully:', result.rows[0]);
    client.release(); // Always release the client
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  }
}

testConnection();


// For when we need to perform a transaction
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}