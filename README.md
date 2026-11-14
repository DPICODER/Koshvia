# Koshvia

> **A production-inspired multi-tenant inventory management backend built with Node.js, Express, Sequelize, and PostgreSQL.**

Koshvia is a backend-focused project that demonstrates how a scalable SaaS inventory platform can be structured using modular architecture, service-layer business logic, tenant isolation, audit logging, request validation, and transaction-safe inventory operations.

---

# Highlights

- Multi-tenant architecture
- JWT authentication
- Role-based authorization (RBAC)
- Modular feature-based architecture
- Sequelize ORM with PostgreSQL
- Inventory CRUD
- Transaction-safe stock adjustments
- Automatic inventory movement (audit trail)
- Joi request validation
- Centralized error handling
- Pagination support for inventory history

---

# Project Goals

Koshvia is designed to explore backend engineering practices rather than simply implementing CRUD operations.

Primary goals include:

- Building maintainable service-layer architecture
- Designing reusable business logic
- Enforcing tenant data isolation
- Implementing audit trails
- Using database transactions correctly
- Applying validation before business logic
- Creating production-inspired REST APIs

---

# Architecture

```
Client
   │
Express Router
   │
Controllers
   │
Services
   │
Sequelize ORM
   │
PostgreSQL
```

Controllers are responsible for HTTP orchestration only.

Services contain business logic.

Models represent persistence.

Middleware handles authentication, authorization, validation, and error handling.

---

# Folder Structure

```text
core/
 ├── db/
 ├── middleware/
 ├── utils/

modules/
 ├── auth/
 ├── tenants/
 ├── users/
 ├── invite/
 └── inventory/
```

Each module follows:

```
Routes
 ↓
Controller
 ↓
Service
 ↓
Model
```

---

# Inventory Module

Implemented features:

- Create inventory item
- Get inventory
- Get inventory item
- Update inventory item
- Add stock
- Remove stock
- Inventory movement history
- Movement history by item
- Pagination support

---

# Inventory Audit Trail

Every stock-changing operation creates a movement record.

Supported movement types:

- PURCHASE
- SALE
- ADJUSTMENT

Movement records include:

- movement_type
- quantity
- old_quantity
- updated_quantity
- difference_quantity
- remarks
- timestamps

Example:

| Action | Old | Change | New |
|------|----:|-------:|----:|
| Initial Stock | 0 | +100 |100|
| Purchase |100|+20|120|
| Sale |120|-5|115|
| Adjustment |115|-10|105|

---

# Multi-Tenant Design

Every protected query is scoped by `tenant_id`, ensuring organizations cannot access one another's data.

---

# Validation

Incoming requests are validated using Joi before reaching business logic.

Separate validation schemas are used for create/update operations where appropriate.

---

# Transactions

Operations that affect multiple tables execute inside Sequelize transactions to guarantee consistency.

Example:

1. Update inventory
2. Record movement
3. Commit

If any step fails, the transaction is rolled back.

---

# Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT
- bcrypt
- Joi

---

# Current Inventory API

| Method | Endpoint |
|---|---|
| POST | /inventory/items |
| GET | /inventory/items |
| GET | /inventory/items/:id |
| PATCH | /inventory/items/:id |
| PATCH | /inventory/items/:id/add-stock |
| PATCH | /inventory/items/:id/remove-stock |
| GET | /inventory/history |
| GET | /inventory/history/:id |

---

# Running Locally

## Install

```bash
npm install
```

## Configure

Create a `.env`

```env
PORT=3000
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASS=
DB_DIALECT=postgres

JWT_SECRET=
JWT_EXPIRES_IN=1d
```

## Migrate

```bash
npm run db:migrate
```

## Start

```bash
npm run dev
```

---

# Roadmap

## Inventory

- Duplicate SKU validation
- Soft delete
- Search
- Filters
- Sorting
- Dashboard statistics

## Authentication

- Refresh tokens
- Logout
- Password reset
- Email verification

## Core

- AppError hierarchy
- Rate limiting
- Swagger/OpenAPI
- Unit tests
- Structured logging

---

# Engineering Decisions

This project intentionally separates HTTP concerns from business logic by placing all business rules inside services.

Inventory changes are recorded through an audit trail instead of directly modifying stock without history.

Transactions ensure inventory updates and movement logs succeed or fail together.

---

# Status

Koshvia is actively under development and is being expanded feature by feature while maintaining clean architecture and production-inspired backend practices.
