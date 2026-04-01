# 🛒 Kafka-Based Microservices Order Processing System

This project implements an event-driven microservices architecture using Apache Kafka.

It simulates a real-world order processing workflow including:
- Order creation
- Inventory reservation
- Payment processing
- Order status updates

---

## 📌 Architecture Overview

The system consists of three independent services:
- order-service
- inventory-service
- payment-service

All services communicate asynchronously using Kafka events.

---

## 🔁 Event-Driven Flow

### 1. Order Creation
- Client calls: POST /orders
- order-service:
  - Stores order in DB
  - Publishes `Order_CREATED` → `order-events`

### 2. Inventory Reservation
- inventory-service consumes `Order_CREATED`
- Checks stock availability
- Creates reservation (PENDING)
- Publishes `STOCK_RESERVED` → `inventory-events`

### 3. Payment Processing
- payment-service consumes `STOCK_RESERVED`
- Simulates payment (mock/random)
- Publishes:
  - `PAID` → success
  - `FAILED` → failure
  to `payment-events`

### 4. Inventory Update
- inventory-service consumes payment events

If PAID:
- Reduces stock
- Marks reservation CONFIRMED
- Publishes `STOCK_REDUCED`

If FAILED:
- Releases reservation
- Publishes `STOCK_RELEASED`

### 5. Order Status Update
- order-service consumes inventory events

| Event           | Order Status |
|----------------|-------------|
| STOCK_REDUCED  | PAID        |
| STOCK_RELEASED | FAILED      |

---

## 🧩 Services & Responsibilities

### 🟢 order-service

#### HTTP API
- POST /orders → Create order

#### Kafka Producer
- Publishes `Order_CREATED` → `order-events`
- Payload includes:
  - orderId
  - items
  - amount

#### Kafka Consumer
- Listens to `inventory-events`
  - STOCK_REDUCED → Mark order PAID
  - STOCK_RELEASED → Mark order FAILED

---

### 🔵 inventory-service

#### HTTP API (Product Management)
- POST /inventory → Add product
- GET /inventory → List products
- GET /inventory/:productId → Fetch product
- DELETE /inventory/:productId → Delete product

#### Kafka Consumers
- From `order-events`:
  - Order_CREATED → Check stock & reserve → STOCK_RESERVED

- From `payment-events`:
  - PAID → Reduce stock → STOCK_REDUCED
  - FAILED → Release stock → STOCK_RELEASED

#### MongoDB Models
- Inventory → Product stock
- resInventory → Reservations per order

---

### 🟣 payment-service

#### Kafka Consumer
- Listens to `inventory-events`
  - STOCK_RESERVED → Process payment

#### Kafka Producer
- Publishes to `payment-events`:
  - PAID
  - FAILED

#### Note
- Payment is mocked (random success/failure)

---

## ⚙️ Environment Variables

### order-service (.env)
PORT=
MONGO_URI=
KAFKA_BROKER=

### inventory-service (.env)
PORT=
MONGO_URI=
KAFKA_BROKER=

### payment-service (.env)
PORT= (optional)
KAFKA_BROKER=

---

## ▶️ How to Run

### 1. Start Infrastructure
- Start Kafka
- Start Zookeeper (if required)
- Start MongoDB

### 2. Run Services (in separate terminals)

```bash
# order-service
npm run dev

# inventory-service
npm run dev

# payment-service
npm run dev
