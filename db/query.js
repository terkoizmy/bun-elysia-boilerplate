
// For testing the query
import { Database } from "bun:sqlite";

const db = new Database("dev.db");
console.log(db)

import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// create a new user
await prisma.user.create({
  data: {
    name: "Seraphine",
    email: `john-${Math.random()}@example.com`,
  },
});

// count the number of users
const count = await prisma.user.count();
console.log(`There are ${count} users in the database.`);