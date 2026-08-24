# Last-Mile Delivery Tracker

A full-stack logistics management platform designed to manage the complete last-mile delivery lifecycle — from shipment creation and dynamic pricing to agent assignment, shipment tracking, and delivery completion.

**Live Application:**

[https://last-mile-delivery-tracker-lovat.vercel.app/](https://last-mile-delivery-tracker-lovat.vercel.app/)

**Backend API:**

[https://lastmile-delivery-tracker-do8o.onrender.com](https://lastmile-delivery-tracker-do8o.onrender.com)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Objectives](#key-objectives)
- [User Roles](#user-roles)
- [Core Features](#core-features)
- [Shipment Lifecycle](#shipment-lifecycle)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Frontend](#frontend)
- [Backend](#backend)
- [Database Design](#database-design)
- [Pricing Engine](#pricing-engine)
- [Order Assignment](#order-assignment)
- [Tracking System](#tracking-system)
- [Authentication & Authorization](#authentication--authorization)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Testing the Application](#testing-the-application)
- [Engineering Decisions](#engineering-decisions)
- [AI Usage](#ai-usage)
- [Challenges & Solutions](#challenges--solutions)
- [Future Improvements](#future-improvements)
- [Limitations](#limitations)
- [Conclusion](#conclusion)

---

# Overview

**Last-Mile Delivery Tracker** is a role-based logistics platform that manages shipments from creation to final delivery.

The platform is designed around three primary users:

- **Customer** — creates shipments, receives pricing, views orders and tracks deliveries. 
- **Delivery Agent** — manages assigned deliveries, controls availability and updates delivery status. 
- **Admin** — manages the operational configuration, agents, orders, zones, areas and pricing rules. 

The application follows a controlled shipment lifecycle where each role is responsible for a specific part of the delivery process.

---

# Problem Statement

Last-mile delivery involves several operational challenges:

-  Creating and managing shipment orders 
-  Calculating delivery charges based on shipment characteristics 
-  Managing delivery zones and areas 
-  Assigning orders to delivery agents 
-  Tracking shipment progress 
-  Preventing invalid status transitions 
-  Managing delivery-agent availability 
-  Maintaining a history of shipment events 
-  Providing different capabilities to customers, agents and administrators 

The goal of this project is to provide a centralized platform that models these operations through a structured and role-based workflow.

---

# Solution

The platform provides an end-to-end shipment management system.

A typical shipment follows:

```
Customer
   │
   │ Create Shipment
   ▼
CREATED
   │
   │ Assignment
   ▼
ASSIGNED
   │
   │ Delivery Agent
   ▼
PICKED_UP
   │
   ▼
IN_TRANSIT
   │
   ▼
OUT_FOR_DELIVERY
   │
   ├───────────────┐
   ▼               ▼
DELIVERED        FAILED
```

Every important status change is recorded as a tracking event.

This allows customers and operational users to understand the complete history of a shipment.

---

# Key Objectives

The project focuses on:

1. **Role-based access control** 
2. **Shipment lifecycle management** 
3. **Dynamic delivery pricing** 
4. **Zone and area management** 
5. **Delivery-agent assignment** 
6. **Shipment tracking** 
7. **Controlled status transitions** 
8. **Agent availability management** 
9. **RESTful API architecture** 
10. **Production deployment** 

---

# User Roles

## Customer

Customers can:

-  Create shipments 
-  Select pickup and delivery areas 
-  Enter package dimensions and weight 
-  Select B2B/B2C order type 
-  Select prepaid/COD payment 
-  Calculate delivery pricing 
-  View their orders 
-  View order details 
-  Track shipment progress 
-  View tracking history 
-  Reschedule failed deliveries where supported 

---

## Delivery Agent

Delivery agents can:

-  View their profile 
-  Change availability 
-  View assigned shipments 
-  View shipment details 
-  View pickup and delivery information 
-  Update shipment status 
-  Mark shipments as picked up 
-  Mark shipments as in transit 
-  Mark shipments as out for delivery 
-  Mark shipments as delivered 
-  Mark failed deliveries with a reason 
-  Update their location where supported 

---

## Admin

Administrators can manage the operational side of the platform:

-  View operational dashboard 
-  Manage orders 
-  Manage delivery agents 
-  Manage zones 
-  Manage areas 
-  Configure rate cards 
-  Manage pricing rules 
-  Monitor shipment states 

---

# Core Features

## 1. Authentication

The application uses authentication to identify users and determine their role.

Supported roles:

```
CUSTOMER
DELIVERY_AGENT
ADMIN
```

Protected routes ensure that users can only access functionality appropriate to their role.

---

## 2. Shipment Creation

Customers create shipments through a multi-step workflow.

### Step 1 — Shipment Details

The customer selects:

-  Pickup area 
-  Drop area 
-  Order type 

The system resolves the corresponding zones.

### Step 2 — Package Details

The customer provides:

-  Length 
-  Breadth 
-  Height 
-  Actual weight 
-  Payment type 

### Step 3 — Pricing

The backend calculates:

-  Volumetric weight 
-  Billable weight 
-  Applicable zone type 
-  Applicable rate card 
-  Base charge 
-  COD surcharge 
-  Total charge 

### Step 4 — Confirmation

The customer confirms the shipment and the order is created.

---

# Shipment Lifecycle

The application implements an explicit state machine.


```
CREATED
   │
   ▼
ASSIGNED
   │
   ▼
PICKED_UP
   │
   ▼
IN_TRANSIT
   │
   ▼
OUT_FOR_DELIVERY
   │
   ├───────────────┐
   ▼               ▼
DELIVERED        FAILED
```

Allowed transitions are enforced by the backend.

```
const allowedTransitions = {
    CREATED: ["ASSIGNED"],

    ASSIGNED: ["PICKED_UP"],

    PICKED_UP: ["IN_TRANSIT"],

    IN_TRANSIT: [
        "OUT_FOR_DELIVERY",
    ],

    OUT_FOR_DELIVERY: [
        "DELIVERED",
        "FAILED",
    ],

    DELIVERED: [],

    FAILED: [],
};
```

Terminal states cannot transition further.

This prevents invalid operations such as:



```
DELIVERED → IN_TRANSIT
FAILED → DELIVERED
ASSIGNED → DELIVERED
```

---

# Architecture

The application follows a client-server architecture.


```
                  ┌─────────────────────┐
                  │      React Client   │
                  │                     │
                  │ Customer            │
                  │ Agent              │
                  │ Admin              │
                  └──────────┬──────────┘
                             │
                        REST APIs
                             │
                             ▼
                  ┌─────────────────────┐
                  │    Node.js Server   │
                  │     Express.js      │
                  ├─────────────────────┤
                  │ Authentication      │
                  │ Authorization       │
                  │ Order Management    │
                  │ Pricing             │
                  │ Assignment          │
                  │ Tracking            │
                  │ Admin Operations    │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │      MongoDB        │
                  │                     │
                  │ Users               │
                  │ Orders              │
                  │ Agents              │
                  │ Zones               │
                  │ Areas               │
                  │ Rate Cards          │
                  │ Tracking Events     │
                  └─────────────────────┘
```

---

# Technology Stack

## Frontend

-  React.js 
-  Vite 
-  React Router 
-  Axios 
-  React Icons 
-  CSS 

## Backend

-  Node.js 
-  Express.js 
-  MongoDB 
-  Mongoose 
-  JWT-based authentication 
-  REST APIs 

## Deployment

- **Frontend:** Vercel 
- **Backend:** Render 
- **Database:** MongoDB / MongoDB Atlas 

---

# Frontend

The frontend is structured around role-specific dashboards.


```
src/
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── agent.api.js
│   ├── area.api.js
│   ├── order.api.js
│   └── tracking.api.js
│
├── components/
│   ├── layout/
│   ├── orders/
│   └── ...
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   ├── auth/
│   ├── customer/
│   ├── agent/
│   └── admin/
│
└── routes/
    ├── AppRoutes.jsx
    └── ProtectedRoute.jsx
```

---

# Backend

The backend is organized by business domain rather than keeping all logic in a single controller.

Major modules include:

```
```

```
auth
orders
pricing
assignment
tracking
agents
zones
areas
rate-cards
notifications
```

This keeps business logic separated and makes the application easier to extend.

---

# Database Design

The application uses MongoDB with Mongoose.

Major models include:

### User

Stores:

-  Name 
-  Email 
-  Phone 
-  Role 
-  Active status 
-  Authentication information 

---

### Order

An order contains:

-  Order number 
-  Customer 
-  Pickup 
-  Drop 
-  Package 
-  Order type 
-  Payment type 
-  Delivery date 
-  Pricing 
-  Assignment 
-  Current status 

Example conceptual structure:


```
Order
 ├── customerId
 ├── pickup
 │    ├── address
 │    ├── areaId
 │    ├── zoneId
 │    ├── latitude
 │    └── longitude
 │
 ├── drop
 │    ├── address
 │    ├── areaId
 │    ├── zoneId
 │    ├── latitude
 │    └── longitude
 │
 ├── package
 ├── pricing
 ├── assignment
 └── status
```

---

### AgentProfile

Stores operational information about delivery agents such as:

-  Availability 
-  Active order count 
-  Location 
-  Agent/user relationship 

---

### Zone

Represents a delivery zone.

---

### Area

Represents a geographical delivery area mapped to a zone.

---

### RateCard

Defines pricing rules for different combinations of:

-  Order type 
-  Zone type 
-  Weight slabs 

---

### TrackingEvent

Stores immutable shipment status events.

Each event contains information such as:

-  Order 
-  Status 
-  Actor 
-  Actor role 
-  Metadata 
-  Timestamp 

---

# Pricing Engine

One of the core backend components is the pricing engine.

The system first resolves the pickup and drop areas and their corresponding zones.

```
Pickup Area
     ↓
Pickup Zone

Drop Area
     ↓
Drop Zone
```

The zone relationship determines whether the shipment is:


```
INTRA
```

or:

```
INTER
```

---

## Volumetric Weight

The system calculates volumetric weight using package dimensions.


```
Volumetric Weight =
Length × Breadth × Height / Volumetric Factor
```

The system then compares:


```
Actual Weight
        vs
Volumetric Weight
```

to determine the billable weight.

---

## Rate Slabs

The appropriate rate card is selected using:

```
Order Type
+
Zone Type
```

The corresponding weight slab determines the applicable rate.

Then:


```
Base Charge
    =
Rate per KG × Billable Weight
```

For COD shipments:


```
COD Surcharge
```

is added.

Finally:


```
Total Charge
=
Base Charge + COD Surcharge
```

The calculated pricing is stored with the order so that the order retains the pricing information used when it was created.

---

# Order Assignment

After a shipment is created, it can be assigned to a delivery agent.

The order stores assignment information such as:

```
Agent
Assignment Method
Assigned At
Assigned By
```

Assignment can support:

```
AUTO
MANUAL
```

The assigned agent then becomes responsible for progressing the shipment through the delivery lifecycle.

---

# Tracking System

Tracking is implemented using a dedicated `TrackingEvent` model.

Instead of storing only the current status:

```
Order.status = IN_TRANSIT
```

the application maintains the shipment history.

Example:


```
CREATED
     │
     ├── Customer
     │
     ▼
ASSIGNED
     │
     ├── Admin / Assignment
     │
     ▼
PICKED_UP
     │
     ├── Delivery Agent
     │
     ▼
IN_TRANSIT
     │
     ▼
OUT_FOR_DELIVERY
     │
     ▼
DELIVERED
```

This allows the frontend to display a tracking timeline.

---

# Agent Status Updates

Agents cannot arbitrarily change shipment states.

Before changing an order status, the backend checks:

1.  The order exists. 
2.  The order is assigned to the current agent. 
3.  The requested transition is valid. 
4.  The tracking event is created. 
5.  Notifications can be published. 
6.  The agent is released when the shipment reaches a terminal state. 

For example:


```
ASSIGNED → PICKED_UP
```

is valid.

But:


```
ASSIGNED → DELIVERED
```

is rejected.

---

# Agent Release

When an order reaches:

```
DELIVERED
```

or:

```
FAILED
```

the agent can be released from the completed shipment.

This prevents completed orders from continuing to count toward the agent's active workload.

---

# Authentication & Authorization

The application uses role-based authorization.

A protected route checks whether the authenticated user has the required role.

For example:


```
/customer/*
        ↓
CUSTOMER

/agent/*
        ↓
DELIVERY_AGENT

/admin/*
        ↓
ADMIN
```

The backend independently validates authorization, so frontend route protection is not treated as the primary security mechanism.

---

# API Overview

The application follows RESTful API principles.

## Authentication


```
POST /api/v1/auth/login
```

---

## Customer Orders

```
POST /api/v1/orders
GET  /api/v1/orders/my
GET  /api/v1/orders/:orderId
```

---

## Pricing

```
POST /api/v1/pricing/quote
```

---

## Agent

```
GET   /api/v1/agent/profile
GET   /api/v1/agent/orders
PATCH /api/v1/agent/availability
PATCH /api/v1/agent/location
```

---

## Agent Order Status

```
PATCH /api/v1/orders/:orderId/status
```

---

## Tracking

```
GET /api/v1/tracking/:orderId
```

> Exact API prefixes depend on the deployed server configuration.

---

# Project Structure

A simplified project structure:

```
last-mile-delivery-tracker/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   ├── agent/
│   │   │   └── admin/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# Environment Variables

## Frontend

Example:

```
VITE_API_BASE_URL=https://lastmile-delivery-tracker-do8o.onrender.com/api/v1
```

---

## Backend

Example:

```
PORT=5001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=https://last-mile-delivery-tracker-lovat.vercel.app
```

Use your actual environment variable names from the project rather than committing secrets to Git.

---

# Local Setup

## 1. Clone the repository

```
git clone https://github.com/Anurag-3112/LastMile-Delivery-Tracker
cd last-mile-delivery-tracker
```

---

## 2. Backend

```
cd server
npm install
```

Create the backend `.env` file:

```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Run:

```
npm run dev
```

The backend should start on:

```
http://localhost:5001
```

---

## 3. Frontend

Open another terminal:


```
cd client
npm install
```

Create:

```
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

Run:

```
npm run dev
```

The frontend should be available at:

```
http://localhost:5173
```

---

# Deployment

## Frontend

The React/Vite application is deployed on Vercel.

**Production URL:**

[https://last-mile-delivery-tracker-lovat.vercel.app/](https://last-mile-delivery-tracker-lovat.vercel.app/?utm_source=chatgpt.com)

---

## Backend

The Node.js/Express API is deployed on Render.

**Production API:**

[https://lastmile-delivery-tracker-do8o.onrender.com](https://lastmile-delivery-tracker-do8o.onrender.com?utm_source=chatgpt.com)

The deployed API currently responds successfully from its root endpoint. 

---

# Testing the Application

The recommended testing flow is to test the complete business lifecycle rather than individual pages only.

## Customer Flow

```
Login
  ↓
Customer Dashboard
  ↓
Create Shipment
  ↓
Select Pickup / Drop
  ↓
Enter Package Details
  ↓
Calculate Quote
  ↓
Confirm Shipment
  ↓
View Order
  ↓
Track Shipment
```

---

## Admin Flow

```
Login as Admin
      ↓
View Orders
      ↓
Manage Agents
      ↓
Configure Zones
      ↓
Configure Areas
      ↓
Configure Rate Cards
      ↓
Manage Assignment / Operations
```

---

## Agent Flow


```
Login as Agent
      ↓
Dashboard
      ↓
View Assigned Orders
      ↓
Open Shipment
      ↓
Mark Picked Up
      ↓
Mark In Transit
      ↓
Mark Out for Delivery
      ↓
Mark Delivered
```

Failure path:

```
OUT_FOR_DELIVERY
       ↓
Mark Failed
       ↓
Provide Reason
       ↓
FAILED
```

---

# Engineering Decisions

## Why role-based architecture?

Customers, agents and administrators have fundamentally different responsibilities.

Separating their capabilities reduces accidental access and makes the application easier to reason about.

---

## Why backend-controlled status transitions?

The frontend should not be trusted to enforce business rules.

For example, a malicious client could attempt:

```
PATCH /orders/:orderId/status

{
    "status": "DELIVERED"
}
```

without actually completing previous stages.

Therefore the backend validates:


```
Current State
      +
Requested State
      ↓
canTransition()
```

before modifying the order.

---

## Why store tracking events separately?

The current order status answers:

> "Where is the shipment now?"

The tracking events answer:

> "How did the shipment get here?"

Maintaining both gives the application a proper audit/history trail.

---

## Why store pricing inside the Order?

Pricing configuration can change later.

If a rate card changes after an order is created, the historical order should still retain the price that was calculated when it was created.

Therefore pricing information is stored as part of the order.

---

# AI Usage

AI was used as a development accelerator during the implementation process for areas such as:

-  Exploring UI/UX alternatives 
-  Generating initial component structures 
-  Reviewing code organization 
-  Identifying edge cases 
-  Improving error states and loading states 
-  Reviewing API contracts 
-  Generating documentation 
-  Debugging implementation issues 
-  Reviewing architecture and business workflows 

AI was treated as an **engineering assistance tool rather than a replacement for implementation or validation**.

Core business logic such as:

-  pricing calculation 
-  role authorization 
-  order state transitions 
-  assignment validation 
-  tracking 
-  agent release 

is implemented in the application backend and validated through the application's actual workflow.

---

# Challenges & Solutions

## Challenge 1 — Preventing Invalid Status Updates

### Problem

A shipment should not be able to jump directly from:

```
ASSIGNED → DELIVERED
```

### Solution

A centralized state machine controls valid transitions.


```
canTransition(
    currentStatus,
    nextStatus
)
```

The backend rejects invalid transitions.

---

## Challenge 2 — Tracking Shipment History

### Problem

Keeping only the current status loses historical information.

### Solution

A dedicated `TrackingEvent` model records each status transition.

---

## Challenge 3 — Pricing Based on Multiple Factors

### Problem

Delivery pricing depends on:

-  pickup zone 
-  drop zone 
-  order type 
-  weight 
-  package dimensions 
-  payment type 

### Solution

Pricing was separated into dedicated services responsible for:


```
Zone Resolution
       ↓
Zone Type
       ↓
Volumetric Weight
       ↓
Billable Weight
       ↓
Rate Card
       ↓
COD Surcharge
       ↓
Final Price
```

---

## Challenge 4 — Agent Workload

### Problem

Agents should not remain occupied after an order is completed.

### Solution

When an order reaches:


```
DELIVERED
```

or:


```
FAILED
```

the assignment service releases the agent.

---

# Future Improvements

Potential improvements include:

### Real-time tracking

Use WebSockets or Socket.IO for real-time status updates.

### Live agent location

Display delivery agents on a map using their location data.

### Route optimization

Use routing algorithms to optimize delivery sequences.

### Intelligent assignment

Automatically assign shipments using:

-  agent availability 
-  distance 
-  current workload 
-  delivery zone 

### Notifications

Add:

-  email notifications 
-  SMS 
-  push notifications 

for important shipment events.

### Proof of Delivery

Add:

-  OTP verification 
-  recipient confirmation 
-  signature 
-  delivery photo 

### Analytics

Add operational metrics such as:

-  average delivery time 
-  failed delivery percentage 
-  agent utilization 
-  zone-wise volume 
-  revenue 
-  SLA performance 

---

# Limitations

The current implementation focuses primarily on the core logistics workflow.

Some advanced production capabilities can be extended further, including:

-  real-time GPS tracking 
-  advanced route optimization 
-  production-grade notification infrastructure 
-  proof-of-delivery workflows 
-  advanced analytics 
-  automated dispatch optimization 

These can be introduced without changing the core shipment state-machine architecture.

---

# Live Demo

### Frontend

[**https://last-mile-delivery-tracker-lovat.vercel.app/**](https://last-mile-delivery-tracker-lovat.vercel.app/?utm_source=chatgpt.com)

### Backend

[**https://lastmile-delivery-tracker-do8o.onrender.com**](https://lastmile-delivery-tracker-do8o.onrender.com?utm_source=chatgpt.com)

Backend health response:



```
{
    "success": true,
    "message": "Last-Mile Delivery Tracker API is running"
}
```

---

# Conclusion

Last-Mile Delivery Tracker is designed as a complete role-based logistics platform rather than a simple CRUD application.

The core workflow connects:



```
Customer
   ↓
Shipment Creation
   ↓
Dynamic Pricing
   ↓
Order Assignment
   ↓
Delivery Agent
   ↓
Controlled Status Transitions
   ↓
Tracking Events
   ↓
Delivery / Failure
   ↓
Agent Release
```

The architecture separates frontend presentation, backend business logic, database models and operational services, allowing the platform to be extended toward real-time tracking, intelligent dispatch, notifications, route optimization and analytics.

---

## Assignment Submission

**Live Application:**

[https://last-mile-delivery-tracker-lovat.vercel.app/](https://last-mile-delivery-tracker-lovat.vercel.app/?utm_source=chatgpt.com)

**Backend API:**

[https://lastmile-delivery-tracker-do8o.onrender.com](https://lastmile-delivery-tracker-do8o.onrender.com?utm_source=chatgpt.com)

**Repository:**

`https://github.com/Anurag-3112`

**Developer:**

Anurag Kumar
