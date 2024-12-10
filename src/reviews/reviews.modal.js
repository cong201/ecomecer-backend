const { Schema, model } = require("mongoose");
const ReviewSchema = new Schema(
  {
    comment: { type: String, require: true },
    rating: { type: Number, require: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  { timestamps: true }
);

const Reviews = mongoose.model("Review", ReviewSchema);

module.exports = Reviews;
