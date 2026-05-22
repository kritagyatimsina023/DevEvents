import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose"

import { Event } from "./event.model"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const BookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => EMAIL_REGEX.test(value),
        message: "Email must be a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
)

BookingSchema.index({ eventId: 1 })

type BookingSchemaType = InferSchemaType<typeof BookingSchema>
type BookingDocument = HydratedDocument<BookingSchemaType>

BookingSchema.pre("save", async function (this: BookingDocument) {
  // Ensure the booking always points to an existing event.
  if (this.isNew || this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId })
    if (!eventExists) {
      throw new Error("Referenced event does not exist")
    }
  }
})

const BookingModel = models.Booking as Model<BookingSchemaType> | undefined

export const Booking =
  BookingModel ?? model<BookingSchemaType>("Booking", BookingSchema)
