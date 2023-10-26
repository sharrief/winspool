declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_PASSWORD: string
      POSTGRES_USER: string
      POSTGRES_DB: string
      POSTGRES_HOST: string

      PGHOST: string
      PGUSER: string
      PGPASSWORD: string
      PGDATABASE: string

      API_HOST: string;
    }
  }
}

export {};