# Expense Tracker

A full-stack expense tracking web application built with **Node.js**, **React**, and **PostgreSQL**. Track daily expenses, set monthly budgets, filter and analyze spending, and export your data — all in one place.

**Live Demo:** [https://trackerexpenses.vercel.app/](https://trackerexpenses.vercel.app/)

---

## Features

- 🔐 **Authentication** — Register, login and logout with JWT stored in httpOnly cookies
- 💸 **Add Expenses** — Log expenses with amount, description, date and category
- 🗂️ **Manage Categories** — Create new categories inline while adding an expense
- ✏️ **Edit Expenses** — Inline editing directly on the expense card
- 🗑️ **Delete Expenses** — Delete with a confirmation modal popup
- 🔍 **Filter Expenses** — Filter by category and date range
- 📊 **Spending Summary** — See total spent this month, all-time total, expense count, and top category
- 🎯 **Monthly Budgets** — Set spending limits per category per month with live progress bars
- ⬇️ **Export to CSV** — Download filtered expenses as a CSV file
- 👤 **Per-user Data** — Each user only sees their own expenses, categories and budgets
- 🎨 **Modern UI** — Built with Tailwind CSS with a clean, colorful design
- 🌐 **Production Ready** — Deployed with Supabase, Render and Vercel

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| PostgreSQL | Relational database |
| pg (node-postgres) | PostgreSQL client |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| cookie-parser | Cookie handling |
| cors | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|------------|---------|
| React (Vite) | UI framework |
| Tailwind CSS | Styling |
| Axios | HTTP client |

### Deployment
| Service | Purpose |
|---------|---------|
| Supabase | PostgreSQL database hosting |
| Render | Backend hosting |
| Vercel | Frontend hosting |

---

## Project Structure

```
Expense-Tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js      # Register, login, logout, getMe
│   │   │   ├── categoryController.js
│   │   │   ├── expenseController.js
│   │   │   └── budgetController.js    # Fetch and upsert budgets
│   │   ├── middleware/
│   │   │   └── authMiddleware.js      # JWT verification
│   │   ├── models/
│   │   │   ├── authModel.js           # User DB queries
│   │   │   ├── categoryModel.js       # Category DB queries
│   │   │   ├── expenseModel.js        # Expense DB queries
│   │   │   └── budgetModel.js         # Budget DB queries
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── expenseRoutes.js
│   │   │   └── budgetRoutes.js
│   │   ├── app.js                     # Express app setup
│   │   └── server.js                  # Server entry point
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── authApi.js             # Auth API calls
    │   │   ├── expenseApi.js          # Expense & category API calls
    │   │   └── budgetApi.js           # Budget API calls
    │   ├── components/
    │   │   ├── modals/
    │   │   │   ├── ConfirmModal.jsx
    │   │   │   ├── LoginModal.jsx
    │   │   │   └── RegisterModal.jsx
    │   │   ├── ExpenseFilter.jsx      # Filter by category and date range
    │   │   ├── ExpenseForm.jsx        # Add expense form
    │   │   ├── ExpenseList.jsx        # Expense list with edit/delete + CSV export
    │   │   ├── SummaryBar.jsx         # Spending summary cards
    │   │   ├── BudgetManager.jsx      # Set monthly budget limits
    │   │   ├── BudgetProgress.jsx     # Budget progress bars
    │   │   └── HomePage.jsx           # Landing page
    │   ├── utils/
    │   │   └── exportToCSV.js         # CSV export utility
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_category UNIQUE (user_id, name)
);

-- Expenses table
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_expense FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Budgets table
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  month DATE NOT NULL,
  limit_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_budget FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_category_budget FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_category_month UNIQUE (user_id, category_id, month)
);
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (local or cloud)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/itSanjaya/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Set up the database

Create a PostgreSQL database and run the SQL schema above to create all four tables.

### 3. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/expense_tracker
JWT_SECRET=your_long_random_secret_here
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 4. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive cookie | No |
| POST | `/auth/logout` | Logout and clear cookie | No |
| GET | `/auth/me` | Get current user | Yes |

### Expense Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/expenses` | Get all expenses for user | Yes |
| POST | `/expenses` | Create a new expense | Yes |
| PUT | `/expenses/:id` | Update an expense | Yes |
| DELETE | `/expenses/:id` | Delete an expense | Yes |

### Category Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories for user | Yes |
| POST | `/categories` | Create a new category | Yes |

### Budget Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/budgets?month=YYYY-MM-DD` | Get budgets for a month | Yes |
| POST | `/budgets` | Create or update a budget | Yes |

---

## Deployment

### Database — Supabase
- Run the database schema SQL in the SQL Editor
- Copy the connection string from Project Settings → Database

### Backend — Render
- Connect your GitHub repository
- Set **Root Directory** to `backend`
- Set **Build Command** to `npm install`
- Set **Start Command** to `node src/server.js`
- Add environment variables:
  ```
    DATABASE_URL=your_supabase_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=production
    CLIENT_URL=your_vercel_frontend_url
    PORT=5000
  ```

### Frontend — Vercel
- Import your GitHub repository
- Set **Root Directory** to `frontend`
- Add environment variable:
  ```
  VITE_API_URL=your_render_backend_url
  ```
#### Deploy!

---

## Contributing

Contributions are welcome! Here's how to get started:

### 1. Fork the repository

Click the **Fork** button at the top right of this page.

### 2. Clone your fork

```bash
git clone https://github.com/itSanjaya/Expense_Tracker.git
cd Expense_Tracker
```

### 3. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make your changes

Follow the existing code style and structure:
- Backend: controllers → models → routes pattern
- Frontend: components in `src/components/`, API calls in `src/api/`
- Keep it simple — no over-engineering

### 5. Commit your changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commits:
- `feat:` — new feature
- `fix:` — bug fix
- `style:` — styling changes
- `refactor:` — code refactoring

### 6. Push and open a Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with a clear description of what you changed and why.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

Built with ❤️ as a full-stack learning project by [Sanjaya](https://github.com/itSanjaya).

> If you found this project helpful, please give it a ⭐ on GitHub!
