# Koshvia

> A backend-focused, multi-tenant inventory management API built with Node.js, Express.js, Sequelize, and PostgreSQL.

Koshvia is a backend engineering project focused on building a maintainable inventory management API with tenant-level data isolation, JWT authentication, modular architecture, request validation, inventory movement tracking, and transaction-safe stock operations.

## Highlights

- Multi-tenant inventory architecture
- JWT-based authentication
- Tenant-scoped inventory operations
- Modular feature-based architecture
- Service-layer business logic
- Sequelize ORM with PostgreSQL
- Inventory creation, retrieval, and updates
- Stock addition and reduction
- Inventory movement history
- Transaction-safe stock operations
- Row-level locking for concurrent stock updates
- Joi request validation
- Centralized error-handling middleware
- Pagination for inventory movement history

## Project Goals

Koshvia explores practical backend engineering concepts beyond basic CRUD implementation.

Primary goals:

- Build maintainable service-layer architecture
- Separate HTTP concerns from business logic
- Enforce tenant-level data isolation
- Maintain inventory movement history
- Implement reliable database transactions
- Handle concurrent stock modifications safely
- Apply request validation before business operations
- Design versioned REST APIs

## Architecture

```text
Client
  |
Express Router
  |
Middleware
  |
Controllers
  |
Services
  |
Sequelize ORM
  |
PostgreSQL
```

Responsibilities:

- **Routes:** Define API endpoints and middleware.
- **Middleware:** Handle authentication, request validation, and centralized errors.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Implement business rules and database operations.
- **Models:** Define database entities and persistence structure.

## Project Structure

```text
core/
 ├── db/
 │   ├── migrations/
 │   └── config.js
 ├── middleware/
 └── utils/

modules/
 ├── auth/
 ├── tenants/
 ├── user/
 ├── invite/
 └── inventory/
```

Feature modules separate their respective routes, controllers, services, and models.

## Inventory Module

Implemented functionality:

- Create inventory items
- Retrieve inventory items
- Retrieve individual inventory items
- Update inventory item details
- Add stock
- Remove stock
- Retrieve inventory movement history
- Retrieve movement history for an individual item
- Paginate general inventory movement history

Inventory deletion, search, and filtering are not currently implemented.

## Inventory Movement Tracking

Stock-changing operations generate inventory movement records.

Currently implemented movement operations:

| Operation | Movement type |
|---|---|
| Initial inventory creation | PURCHASE |
| Stock addition | PURCHASE |
| Stock reduction | SALE |

The database model also defines `RETURN`, `ADJUSTMENT`, and `DAMAGE` as supported movement types, but their corresponding workflows are not yet implemented.

Movement records contain:

- `movement_type`
- `quantity`
- `old_quantity`
- `updated_quantity`
- `difference_quantity`
- `remarks`
- Timestamps

Example:

| Operation | Previous | Change | Result |
|---|---:|---:|---:|
| Initial stock | 0 | +100 | 100 |
| Purchase | 100 | +20 | 120 |
| Sale | 120 | -5 | 115 |

Metadata-only item updates do not create stock movement records.

## Multi-Tenant Design

Inventory operations use the authenticated user's `tenant_id` to scope database queries.

This ensures that inventory records belonging to one tenant are not returned through another tenant's inventory queries.

## Authentication

Koshvia uses JSON Web Tokens (JWT) for authentication.

Protected inventory routes require a valid token in the HTTP Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Authentication and role-based authorization are separate concerns. Role-based access control is not currently implemented.

## Request Validation

Joi is used to validate incoming inventory requests.

Validation covers:

- Required item fields
- Item name and SKU constraints
- Quantity constraints
- Price constraints
- Stock operation quantities
- Update payload validation
- Image URL validation

## Transaction Management and Concurrency

Stock operations use Sequelize database transactions.

For stock addition and reduction:

1. Begin a database transaction.
2. Retrieve the inventory item within the tenant.
3. Acquire a row-level update lock.
4. Validate the stock operation.
5. Update the inventory quantity.
6. Record the corresponding inventory movement.
7. Commit the transaction.

If an operation fails, the transaction is rolled back.

This keeps the inventory quantity and its corresponding movement record consistent.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Sequelize | ORM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Joi | Request validation |

## API Reference

Base URL:

```text
/api/v1/inventory
```

All inventory endpoints require JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve inventory |
| POST | `/` | Create inventory item |
| GET | `/:id` | Retrieve an inventory item |
| PATCH | `/:id` | Update inventory item details |
| PATCH | `/items/:id/add-stock` | Add stock |
| PATCH | `/items/:id/remove-stock` | Remove stock |
| GET | `/history` | Retrieve inventory movement history |
| GET | `/history/:id` | Retrieve movement history for an item |

General movement history supports pagination through query parameters:

```text
GET /api/v1/inventory/history?page=1&limit=10
```

## Running Locally

### Prerequisites

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/DPICODER/Koshvia.git
cd Koshvia
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
APP_PORT=3000

DB_HOST=localhost
DB_NAME=koshvia_dev
DB_USER=your_postgres_user
DB_PASS=your_postgres_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Create the PostgreSQL database and configure a user with the required database permissions before running migrations.

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Roadmap

### Inventory

- Duplicate SKU validation
- Soft deletion
- Search and filtering
- Sorting
- Pagination for individual item history
- Dashboard-oriented inventory statistics
- Return, adjustment, and damage workflows

### Authentication and Authorization

- Refresh tokens
- Logout and token invalidation
- Password reset
- Email verification
- Role-based access control

### Core Engineering

- Consistent application error hierarchy
- Rate limiting
- Swagger / OpenAPI documentation
- Automated unit and integration tests
- Structured logging
- Improved API response consistency

## Engineering Decisions

Koshvia separates HTTP request handling from business logic through a modular controller-service architecture.

Inventory stock changes are tracked through movement records rather than silently modifying quantities.

Database transactions ensure that stock updates and their associated movement records succeed or fail together.

Row-level locking is used during stock adjustments to protect against conflicting concurrent modifications.

Tenant identifiers are included in inventory queries to enforce tenant-level data isolation.

## Project Status

Koshvia is an actively developed backend engineering project.

The current focus is improving API reliability, database consistency, validation, automated testing, and maintainability before expanding functionality.