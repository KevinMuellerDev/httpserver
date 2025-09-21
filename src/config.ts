import { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const getEnvOrThrow = (key: string) => {
  const env = process.env[key];
  if (!env) throw new Error("Environment variable not found.");
  return env;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(getEnvOrThrow("PORT")),
  },
  db: {
    url: getEnvOrThrow("DB_URL"),
    migrationConfig,
  },
};
