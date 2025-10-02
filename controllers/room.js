const { validationResult } = require('express-validator');
const Room = require('../models/room');

// GET /rooms → list all rooms
exports.getRooms = async (req, res, next) => {
  const currentUrl = req.originalUrl;

  try {
    const rooms = await Room.find();

    const userType = req.session.user.user_type;
    let isAdmin = userType === 'admin' || userType === 'super_admin';

    res.render('room/rooms', {
      rooms,
      pageTitle: 'Rooms',
      path: '/rooms',
      isAuthenticated: true,
      isAdmin,
      userDetail: req.session.user,
      currentUrl,
      userType
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// GET /room/:roomId? → display form for create or edit
exports.getRoomForm = async (req, res, next) => {
  const currentUrl = req.originalUrl;
  const roomId = req.params.roomId; // undefined for create
  const editMode = !!roomId;

  const userType = req.session.user.user_type;
  let isAdmin = userType === 'admin' || userType === 'super_admin';

  let oldInput = {
    hotelName: '',
    roomNumber: '',
    roomType: '',
    description: '',
    images: [],
    pricePerNight: '',
    size: '',
    bedType: '',
    view: '',
    amenities: [],
    availability: true,
    maxGuests: ''
  };

  if (editMode) {
    try {
      const room = await Room.findById(roomId);
      if (!room) return res.redirect('/rooms');

      oldInput = {
        id: room._id,
        hotelName: room.hotelName,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        description: room.description,
        images: room.images,
        pricePerNight: room.pricePerNight,
        size: room.size,
        bedType: room.bedType,
        view: room.view,
        amenities: room.amenities,
        availability: room.availability,
        maxGuests: room.maxGuests
      };
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  res.render('room/create-room', {
    pageTitle: editMode ? 'Edit Room' : 'Add Room',
    path: editMode ? `/room/edit/${roomId}` : '/room',
    isAuthenticated: true,
    userType,
    oldInput,
    validationErrors: [],
    isAdmin,
    editing: editMode,
    userDetail: req.session.user,
    currentUrl
  });
};

// POST /room → create or update room
exports.saveRoom = async (req, res, next) => {
  const roomId = req.body.roomId; // present if editing
  const editing = !!roomId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('room/create-room', {
      pageTitle: editing ? 'Edit Room' : 'Add Room',
      editing: editing,
      oldInput: req.body,
      validationErrors: errors.array(),
      isAdmin: true,
    });
  }

  const { hotelName, roomNumber, roomType, description, images, pricePerNight, size, bedType, view, amenities, availability, maxGuests } = req.body;

  try {
    let room;

    if (editing) {
      room = await Room.findById(roomId);
      if (!room) return res.status(404).send('Room not found');

      room.hotelName = hotelName;
      room.roomNumber = roomNumber;
      room.roomType = roomType;
      room.description = description;
      room.images = images ? images.split(',') : [];
      room.pricePerNight = pricePerNight;
      room.size = size;
      room.bedType = bedType;
      room.view = view;
      room.amenities = amenities ? amenities.split(',') : [];
      room.availability = availability === 'true';
      room.maxGuests = maxGuests;

    } else {
      room = new Room({
        hotelName,
        roomNumber,
        roomType,
        description,
        images: images ? images.split(',') : [],
        pricePerNight,
        size,
        bedType,
        view,
        amenities: amenities ? amenities.split(',') : [],
        availability: availability === 'true',
        maxGuests
      });
    }

    await room.save();
    res.redirect('/rooms');
  } catch (err) {
    next(err);
  }
};

// DELETE /room/:roomId
exports.deleteRoom = async (req, res, next) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);
    if (!room) throw new Error('Room not found');

    await room.deleteOne();
    res.status(200).json({ message: 'Room deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting room failed.' });
  }
};
