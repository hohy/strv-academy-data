import mongoose from 'mongoose'
import { generate } from '../utils/generate'
import { logger } from '../utils/logger'
import _ from 'lodash'

logger.info('Mongo geospatial queries demo')
const { Schema, model, connect } = mongoose

interface IPlace {
  name: string
  location: {
    type: { type: String };
    coordinates: [number, number];
  };
}

const placeSchema = new Schema<IPlace>({
  name: { type: String, required: true },
  location: {
    type: { type: String },
    coordinates: Array,
  }
})

// Create location index for the location field
placeSchema.index({ location: '2dsphere' })

const Place = model<IPlace>('Place', placeSchema)

const db = await connect('mongodb://localhost:27017/strv-academy-demo')

// Insert test data
await Place.remove({})
await Place.insertMany([
  {
    name: "Central Park",
    location: { type: "Point", coordinates: [-73.97, 40.77] },
    category: "Parks"
  },
  {
    name: "Sara D. Roosevelt Park",
    location: { type: "Point", coordinates: [-73.9928, 40.7193] },
    category: "Parks"
  },
  {
    name: "Polo Grounds",
    location: { type: "Point", coordinates: [-73.9375, 40.8303] },
    category: "Stadiums"
  }
])

const nearPlaces = await Place.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [-73.9, 40.8] },
      distanceField: "distance",
      maxDistance: 100000,
      spherical: true
    }
  },
  { $sort: { distance: 1 } },
  { $limit: 1 },
  { $project: { name: 1, distance: 1 } },
]
)

logger.info({ nearPlaces }, 'Near places')

await db.disconnect()