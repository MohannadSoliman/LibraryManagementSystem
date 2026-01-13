const express = require('express');
const bookRoutes = require('./routes/books');
const borrowerRoutes = require('./routes/borrowers');
const borrowingRoutes = require('./routes/borrowings');
const reportsRouter = require('./routes/reports');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.use(express.json());

app.use('/books', bookRoutes);
app.use('/borrowers', borrowerRoutes);
app.use('/borrowings', borrowingRoutes);
app.use('/reports', reportsRouter);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(3000, () => console.log('Server running on port 3000'));
module.exports = app;

