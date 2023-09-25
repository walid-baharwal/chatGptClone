const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Chats = require("../models/Chats");
const { body, validationResult } = require("express-validator");

///ROUTE 1 Get all the Chats using:GET "/api/chats/fetchallchats". Login required
router.get("/fetchallchats", async (req, res) => {
  try {
    // /Fetching Chats
    const chats = await Chats.find().sort({ date: -1 });
    //const chats = await Chats.find({ user: req.user.id }).sort({ date: -1 });

    res.json(chats);
  } catch (error) {
    ///catch error
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

///ROUTE 2 Add a new chat using post :POST "/api/chats/addchat". Login required
// router.post(
//   "/addchat",
//   fetchuser,
//   [
//     body("title", "Enter a valid title").isLength({ min: 3 }),
//     body("description", "Description must be 5 characters long or more").isLength({ min: 1 }),
//   ],
//   async (req, res) => {
//     try {
//       const { title, description, tag } = req.body;
//       // If there are errors, return bad request
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       // Retrieve existing chats from the database
//       const existingChats = await Chats.find({ user: req.user.id });

//       // Create a new chat object
//       const chat = new Chats({
//         title,
//         description,
//         tag,
//         user: req.user.id,
//       });

//       // Add the new chat at the beginning of the existing chats array
//       existingChats.unshift(chat);

//       // Save the updated chats array back to the database
//       const savedChats = await Promise.all(existingChats.map(chat => chat.save()));

//       res.json(chat);
//     } catch (error) {
//       // Catch error
//       console.log(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// router.post("/addchat", async (req, res) => {
//   try {
//     const { question } = req.body;
//     // /If there are error return bad request
//     const answer = "this is a test answer until i get chatGPT AP";
//     const chat = new Chats({
//       chats: [{ question, answer }]
//       //user: req.user.id,
//     });
//     const savedChat = await chat.save();

//     res.json(savedChat);
//   } catch (error) {
//     ///catch error
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

///ROUTE 3 updating a chat using :PUT "/api/chats/updatechat". Login required
router.post("/addchat/:id", async (req, res) => {
  const { question, heading } = req.body;
  const answer = "this is a test answer until i get chatGPT AP";
  let existingChat = await Chats.findById(req.params.id);
  if (!existingChat) {
    console.log("newChat");
    try {
      const chat = new Chats({
        heading: heading,
        chats: [{ question, answer }],
        //user: req.user.id,
      });
      const savedChat = await chat.save();
      res.json(savedChat);
    } catch (error) {
      ///catch error
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // /checking the user who is changing his chats is real one or trying to hack
    // if (existingChat.user.toString() !== req.user.id) {
    //   return res.status(401).send("Note Allowed");
    //   // }
    try {
      //console.log("existing chat")
      // Use $push to append the new object to the array
      existingChat.chats.push({ question, answer });
      // Save the updated object
      const appendChat = await existingChat.save();
      // const chat = appendChat.chats[appendChat.chats.length-1]
      res.json(appendChat);
      //console.log(savedChat);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
});
router.put(
  "/updateheading/:id",
  //   [
  //     body("title"," Enter a valid title").isLength({ min: 3 }),
  //     body("description", "description must b 5 characters long or more").isLength({
  //       min: 5,
  //     }),
  //   ],
  async (req, res) => {
    const { heading } = req.body;
    try {
      // / Create a new Note object
      const newChat = {};
      if (heading) {
        newChat.heading = heading;
      }
      // /Find the note to be Updated
      let chat = await Chats.findById(req.params.id);
      if (!chat) {
        return res.status(404).send("Note Found");
      }
      // /checking the user who is changing his notes is real one or trying to hack
      // if (note.user.toString() !== req.user.id) {
      //   return res.status(401).send("Note Allowed");
      // }
      chat = await Chats.findByIdAndUpdate(
        req.params.id,
        { $set: newChat },
        { new: true }
      );
      res.json({ chat });
    } catch (error) {
      ///catch error
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
///ROUTE 4 Deleting a chat using :DELETE "/api/chats/updatechat". Login required
router.delete("/deletechat/:id", async (req, res) => {
  try {
    // /Find the chat to be Deleted
    let chat = await Chats.findById(req.params.id);
    if (!chat) {
      return res.status(404).send("Note Found");
    }
    // /checking the user who is changing his chats is real one or trying to hack
    // if (chat.user.toString() !== req.user.id) {
    //   return res.status(401).send("Note Allowed");
    // }
    chat = await Chats.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been Deleted", chat: chat });
  } catch (error) {
    ///catch error
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
