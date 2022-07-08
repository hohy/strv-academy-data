# Add POSTS relation

Define `Post` model in the schema
```
model Post {
  id      String   @db.Uuid @id @default(uuid())
  title   String
  content String?
  createdAt Date   @default(now()) @map(created_at)

  authorId String  @map("author_id") @db.Uuid
  author   User    @relation(fields: [authorId], references: [id])

  @@map("posts")
}
```

Add `posts` reference to `User` model in the schema 

```
posts   Post[]
```

Regenerate client code
```
npx prisma generate
```

Migrate the database to the current schema
```
npx prisma migrate dev
```

Continue in `02-posts-relation.ts`
