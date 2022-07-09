# Transactions in Prisma

Enable `interactiveTransactions` previewFeature in schema

```
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["interactiveTransactions"]
}
```