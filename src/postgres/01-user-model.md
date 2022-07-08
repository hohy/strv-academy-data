# Prisma tutorial

Install Prisma

```
npx prisma
```

Init Prisma project
```
npx prisma init
```

Define database schema at `src/postgres/schema.prisma`
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = "postgres://postgres:postgres@localhost:5432/prisma"
}

model User {
  id      String   @db.Uuid @id @default(uuid())
  name    String
  email   String   @unique
  age     Int?

  @@map("users")
}
```

Generate client code
```
npx prisma generate
```

Migrate the database to the current schema
```
npx prisma migrate dev --name init
```

Run `01-user-model.ts` to create db records.



TODO: Indexes
