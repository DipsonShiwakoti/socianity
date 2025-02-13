import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { name, date, time, description } = req.body;

  const event = new Event({
    organizer: req.user._id,
    name,
    date,
    time,
    description,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).populate("organizer", "fullName");
  res.json(events);
});

// @desc    Get a specific event
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    "organizer",
    "fullName"
  );

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc    Delete a specific event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    if (event.organizer.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized as event organizer");
    }
    await event.remove();
    res.json({ message: "Event removed" });
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

export { createEvent, getAllEvents, getEventById, deleteEvent };
