# Lockdown Vinyl

A lightweight fullstack shop system built with React, Vite, Node.js and SQLite.

The project consists of three separate parts:

- public storefront
- admin dashboard
- backend API

Designed for small independent shops, local stores, vinyl collections, merch or curated products.

---

# Stack

## Frontend

- React
- Vite
- React Router

## Backend

- Node.js
- Express
- SQLite

## Authentication

- JWT
- bcrypt password hashing

---

# Features

## Storefront

- responsive product grid
- product detail pages
- image galleries
- product availability states
- email inquiry flow
- mobile-friendly layout
- animated UI elements

## Admin Dashboard

- password protected login
- create products
- update products
- upload product images
- publish / unpublish products
- password change flow
- local admin management

## Backend API

- REST API
- SQLite database
- image uploads
- JWT authentication
- login rate limiting
- CLI password reset support

---

# Project Structure

```txt
admin/      React admin dashboard
backend/    Express API + SQLite
shop/       Public storefront
```

---

# Local Development

## Backend

```bash
cd backend
npm install
npm run dev
```

API runs on:

```txt
http://localhost:4000
```

---

## Storefront

```bash
cd shop
npm install
npm run dev
```

Runs on:

```txt
http://localhost:5173
```

---

## Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

Runs on:

```txt
http://localhost:5174
```

---

# Authentication

The admin system uses JWT-based authentication with bcrypt password hashing.

Passwords are never stored in plain text.

The backend also includes:

- password reset CLI
- password change endpoint
- login protection / rate limiting

---

# Image Uploads

Uploaded images are stored locally and served through the backend.

The first uploaded image is automatically used as the product thumbnail.

---

# Database

SQLite is used for local development and lightweight deployments.

Main product fields:

```txt
- title
- description
- price
- thumbnail
- images
- published
```

---

# Current Status

The project is fully usable locally and includes:

- frontend shop
- admin dashboard
- authentication system
- product management
- image uploads
- SQLite persistence

The codebase is structured to be deployable later with services like:

- Nginx
- PM2
- Docker
- VPS hosting

---

# Future Ideas

- drag & drop image sorting
- WebP image optimization
- categories and tags
- stock management
- featured products
- order system
- Stripe integration
- audit logs
- recovery codes
- multi-admin support

---

# License

Private project / custom use.