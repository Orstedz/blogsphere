import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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

categorySchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxCategory = await mongoose
      .model("Category")
      .findOne()
      .sort({ _id: -1 });
    this._id = maxCategory ? maxCategory._id + 1 : 1;
  }
  next();
});

export default mongoose.model("Category", categorySchema);
