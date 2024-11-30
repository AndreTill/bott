import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import pg from 'pg'
const { Pool, Client } = pg
import { usersTable } from './db/schema';
  
const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: true
  }
});

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});
 

async function main() {
await client.connect();

const query = {
  text: 'INSERT INTO users(name, age, email) VALUES($1, $2, $3)',
  values: ['brianc', '31', 'brian.m.carlson@gmail.com'],
};
 
const res = await client.query(query);
console.log(res.rows[0]);

client.end();

}
main();
