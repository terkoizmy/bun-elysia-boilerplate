import { Elysia } from "elysia";
import { Database } from "bun:sqlite";
import { access } from 'fs/promises';
import { exec } from 'child_process';
import { apiRoutes } from "./api";
import { swagger } from "@elysiajs/swagger";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";

const dbFilePath = 'db/dev.db';

(async () => {
  try {
    await access(dbFilePath);
    console.log('Database file exists');
  } catch (err) {
    console.error('Database file does not exist');

    // Create the database file
    new Database('./db/dev.db', { create: true });

    // Run the terminal command to initialize the database
    exec(`bunx prisma migrate dev --name init`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  }
})();

const app = new Elysia()

app.onError(({ code, error, set }) => {
  if (code === 'NOT_FOUND') {
      set.status = 404

      return 'Not Found :('
  }
})
app.use(swagger())
app.get("/", () => "Welcome to Elysia!")
app.use(
  jwt({
    name: "jwt",
    secret: Bun.env.JWT_SECRET!,
  })
)
app.use(cookie())
app.use(apiRoutes)
app.listen(process.env.PORT || 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
