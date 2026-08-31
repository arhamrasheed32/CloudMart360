# CloudMart 360 - Cloud-Based Retail Management & E-Commerce Platform
## Module 1: Product Management (Production SaaS Grade)

CloudMart 360 is an enterprise-grade, cloud-native retail management and e-commerce platform. **Module 1 (Product Management)** delivers an end-to-end, high-performance catalog management system connecting a modern React UI with AWS Serverless infrastructure (Amazon API Gateway, AWS Lambda Node.js handlers, and Amazon DynamoDB).

---

## 🏛 Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLOUDMART 360 FRONTEND                          │
│  React 19 + Vite • Dark Premium Glass SaaS • Lucide Icons              │
│  • KPI Metrics • Product Table & Card Grid • Search / Filter / Sort    │
│  • Slide-Over Add/Edit Drawer • Details Modal • Delete Confirmation    │
│  • Toast Feedback System • Skeletons & Resilient Error States          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   AMAZON API GATEWAY / PROXY SERVER                    │
│  • GET    /api/products       • POST   /api/products                   │
│  • GET    /api/products/{id}  • PUT    /api/products/{id}              │
│  • DELETE /api/products/{id}  • GET    /api/status                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ AWS Lambda Event Bridge
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      AWS LAMBDA HANDLERS (Node.js)                     │
│  • getProducts.js     • createProduct.js     • updateProduct.js        │
│  • getProduct.js      • deleteProduct.js     • validators.js           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ AWS SDK v3 (@aws-sdk/lib-dynamodb)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     AMAZON DYNAMODB (Products Table)                   │
│  Table: CloudMart360-Products                                          │
│  PK: id (String, UUID)                                                 │
│  Attributes: name, sku, category, price, costPrice, stock,             │
│              minStockThreshold, status, brand, description, imageUrl   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 24+)
- npm 9+

### 2. Running Locally

**Start the Backend & API Gateway Emulator (Port 5001):**
```bash
cd backend
npm install
npm start
```

**Start the Frontend React Dev Server (Port 3000):**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Validation

### Automated Backend Tests
Run the end-to-end Lambda CRUD & DynamoDB test suite:
```bash
cd backend
npm test
```

### Production Build
Build the optimized frontend distribution:
```bash
cd frontend
npm run build
```

---

## 📦 API Endpoints & Contract

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve catalog with search, category/status filters, sorting & KPI calculations | `200`, `500` |
| `GET` | `/api/products/{id}` | Retrieve single product details by ID | `200`, `404`, `500` |
| `POST` | `/api/products` | Create a new product with validation, auto-SKU generation & timestamps | `201`, `422`, `500` |
| `PUT` | `/api/products/{id}` | Update product pricing, stock, description or attributes | `200`, `404`, `422`, `500` |
| `DELETE` | `/api/products/{id}` | Permanently delete product from DynamoDB | `200`, `404`, `500` |
| `GET` | `/api/status` | System health check and serverless runtime status | `200` |

---

## 🎨 Design System: Dark Premium Glass SaaS

- **Color Tokens**: Obsidian/Charcoal background (`#080a0f`), CloudMart Coral Accent (`#FF5722`), Emerald Success (`#10B981`), Amber Low-Stock (`#F59E0B`), Rose Danger (`#EF4444`).
- **Glass Surfaces**: Multi-tiered glass layers (L0 base, L1 panels, L2 elevated cards, L3 modals/drawers) with backdrop blurs and subtle borders.
- **Accessibility**: Keyboard navigable (`/` for quick search, `Escape` to close drawers/modals, focus-visible indicators, ARIA dialogs & live status alerts).
- **Responsive**: Dynamic collapsible desktop sidebar, tablet rail, and full mobile drawer navigation.
