import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose"

const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const normalizeDateToIso = (value: string): string => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Event date must be a valid date")
  }
  return parsed.toISOString()
}

const normalizeTime = (value: string): string => {
  const trimmed = value.trim().toUpperCase()

  const twentyFourHour = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(trimmed)
  if (twentyFourHour) {
    return `${twentyFourHour[1]}:${twentyFourHour[2]}`
  }

  const twelveHour = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/.exec(trimmed)
  if (!twelveHour) {
    throw new Error("Event time must be in HH:mm or h:mm AM/PM format")
  }

  const hour = Number(twelveHour[1]) % 12 + (twelveHour[3] === "PM" ? 12 : 0)
  const minute = Number(twelveHour[2])
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
}

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item",
      },
    },
  },
  {
    timestamps: true,
  }
)

EventSchema.index({ slug: 1 }, { unique: true })

type EventSchemaType = InferSchemaType<typeof EventSchema>
type EventDocument = HydratedDocument<EventSchemaType>
type RequiredStringField =
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer"

const requiredStringFields: RequiredStringField[] = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
]

EventSchema.pre("save", function (this: EventDocument) {
  // Ensure all required string fields contain real values, not blanks.
  for (const field of requiredStringFields) {
    if (this[field].trim().length === 0) {
      throw new Error(`${field} is required`)
    }
  }

  if (this.agenda.length === 0 || this.agenda.some((item) => item.trim().length === 0)) {
    throw new Error("Agenda must contain at least one non-empty item")
  }
  if (this.tags.length === 0 || this.tags.some((item) => item.trim().length === 0)) {
    throw new Error("Tags must contain at least one non-empty item")
  }

  this.agenda = this.agenda.map((item) => item.trim())
  this.tags = this.tags.map((item) => item.trim())

  // Regenerate slug only when title changes, keeping existing URLs stable.
  if (this.isModified("title") || !this.slug) {
    this.slug = createSlug(this.title)
    if (!this.slug) {
      throw new Error("Title must contain characters that can form a valid slug")
    }
  }

  // Normalize date/time to a consistent storage format.
  if (this.isModified("date")) {
    this.date = normalizeDateToIso(this.date)
  }
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time)
  }
})

const EventModel = models.Event as Model<EventSchemaType> | undefined

export const Event = EventModel ?? model<EventSchemaType>("Event", EventSchema)
