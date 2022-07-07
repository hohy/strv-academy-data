import mongoose from 'mongoose'
import { logger } from '../utils/logger';
const { Schema, model, connect } = mongoose

logger.info('Connecting to MongoDB')

interface IAirport {
  airport: string,
  connects: string[],
}

const airportSchema = new Schema<IAirport>({
  airport: { type: String, required: true },
  connects: { type: [String], required: true },
})

const Airport = model<IAirport>('Airport', airportSchema);

const db = await connect('mongodb://localhost:27017/strv-academy-demo')

// clean db
await Airport.remove({})

// add airports
await Airport.insertMany([
  { "airport": "JFK", "connects": ["BOS", "ORD"] },
  { "airport": "BOS", "connects": ["JFK", "PWM"] },
  { "airport": "ORD", "connects": ["JFK"] },
  { "airport": "PWM", "connects": ["BOS", "LHR"] },
  { "airport": "LHR", "connects": ["PWM"] },
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
      "airport": 1,
      "route": {
        destination: "$destinations.airport",
        transfers: "$destinations.numConnections",
      },
    }
  },
  { $sort: { 'route.transfers': 1 } },
])

logger.info(destinations)

await db.disconnect()