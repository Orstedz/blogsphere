import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      ref: "Role",
    },
  },
  {
    _id: false,
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxUser = await mongoose.model("User").findOne().sort({ _id: -1 });
    this._id = maxUser ? maxUser._id + 1 : 1;
  }
  next();
});

export default mongoose.model("User", userSchema);
