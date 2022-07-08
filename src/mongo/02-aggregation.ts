import mongoose from 'mongoose'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
import _ from 'lodash'

logger.info('Mongo aggregation pipeline demo')
const { Schema, model, connect } = mongoose

interface IOrder {
  name: string
  size: string
  price: number
  quantity: number
  date: Date
}

const orderSchema = new Schema<IOrder>({
  name: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, required: true },
})

const Order = model<IOrder>('Order', orderSchema)

const db = await connect('mongodb://localhost:27017/strv-academy-demo')

await Order.remove({})
await Order.insertMany([
  {
    name: "Pepperoni", size: "small", price: 19,
    quantity: 10, date: new Date("2021-03-13T08:14:30Z")
  },
  {
    name: "Pepperoni", size: "medium", price: 20,
    quantity: 20, date: new Date("2021-03-13T09:13:24Z")
  },
  {
    name: "Pepperoni", size: "large", price: 21,
    quantity: 30, date: new Date("2021-03-17T09:22:12Z")
  },
  {
    name: "Cheese", size: "small", price: 12,
    quantity: 15, date: new Date("2021-03-13T11:21:39.736Z")
  },
  {
    name: "Cheese", size: "medium", price: 13,
    quantity: 50, date: new Date("2022-01-12T21:23:13.331Z")
  },
  {
    name: "Cheese", size: "large", price: 14,
    quantity: 10, date: new Date("2022-01-12T05:08:13Z")
  },
  {
    name: "Vegan", size: "small", price: 17,
    quantity: 10, date: new Date("2021-01-13T05:08:13Z")
  },
  {
    name: "Vegan", size: "medium", price: 18,
    quantity: 10, date: new Date("2021-01-13T05:10:13Z")
  }
])

// logger.info({ orders: await Order.find() }, 'Orders read from database')

const totalMediumPizzas = await Order.aggregate([
  // Stage 1: Filter pizza order documents by pizza size
  {
    $match: { size: "medium" }
  },
  // Stage 2: Group remaining documents by pizza name and calculate total quantity
  {
    $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
  }
])
logger.info({ totalMediumPizzas }, 'Total medium pizzas')

const result = await Order.aggregate([
  // Stage 1: Filter pizza order documents by date range
  {
    $match:
    {
      // "date": { $gte: new Date("2020-01-13 00:00:00Z"), $lt: new Date("2022-01-13 23:59:59Z") }
      "date": { $gte: new Date("2020-01-30"), $lt: new Date("2022-01-30") }
    }
  },
  // Stage 2: Group remaining documents by date and calculate results
  {
    $group:
    {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      orders: { $sum: 1 },
      totalOrderValue: { $sum: { $multiply: ["$price", "$quantity"] } },
      averageOrderQuantity: { $avg: "$quantity" }
    }
  },
  // Stage 3: Sort documents by totalOrderValue in descending order
  {
    $sort: { totalOrderValue: -1 }
  }
])

logger.info({ result }, 'Orders read from database')

await db.disconnect()