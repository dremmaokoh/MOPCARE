const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Care",
    },
   
     title: {
      type: String,
      required: [true, "Please enter a valid name"],
    },

    details: {
      type: String,
      required: [true, "Please enter a valid description"],
    },
    link: {
      type: String,
      required: [true, "Please enter a valid link"],
    },
    coursePicture: {
      type: String,
      required: [true, "please enter a valid image"],
    },

    category: {
      type: String,
      enum: ["educational", "health", "exercise","diet","others"],
      required: [true, "Please fill in the category"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
 
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Course", courseSchema);
