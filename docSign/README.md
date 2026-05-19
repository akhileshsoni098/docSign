# DocSign Backend API

A complete Broker → Customer → Policy → Policy Signing backend system built with:

* Nuxt 3
* Nitro Server
* MongoDB
* Mongoose
* JWT Authentication
* Cloudinary File Upload
* TypeScript

---

# Features

* Broker Authentication
* Customer CRUD
* Policy CRUD
* Policy Assignment
* Policy Signing Flow
* JWT Protected APIs
* Cloudinary File Upload
* Clean TypeScript Architecture
* MongoDB Relations

---

# Tech Stack

* Nuxt 3
* Nitro
* MongoDB
* Mongoose
* TypeScript
* JWT
* bcryptjs
* Cloudinary

---

# Project Structure

```txt
server
│
├── api
│   ├── broker
│   │   ├── customer
│   │   ├── policy
│   │   ├── assignment
│   │   └── profile
│   │
│   └── public
│
├── middleware
│
├── model
│
├── services
│
├── types
│
└── utils
```

---

# Installation

## Clone Project

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
npm install
```

---

# Required Packages

```bash
npm install mongoose bcryptjs jsonwebtoken cloudinary
```

```bash
npm install -D typescript @types/node @types/jsonwebtoken
```

---

# Environment Variables

Create `.env`

```env
MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# Run Project

```bash
npm run dev
```

---

# Database Models

---

# Broker

```ts
name
email
password
role
```

---

# Customer

```ts
name
email
phone
address
```

---

# Policy

```ts
title
premium
coverage
duration
brokerId
documentUrl
documentPublicId
```

---

# Policy Assignment

```ts
brokerId
customerId
policyId
status
signingToken
signedFileUrl
signedFilePublicId
```

---

# Authentication Flow

## Broker Register

```http
POST /api/public
```

Body:

```json
{
  "name": "Akhilesh",
  "email": "akhil@gmail.com",
  "password": "123456"
}
```

---

## Broker Login

```http
POST /api/public/login
```

Body:

```json
{
  "email": "akhil@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

---

# Authorization

Protected routes require:

```http
Authorization: Bearer TOKEN
```

---

# Customer APIs

---

## Create Customer

```http
POST /api/broker/customer/create
```

Body:

```json
{
  "name": "Rohit",
  "email": "rohit@gmail.com",
  "phone": "9999999999",
  "address": "Mumbai"
}
```

---

## Get All Customers

```http
GET /api/broker/customer
```

---

## Get Single Customer

```http
GET /api/broker/customer/:id
```

---

## Update Customer

```http
PUT /api/broker/customer?id=CUSTOMER_ID
```

Body:

```json
{
  "name": "Updated Name"
}
```

---

## Delete Customer

```http
DELETE /api/broker/customer?id=CUSTOMER_ID
```

---

# Policy APIs

---

## Create Policy

```http
POST /api/broker/policy/create
```

Body:

```json
{
  "title": "Health Insurance",
  "premium": 5000,
  "coverage": "10 Lakh",
  "duration": "1 Year",
  "brokerId": "BROKER_ID"
}
```

---

## Get All Policies

```http
GET /api/broker/policy?brokerId=BROKER_ID
```

---

## Get Single Policy

```http
GET /api/broker/policy/:id
```

---

## Update Policy

```http
PUT /api/broker/policy?id=POLICY_ID
```

---

## Delete Policy

```http
DELETE /api/broker/policy?id=POLICY_ID
```

---

# Policy Assignment Flow

---

## Step 1

Broker creates customer.

---

## Step 2

Broker creates policies.

---

## Step 3

Broker assigns policy to customer.

---

## Step 4

A signing link is generated.

---

## Step 5

Customer opens signing link.

---

## Step 6

Customer uploads signed document.

---

## Step 7

Signed policy stored in Cloudinary.

---

# Policy Assignment API

## Generate Signing Link

```http
POST /api/broker/assignment/send
```

Body:

```json
{
  "customerId": "CUSTOMER_ID",
  "policyId": "POLICY_ID"
}
```

Response:

```json
{
  "success": true,
  "signLink": "/api/public/sign/TOKEN"
}
```

---

# Public Signing APIs

---

## Get Signing Details

```http
GET /api/public/sign/:token
```

---

## Upload Signed File

```http
POST /api/public/sign/:token
```

FormData:

```txt
signedFile
```

---

# Cloudinary Upload

Uploaded Files:

* Policy Documents
* Signed Policy Documents

Stored In:

```txt
docsign/policies
docsign/signed
```

---

# JWT Middleware

Protected Routes:

```txt
/api/broker/*
```

Public Routes:

```txt
/api/public/*
```

---

# Main Business Logic

## One Customer

Can Have:

* Multiple Policies
* Multiple Brokers

Therefore:

Customer model DOES NOT contain:

```ts
policyId
brokerId
```

Instead relation stored inside:

```ts
PolicyAssignment
```

---

# Future Improvements

* Email Sending
* OTP Verification
* Real Signature Canvas
* Audit Logs
* Admin Dashboard
* Notification System
* PDF Generation
* Role Based Access

---

# Author

Akhilesh Soni

---


