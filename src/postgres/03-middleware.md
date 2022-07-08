# Prisma middleware demo

We try to implement soft-delete functionality using Prisma middleware

Update schema to contain `delete` field
```
deleted Boolean @default(false)
```

generate & migrate
