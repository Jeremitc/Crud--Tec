# Inventory Management System

## Overview

This project is a web-based **Inventory Management System** built with React and Express. It allows users to manage products, providers, and sellers through a user-friendly interface. The application includes user authentication, responsive design, and a modern UI with animations. Users can perform CRUD (Create, Read, Update, Delete) operations on products, providers, and sellers, making it a complete solution for small to medium-sized businesses to track their inventory and related entities.

The project is designed to be responsive, ensuring a seamless experience across devices (mobile, tablet, and desktop). It uses Tailwind CSS for styling, Framer Motion for animations, and Axios for API requests. The backend is powered by Express with a MySQL database for data persistence.

## Features

- **User Authentication**: Secure login and registration system with local storage-based session management.
- **Dashboard**: A central home page with navigation to manage products, providers, and sellers.
- **Product Management**:
  - Add, edit, and delete products.
  - View products in a table (desktop) or card layout (mobile).
  - Includes fields for product name, price, and stock.
- **Provider Management**:
  - Add, edit, and delete providers.
  - View providers in a grid layout with cards.
  - Includes fields for provider name, contact name, phone number, and address.
- **Seller Management**:
  - Add, edit, and delete sellers.
  - View sellers in a table (desktop) or card layout (mobile).
  - Includes fields for seller name, DNI, phone number, and address.
- **Responsive Design**: Fully responsive UI using Tailwind CSS, ensuring compatibility across all screen sizes.
- **Animations**: Smooth animations for UI elements using Framer Motion.
- **Error Handling**: Proper error messages for failed API requests and form validations.
- **Protected Routes**: Access to dashboard pages is restricted to authenticated users.

## Technologies Used

### Frontend
- **React**: JavaScript library for building the user interface.
- **React Router**: For client-side routing and navigation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: For animations and transitions.
- **Axios**: For making HTTP requests to the backend API.
- **React Icons**: For adding icons (e.g., `FaPlus`, `FaEdit`, `FaTrash`).

### Backend
- **Express**: Node.js framework for building the REST API.
- **MySQL**: Database for storing users, products, providers, and sellers.
- **Express Validator**: For request validation on the backend.
- **Node.js**: JavaScript runtime for the backend.

### Other Tools
- **NPM**: Package manager for managing dependencies.
- **Git**: Version control system.

## Project Structure

```
inventory-management-system/
├── src/
│   ├── auth/
│   │   └── auth_context.js        # Authentication context for managing user sessions
│   ├── components/
│   │   ├── common/
│   │   │   └── DashboardLayout.js # Layout component for dashboard pages
│   │   └── protected/
│   │       └── ProtectedRoute.js  # Component for protecting routes
│   ├── pages/
│   │   ├── Home.jsx               # Home dashboard page
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration page
│   │   ├── Products.jsx           # Product management page
│   │   ├── Provider.jsx           # Provider management page
│   │   ├── Seller.jsx             # Seller management page
│   │   └── NotFound.jsx           # 404 page
│   ├── Styles/
│   │   └── globals.css            # Global CSS styles
│   └── App.jsx                    # Main App component with routing
├── backend/
│   ├── connection/
│   │   └── db.js                  # MySQL database connection
│   ├── routes/
│   │   ├── productos.js           # API routes for products
│   │   ├── proveedores.js         # API routes for providers
│   │   └── vendedor.js            # API routes for sellers
│   └── server.js                  # Main Express server
├── package.json                   # Frontend dependencies and scripts
├── backend/package.json           # Backend dependencies and scripts
└── README.md                      # Project documentation
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8 or higher)
- **NPM** (comes with Node.js)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/inventory-management-system.git
cd inventory-management-system
```

### 2. Set Up the Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Configure the MySQL database:
   - Create a MySQL database named `inventory_db`.
   - Update the database configuration in `backend/connection/db.js` with your MySQL credentials:
     ```javascript
     const mysql = require('mysql2/promise');
     const pool = mysql.createPool({
       host: 'localhost',
       user: 'your-username',
       password: 'your-password',
       database: 'inventory_db',
       waitForConnections: true,
       connectionLimit: 10,
       queueLimit: 0
     });
     module.exports = pool;
     ```
4. Create the necessary tables in your MySQL database:
   ```sql
   CREATE TABLE usuarios (
       id_usuario INT AUTO_INCREMENT PRIMARY KEY,
       nombre VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL
   );

   CREATE TABLE productos (
       id_producto INT AUTO_INCREMENT PRIMARY KEY,
       nombre_producto VARCHAR(255) NOT NULL,
       precio DECIMAL(10, 2) NOT NULL,
       stock INT NOT NULL
   );

   CREATE TABLE proveedores (
       id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
       nombre_proveedor VARCHAR(255) NOT NULL,
       nombre_contacto VARCHAR(255) NOT NULL,
       celular VARCHAR(20) NOT NULL,
       direccion VARCHAR(255)
   );

   CREATE TABLE vendedor (
       id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
       nombre_vendedor VARCHAR(255) NOT NULL,
       dni VARCHAR(8) NOT NULL,
       celular VARCHAR(20) NOT NULL,
       direccion VARCHAR(255)
   );
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`.

### 3. Set Up the Frontend
1. Navigate to the root directory:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

### 4. Access the Application
- Open your browser and go to `http://localhost:3000`.
- Register a new user or log in with existing credentials.
- Navigate to the dashboard to manage products, providers, and sellers.

## Usage

1. **Login/Register**:
   - Register a new account at `/register`.
   - Log in at `/` with your credentials.
2. **Dashboard**:
   - After logging in, you’ll be redirected to `/home`.
   - Use the navigation to access Products (`/products`), Providers (`/provider`), or Sellers (`/seller`).
3. **Manage Entities**:
   - **Products**: Add, edit, or delete products. View stock levels and prices.
   - **Providers**: Manage provider details, including contact information.
   - **Sellers**: Manage seller details, including DNI and contact information.
4. **Logout**:
   - Use the logout functionality (if implemented) to end your session.

## API Endpoints

### Users
- `POST /api/usuarios/register`: Register a new user.
- `POST /api/usuarios/login`: Log in a user.

### Products
- `GET /api/productos`: Get all products.
- `POST /api/productos`: Create a new product.
- `PATCH /api/productos/:id`: Update a product.
- `DELETE /api/productos/:id`: Delete a product.

### Providers
- `GET /api/proveedores`: Get all providers.
- `POST /api/proveedores`: Create a new provider.
- `PATCH /api/proveedores/:id`: Update a provider.
- `DELETE /api/proveedores/:id`: Delete a provider.

### Sellers
- `GET /api/vendedores`: Get all sellers.
- `POST /api/vendedores`: Create a new seller.
- `PATCH /api/vendedores/:id`: Update a seller.
- `DELETE /api/vendedores/:id`: Delete a seller.

## Screenshots

*(You can add screenshots here by taking images of your application and placing them in a `screenshots/` folder, then linking them like this:)*

- Dashboard: ![Dashboard](screenshots/dashboard.png)
- Products Page: ![Products](screenshots/products.png)
- Providers Page: ![Providers](screenshots/providers.png)
- Sellers Page: ![Sellers](screenshots/sellers.png)

## Future Improvements

- **Search and Filter**: Add search and filtering capabilities for products, providers, and sellers.
- **Pagination**: Implement pagination for large datasets.
- **Advanced Validation**: Add more client-side validation to match backend rules.
- **User Profile**: Allow users to view and edit their profiles.
- **Improved Security**: Implement JWT for authentication and add password hashing.
- **Testing**: Add unit and integration tests using Jest and React Testing Library.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

*Built with ❤️ by [Your Name]*
