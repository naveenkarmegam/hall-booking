const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const port = 3000;
const rooms = [
  {
    "roomId": 1,
    "bookedStatus": false,
    "roomName": "Conference Room A",
    "seatsAvailable": 50,
    "amenities": ["projector", "whiteboard"],
    "price_per_hr": 100
  },
  {
    "roomId": 2,
    "bookedStatus": false,
    "roomName": "Boardroom B",
    "seatsAvailable": 20,
    "amenities": ["teleconferencing", "coffee machine"],
    "price_per_hr": 75
  },
  {
    "roomId": 3,
    "bookedStatus": false,
    "roomName": "Training Room 1",
    "seatsAvailable": 30,
    "amenities": ["flipchart", "computers"],
    "price_per_hr": 120
  },
  {
    "roomId": 4,
    "bookedStatus": false,
    "roomName": "Meeting Room X",
    "seatsAvailable": 15,
    "amenities": ["TV", "conference phone"],
    "price_per_hr": 80
  },
  {
    "roomId": 5,
    "bookedStatus": false,
    "roomName": "Executive Suite",
    "seatsAvailable": 10,
    "amenities": ["private restroom", "catering service"],
    "price_per_hr": 150
  }
]
const bookings = [
  {
    "bookingId": 1,
    "customerName": "John Doe",
    "roomName": "Conference Room A",
    "roomId": 1,
    "bookedStatus": true,
    "date": "2023-01-01",
    "startTime": "10:00",
    "endTime": "12:00"
  },
  {
    "bookingId": 2,
    "customerName": "Alice Smith",
    "roomId": 3,
    "bookedStatus": true,
    "roomName": "Training Room 1",
    "date": "2023-01-02",
    "startTime": "14:00",
    "endTime": "16:00"
  },
  {
    "bookingId": 3,
    "customerName": "Bob Johnson",
    "roomId": 2,
    "bookedStatus": true,
    "roomName": "Boardroom B",
    "date": "2023-01-03",
    "startTime": "09:30",
    "endTime": "11:30"
  },
  {
    "bookingId": 4,
    "customerName": "John Doe",
    "roomId": 4,
    "bookedStatus": true,
    "roomName": "Meeting Room X",
    "date": "2023-01-04",
    "startTime": "13:00",
    "endTime": "15:00"
  },
  {
    "bookingId": 5,
    "customerName": "Eva Gonzalez",
    "roomId": 5,
    "bookedStatus": true,
    "roomName": "Executive Suite",
    "date": "2023-01-05",
    "startTime": "11:00",
    "endTime": "13:00"
  }
]

//middlewares
app.use(bodyParser.json())

// ................Home page
app.get("/", (req, res) => {
  res.send(`
  
  <h1 style="text-align: center;">
      Hello Welcome to Naveen hotel Bookings
  </h1>
    <div style="display:flex; justify-content:center;padding:20px;"> 
    <div style=" background-color:blue; padding:20px;"> 
    <p style="color:white;background-color:white; padding:10px 40px; margin:10px 20px; text-align:center ">
      <a href="/rooms/booked" style="text-decoration:none;color:black;">Rooms Booked</a>
    </p>
    <p style="color:white;background-color:white; padding:10px 5px; margin:10px 20px; text-align:center ">
    <a href="/customers/booked"  style="text-decoration:none;color:black;">Customers Booked</a></p>
    <p style="color:white;background-color:white; padding:10px 5px; margin:10px 20px; text-align:center ">
    <a href="/customers/John%20Doe/booking-history"  style="text-decoration:none;color:black;">Customers History</a></p>
    </div>
    </div>


    `)
})


// 1. Create a Room
app.post('/createRoom', (req, res) => {
  const { roomName, seatsAvailable, amenities, price_per_hr } = req.body;
  const room = {
    roomId: rooms.length + 1,
    bookedStatus: false,
    roomName,
    seatsAvailable,
    amenities,
    price_per_hr
  }

  rooms.push(room)
  res.json({
    message: 'Room created sucessfully',
    room
  });
})

// 2. Book a Room
app.post("/bookRoom", (req, res) => {
  const { customerName, date, startTime, endTime, roomId, roomName } = req.body;
  const room = rooms.find((r) => r.roomId === parseInt(roomId));
  console.log(room)
  if (!room || room.seatsAvailable === 0) {
    return res.status(400).json({ message: 'Invalid Room ID or Room is fully booked.' });
  }

  // check if already booking or not
  const existingBooking = bookings.find((booking) => {
    return (
      booking.roomId === room.roomId &&
      booking.date === date &&
      ((startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime))
    );
  });

  if (existingBooking) {
    return res.status(400).json({ message: 'Room is already booked for the specified date and time.' });
  }
  const newBooking =
  {
    bookingId: bookings.length + 1,
    customerName,
    bookedStatus: true,
    date,
    startTime,
    endTime,
    roomId,
    roomName,

  };
  bookings.push(newBooking);
  room.seatsAvailable--;
  res.send({ message: 'Room booked successfully', newBooking })

})


// 3. List all Rooms with Booked Data
app.get("/rooms/booked", (req, res) => {
  const bookedRooms = bookings.map((booking) => {
    const room = rooms.find((r) => r.roomId === booking.roomId);
    return {
      roomName: booking.roomName,
      bookedStatus: booking.bookedStatus,
      customerName: booking.customerName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    }
  });
  res.send(bookedRooms);


})


// 4. List all Customers with Booked Data
app.get("/customers/booked", (req, res) => {
  const bookedCustomer = bookings.map((booking) => {
    const room = rooms.find((r) => r.roomId === booking.roomId)

    return {
      customerName: booking.customerName,
      roomName: booking.roomName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    }
  })
  res.json(bookedCustomer)
})


// 5. List how many times a customer has booked the room
app.get('/customers/:customerName/booking-history', (req, res) => {
  const customerName = req.params.customerName;
  const customerBookingHistory = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => {
      const room = rooms.find((r) => r.roomId === booking.roomId);
      return {
        roomName: booking.roomName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingId: booking.bookingId,

        bookingStatus: 'Confirmed',
      };
    });
  res.json({ customerName, Booking_History: customerBookingHistory });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})