import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    name: {
      type: String,
      required: true,
      unique: true,
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

roleSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxRole = await mongoose.model("Role").findOne().sort({ _id: -1 });
    this._id = maxRole ? maxRole._id + 1 : 1;
  }
  next();
});

export default mongoose.model("Role", roleSchema);
