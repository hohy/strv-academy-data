import mongoose from 'mongoose'
import { logger } from '../utils/logger';
const { Schema, model, connect } = mongoose

logger.info('MongoDB Graph Lookup demo')

interface IAirport {
  airport: string,
  city: string,
  connects: string[],
}

const airportSchema = new Schema<IAirport>({
  airport: { type: String, required: true },
  city: { type: String, required: false },
  connects: { type: [String], required: true },
})

const Airport = model<IAirport>('Airport', airportSchema);

const db = await connect('mongodb://localhost:27017/strv-academy-demo')

// clean db
await Airport.remove({})

// add airports
await Airport.insertMany([
  { "airport": "JFK", "city": "New York", "connects": ["BOS", "ORD"] },
  { "airport": "BOS", "city": "Boston", "connects": ["JFK", "PWM"] },
  { "airport": "ORD", "city": "Chicago", "connects": ["JFK"] },
  { "airport": "PWM", "city": "Portland", "connects": ["BOS", "LHR"] },
  { "airport": "LHR", "city": "London", "connects": ["PWM"] },
])

const destinations = await Airport.aggregate([
  { $match: { 'airport': 'ORD' } },
  {
    $graphLookup: {
      from: 'airports',
      startWith: '$connects',
      connectFromField: 'connects',
      connectToField: 'airport',
      maxDepth: 2,
      depthField: 'numConnections',
      as: 'destinations',
    }
  },
  { $unwind: '$destinations' },
  {
    $project: {
      "_id": 0,
      "airport": 1,
      "city": 1,
      "route": {
        destination: "$destinations.airport",
        city: "$destinations.city",
        transfers: "$destinations.numConnections",
      },
    }
  },
  { $sort: { 'route.transfers': 1 } },
])

logger.info(destinations)

await db.disconnect()