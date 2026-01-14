# Library Management System

A professional Node.js API to manage library operations, including books, borrowers, borrowings, and reporting. Fully Dockerized for quick setup and testing.

## Features
- Manage books and borrowers
- Checkout and return multiple books
- Track overdue books automatically
- Export reports (CSV/XLSX)
- In-memory caching for faster API responses

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
2. Create a .env file in the project root like the on in `Documentation` folder.

3. Run with Docker Compose:

    ```bash
    docker-compose up --build
    ```
4. Access the API at http://localhost:3000

## Documentation
Full API documentation and database schema can be found in the `Documentation` folder.