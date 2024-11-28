// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);  // Menyimpan log error di console
    res.status(500).json({
      error: {
        message: err.message || 'Terjadi kesalahan pada server.',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null  // Hanya tampilkan stack trace di development
      }
    });
  };
  
  module.exports = errorHandler;
  