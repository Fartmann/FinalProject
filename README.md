# Elegant Jewelry E-Commerce Platform

This project is a full-stack e-commerce platform for selling jewelry, built using Node.js, Express, MongoDB, and JavaScript. It provides a seamless and secure online shopping experience for customers and efficient product management for administrators.

## Features

* **User Authentication:** Secure user registration and login with JWT.
* **Product Management (CRUD):** Administrators can create, read, update, and delete products.
* **Product Browsing:** Customers can browse and view product details.
* **Order Placement:** Customers can place orders.
* **Order History:** Customers can view their order history.
* **Admin Access Control:** Only administrators can manage products and users.
* **Password Hashing:** Secure password storage using bcrypt.
* **Query Optimization and Indexing:** Optimized database queries for performance.

## Technologies Used

* **Backend:**
    * Node.js
    * Express.js
    * MongoDB
    * Mongoose
    * JWT (JSON Web Tokens)
    * bcrypt
* **Frontend:**
    * HTML
    * CSS
    * JavaScript

## Getting Started

### Prerequisites

* Node.js and npm installed
* MongoDB installed and running

### Installation

1.  Clone the repository:

    ```bash
    git clone [repository URL]
    cd [repository directory]
    ```

2.  Install backend dependencies:

    ```bash
    cd backend
    npm install
    ```

3.  Install frontend dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

4.  Create a `.env` file in the `backend` directory and add the following environment variables:

    ```
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

    * Replace `your_mongodb_connection_string` with your MongoDB connection string.
    * Replace `your_jwt_secret` with a strong, randomly generated secret key.

5.  Run the backend server:

    ```bash
    cd ../backend
    npm start
    ```

6.  Open `frontend/index.html` in your browser.

## Database Setup

* Ensure your MongoDB database is running.
* The application uses Mongoose to interact with the database.
* The database will be automatically created if it doesn't exist.

## Admin Account

* To create a root admin account, you can manually insert a document into the `Users` collection in MongoDB.
* Use the following structure, replacing placeholders with your desired values and hashing the password using `bcrypt`:

    ```json
    {
        "username": "rootadmin",
        "email": "rootadmin@example.com",
        "password": "your_hashed_password",
        "isAdmin": true
    }
    ```

## API Endpoints

* **Authentication:**
    * `POST /auth/register`: Register a new user.
    * `POST /auth/login`: Log in a user.
    * `GET /auth/me`: Get the current user's information.
* **Products:**
    * `GET /products`: Get all products.
    * `GET /products/:id`: Get a single product.
    * `POST /products`: Create a new product (admin only).
    * `PUT /products/:id`: Update a product (admin only).
    * `DELETE /products/:id`: Delete a product (admin only).
* **Orders:**
    * `POST /orders`: Create a new order.
    * `GET /orders`: Get all orders (admin only).

## Future Improvements

* Shopping cart functionality.
* Payment gateway integration.
* Order tracking.
* User reviews and ratings.
* Advanced search and filtering.
* Responsive design for mobile devices.
* Personalized recommendations.
* Inventory management.
* Social media integration.
* SEO optimization.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

[Your License]
