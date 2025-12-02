import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
    versionKey: false,
  }
);

seriesSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxSeries = await mongoose
      .model("Series")
      .findOne()
      .sort({ _id: -1 });
    this._id = maxSeries ? maxSeries._id + 1 : 1;
  }
  next();
});

export default mongoose.model("Series", seriesSchema);
