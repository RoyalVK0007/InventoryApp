# Inventory Management System

A full-stack Inventory Management System built with Spring Boot 3 (backend) and React + Vite (frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, Hibernate |
| Database | MySQL 8 |
| Auth | Google OAuth 2.0 (ID token verification) + JWT |
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router DOM |

---

## Project Structure

```
inventory_mgmt/
├── backend/          # Spring Boot Maven project
└── frontend/         # React Vite project
```

---

## 1. MySQL Setup

```sql
CREATE DATABASE inventory_management;
CREATE USER 'inv_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON inventory_management.* TO 'inv_user'@'localhost';
FLUSH PRIVILEGES;
```

Hibernate will auto-create all tables on first run (`ddl-auto=update`).

---

## 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth 2.0 Client ID**.
5. Application type: **Web application**.
6. Add Authorized JavaScript origins:
   - `http://localhost:5173`
7. Add Authorized redirect URIs:
   - `http://localhost:5173`
8. Copy the **Client ID** (you do NOT need the Client Secret for this flow).

---

## 3. Backend Configuration

Set these environment variables before running (or edit `application.properties` for local dev):

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `inventory_management` |
| `DB_USER` | MySQL username | `inv_user` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456.apps.googleusercontent.com` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `a-very-long-random-secret-key-here` |
| `JWT_EXPIRATION_MS` | Token expiry in ms | `86400000` (24h) |

### Run the backend

```bash
cd backend

# Option A: Set env vars inline (Windows CMD)
set DB_PASSWORD=your_password
set GOOGLE_CLIENT_ID=your-client-id
set JWT_SECRET=your-secret-key-at-least-32-characters-long
mvn spring-boot:run

# Option B: Package and run
mvn package -DskipTests
java -jar target/inventory-backend-1.0.0.jar
```

Backend starts on: `http://localhost:8080`

---

## 4. Frontend Configuration

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on: `http://localhost:5173`

---

## 5. API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/google` | Public | Exchange Google ID token for JWT |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Required | List all products |
| POST | `/api/products` | Required | Create product |
| GET | `/api/products/{id}` | Required | Get product by ID |
| PUT | `/api/products/{id}` | Required | Update product |
| DELETE | `/api/products/{id}` | Required | Delete product |
| GET | `/api/products/search?keyword=` | Required | Search by name or SKU |
| GET | `/api/products/category/{category}` | Required | Filter by category |
| GET | `/api/products/low-stock` | Required | Products with qty < 10 |

### Stock
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/products/{id}/stock/in` | Required | Add stock |
| POST | `/api/products/{id}/stock/out` | Required | Remove stock |
| GET | `/api/products/{id}/stock/history` | Required | Movement history |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/summary` | Required | Summary counts + low stock list |
| GET | `/api/dashboard/recent-products` | Required | Last 10 added products |

### Request/Response Examples

**POST /api/auth/google**
```json
// Request
{ "idToken": "<google-id-token>" }

// Response
{
  "token": "<jwt>",
  "name": "John Doe",
  "email": "john@example.com",
  "pictureUrl": "https://..."
}
```

**POST /api/products**
```json
// Request (Authorization: Bearer <jwt>)
{
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "Electronics",
  "description": "15-inch laptop",
  "quantity": 50,
  "price": 999.99,
  "supplier": "TechCorp"
}
```

**POST /api/products/{id}/stock/in**
```json
{ "quantity": 20, "note": "Restocked from supplier" }
```

---

## 6. Features

- Google Sign-In with secure server-side token verification
- JWT-based stateless authentication
- Full Product CRUD with duplicate SKU prevention
- Search by name/SKU, filter by category
- Stock In / Stock Out with movement history
- Negative stock prevention
- Dashboard with summary cards and low-stock alerts
- Responsive sidebar layout

---

## 7. Running Tests

```bash
cd backend
mvn test
```

The context load test uses an H2 in-memory database — no MySQL required for tests.
