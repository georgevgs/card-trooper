import { defineDb, defineTable, column } from 'astro:db';

export const Users = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text({ unique: true }),
    email: column.text({ unique: true }),
    passwordHash: column.text(),
  }
});

export const Cards = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.number({ references: () => Users.columns.id }),
    storeName: column.text(),
    cardNumber: column.text(),
    color: column.text(),
    isQRCode: column.boolean(),
  }
});

export default defineDb({
  tables: { Users, Cards },
});