const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const EventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['tourist', 'politic', 'extravert', 'nurd'],
      default: 'tourist',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    creatorId: {
      type: String,
      required: true
    },
    aboutEvent: {
      type: String,
      required: true
    },
    aboutYou: {
      type: String,
      required: true
    },
    visitors: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    images: {
      type: Array,
      required: true
    },
    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
EventSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Event', EventSchema)
