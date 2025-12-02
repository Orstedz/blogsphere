import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    category: {
      type: Number,
      ref: "Category",
    },
    series: {
      type: Number,
      ref: "Series",
    },
    author: {
      type: Number,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
  },
  {
    _id: false,
    timestamps: true,
    versionKey: false,
  }
);

postSchema.pre("save", async function (next) {
  if (this.isNew) {
    const maxPost = await mongoose.model("Post").findOne().sort({ _id: -1 });
    this._id = maxPost ? maxPost._id + 1 : 1;
  }
  next();
});

export default mongoose.model("Post", postSchema);
