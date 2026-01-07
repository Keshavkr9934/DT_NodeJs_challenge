import express from "express";
const router = express.Router();
import { ObjectId } from "mongodb";
import { db } from "../model.js";
import multer from "multer";

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

router.get("/events", async (req, res) => {
  try {
    const database = await db();
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Event Id is required" });
    }

    const event = await database
      .collection("events")
      .findOne({ _id: new ObjectId(id) });
    if (!event) {
      return res.status(400).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const database = await db();
    const { id, type, limit = 5, page = 1 } = req.query;

    if (id) {
      const event = await database
        .collection("events")
        .findOne({ _id: new ObjectId(id) });
      if (!event) {
        return res.status(400).json({ message: "Event not found" });
      }
    }
    if (type === "latest") {
      const event = await database
        .collection("events")
        .find()
        .sort({ schedule: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .toArray();
      return res.status(200).json(event);
    }
    return res.status(400).json({ message: "Invalid request" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/events", upload.single("image"), async (req, res) => {
  try {
    console.log("this is reqFile ", req.file);
    const database = await db();
    const event = {
      type: "event",
      uid: Number(req.body.uid),
      name: req.body.name,
      description: req.body.description,
      tagline: req.body.tagline,
      schedule: new Date(req.body.schedule),
      image: req.file ? req.file.path : null,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: Number(req.body.rigor_rank),
      attendees: [],
    };
    const result = await database.collection("events").insertOne(event);
    return res
      .status(201)
      .json({
        message: "Event created successfully",
        eventId: result.insertedId,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/events/:id", upload.single("image"), async (req, res) => {
  try {
    console.log( "this is reqFile ",req.file);
    const database = await db();
    let { id } = req.params;
    id = id.trim(); 

    // console.log("CLEAN ID:", id, "LENGTH:", id.length);

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }   
    const updatedEvent = {};

    if (req.body.uid !== undefined) updatedEvent.uid = Number(req.body.uid);
    // console.log("this is reqBody ", req.body);

    if (req.body.name) updatedEvent.name = req.body.name;

    if (req.body.description) updatedEvent.description = req.body.description;

    if (req.body.tagline) updatedEvent.tagline = req.body.tagline;
    // console.log("this is reqBody schedule ", req.body.schedule);

    if (req.body.schedule) updatedEvent.schedule = new Date(req.body.schedule);

    if (req.body.moderator) updatedEvent.moderator = req.body.moderator;

    if (req.body.category) updatedEvent.category = req.body.category;
    // console.log("this is reqBody sub_category ", req.body.sub_category);

    if (req.body.sub_category)
      updatedEvent.sub_category = req.body.sub_category;
    // console.log("this is reqBody rigor_rank  chumma", req.body.rigor_rank);

    if (req.body.rigor_rank !== undefined)
        // console.log("this is reqBody rigor_rank papy ", req.body.rigor_rank);
      updatedEvent.rigor_rank = Number(req.body.rigor_rank);
    console.log("this is reqFile ");

    if (req.file) {
      updatedEvent.files = { image: req.file.path };
    }
    // console.log("this is updatedEvent ", updatedEvent);

    const result = await database
      .collection("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedEvent });
    //   console.log("this is result ", result);
    if (result.matchedCount === 0) {
      return res.status(400).json({ message: "Event not found" });
    }
    return res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    const database = await db();
    let { id } = req.params;
    id=id.trim();
    const result = await database
      .collection("events")
      .findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(400).json({ message: "Event not found" });
    }
    await database.collection("events").deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
