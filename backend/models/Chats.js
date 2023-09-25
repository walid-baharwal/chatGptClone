const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "user",
  // },
  heading: {
    type: String,
  },
  chats: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  month: {
    type: String,
    default: function () {
      return new Date().toLocaleString("en-US", { month: "long" });
    },
  },
});

module.exports = mongoose.model("chats", NotesSchema);
