# Transactions in Prisma

Enable `interactiveTransactions` previewFeature in schema

```
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["interactiveTransactions"]
}
```

Add balance field to users table

```
  balance Decimal  @default(0)
```

Regenerate & migrate 🚀