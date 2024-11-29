const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    try {
      console.log("Request body:", req.body);  // Log the entire request body
      
      const userId = req.user.id; // Assuming you're using middleware to get the user ID
      const { clientName, date, service, orderType, details, narrativeFile, mediaFile } = req.body;
  
      console.log("Received date:", date);  // Check if 'date' is present
  
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }
  
      // Memparse tanggal yang dikirimkan dalam format YYYY-MM-DD HH:mm
      const [datePart, timePart] = date.split(' '); // Split date and time
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      
      // Build the Date object in ISO format
      const parsedDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
  
      // Validasi tanggal
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
  
      const newOrder = await prisma.order.create({
        data: {
          clientName,
          date: parsedDate,  // Pass the valid Date object
          service,
          orderType,
          details,
          narrativeFile,
          mediaFile,
          userId, // Link to the user
        },
      });
  
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

  

module.exports = {
  createOrder,
};
