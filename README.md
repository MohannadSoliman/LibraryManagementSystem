# Library Management System

A Node.js API to manage library operations, including books, borrowers, borrowings, and reporting. Fully Dockerized for quick setup and testing.

## Features
- Manage books and borrowers
- Checkout and return multiple books
- Track overdue books automatically
- Export reports (CSV/XLSX)
- In-memory caching for faster API responses

## Technologies Used

**Runtime & Frameworks**
- Node.js – JavaScript runtime  
- Express – Web framework for building APIs  

**Database & ORM**
- MySQL – Relational database  
- Sequelize – ORM for database management  

**API Middleware & Utilities**
- basic-auth – HTTP Basic Authentication  
- dotenv – Environment variable management  
- express-rate-limit – Rate limiting for APIs  
- express-validator – Request validation and sanitization  
- exceljs – Export data to Excel files  
- json2csv – Export data to CSV files  

**Development & Testing**
- nodemon – Auto-restart server during development  
- jest – Unit and integration testing  


## Prerequisites
- Node.js v18+
- npm
- Docker & Docker Compose
- Git

## Setup & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/MohannadSoliman/LibraryManagementSystem.git
   ```
2. Create a .env file in the project root like the one mentioned in the PDF file in `Documentation/AppSetup/` folder.

3. Run with Docker Compose:

    ```bash
    docker-compose up --build
    ```
4. Access the API at http://localhost:3000

## What's next?
1. Adding bulk queries for adding borrowing entries instead of hitting the database per entry.

2. Adding pagination for responses to avoid sending an overwhelming response.

3. Using more robust caching instead of basic in-memory caching, as the current assumption is that the data we’re dealing with isn’t too large.


## Documentation
Full API documentation and database schema can be found in the `Documentation` folder.