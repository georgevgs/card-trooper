import { defineDb, defineTable, column } from 'astro:db';

export const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text({ unique: true }),
    email: column.text({ unique: true }),
    passwordHash: column.text(),
  }
});

export default defineDb({
  tables: { Users },
});