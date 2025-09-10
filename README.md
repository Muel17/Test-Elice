# Elice Full-Stack Learning Platform

This is the official submission for the Elice Full-Stack Engineer Challenge. It's a modern, full-stack web application designed as a comprehensive learning platform where students can search for educational resources, save content to a personal library, and track their learning progress.

---
## 📹 Video Demonstration

A complete video demonstration of the application's features, including user registration, login, content searching, and progress tracking, is available here:

**[PASTE THE LINK TO YOUR DEMO VIDEO HERE]**

---

## ✨ Core Features

* **Content Discovery:** A dynamic search interface to find learning resources from various sources.
* **Personalized Library:** Users can save and unsave content, creating a personalized collection of learning materials.
* **Progress Tracking:** Functionality to monitor and update learning progress (e.g., 'Not Started', 'In Progress', 'Completed').
* **RESTful API:** A well-structured backend API to manage all application data and logic.

---

## 🚀 Technology Stack

The project is built on the **PERN stack** with **TypeScript** for end-to-end type safety.

| Tier         | Technology                               |
| :----------- | :--------------------------------------- |
| **Frontend** | React, Vite, TypeScript                  |
| **Backend** | Node.js, Express.js, TypeScript          |
| **Database** | PostgreSQL with Drizzle ORM              |

---

## ⚙️ Getting Started (Local Setup)

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Muel17/Test-Elice.git
    cd Test-Elice
    ```

2.  **Configure Environment Variables:**
    In the `packages/backend` directory, copy the example environment file:
    ```bash
    cp packages/backend/.env.example packages/backend/.env
    ```
    Then, edit `packages/backend/.env` with your PostgreSQL database URL.

3.  **Install Dependencies:**
    From the root directory, run:
    ```bash
    npm install
    ```

4.  **Apply Database Schema:**
    Push the Drizzle ORM schema to your database:
    ```bash
    npm run db:push --workspace=@my-app/backend
    ```

5.  **Run the Application:**
    Start both the frontend and backend servers:
    ```bash
    npm run dev (front end)
    set PORT=5000 && npm start (back end)
    ```
    The application will be available at `http://localhost:5173`.

---

## 🏛️ Architecture Overview

The application is designed using a **three-tier client-server architecture** to ensure a clear separation of concerns, making the system scalable and maintainable.

1.  **Presentation Layer (Frontend):** A responsive **React Single-Page Application (SPA)** that runs in the user's browser. It is responsible for all UI rendering and user interactions. It communicates with the backend via RESTful API calls to fetch and display data.

2.  **Business Logic Layer (Backend):** A stateless **Node.js/Express REST API** serves as the central hub of the application. It handles all incoming HTTP requests, enforces business rules, manages user authentication, and orchestrates data flow between the client and the database.

3.  **Data Layer (Database):** A **PostgreSQL** database provides robust and reliable data persistence. All user information, content metadata, and progress tracking are stored here. The **Drizzle ORM** provides a type-safe layer for all database interactions.

---

## 📝 Critical Analysis

### What Works Well

* **Modular Structure:** The separation between the frontend and backend allows for independent development and deployment.
* **Type Safety:** The use of TypeScript and Drizzle ORM across the entire stack significantly reduces bugs and improves code quality.
* **Robust Data Model:** The PostgreSQL schema effectively models the relationships between users, content, and progress.

### Limitations

* **No Real-time Updates:** The application relies on a traditional request-response model. Updates require a manual refresh.
* **Basic Search Functionality:** The current search uses simple SQL queries, which could be slow with a large dataset and lacks advanced features.
* **No API Caching:** The API does not implement a caching strategy, leading to unnecessary database hits for repeated requests.

### Next Improvements

* **Implement WebSockets:** Integrate a library like Socket.IO to provide real-time updates.
* **Advanced Search Engine:** Replace the SQL-based search with a dedicated search engine like Elasticsearch for faster, more relevant results.
* **Introduce a Caching Layer:** Implement an in-memory data store like Redis to cache frequently accessed API responses.
