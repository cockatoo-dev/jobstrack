import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema.ts',
  dialect: "sqlite",
//   driver: 'better-sqlite',
  dbCredentials: {
    url: process.cwd() + '/localDB.db'
  },
  out: './.drizzle/migrations'
})