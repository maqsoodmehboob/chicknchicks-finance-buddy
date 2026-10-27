# Chick'n'Chicks Finance Hub

Build a complete web-based Financial Management Application for a restaurant 

called "Chick'n'Chicks". The app should have a Python Flask backend with 

SQLite database and a plain HTML/CSS/JavaScript frontend (no React). 

Use Tailwind CSS for styling and Chart.js for charts.

=== TECH STACK ===

- Frontend: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS, Chart.js

- Backend: Python 3.x, Flask, SQLAlchemy, Flask-CORS, Werkzeug

- Database: SQLite

- Architecture: REST API + Multi-page frontend (NOT single page)

- Fonts: Playfair Display (headings), Poppins (body)

- Color scheme: Primary teal (#14B8A6), Accent orange (#F59E0B)

=== FOLDER STRUCTURE ===

restaurant-finance-app/

├── frontend/

│   ├── index.html        (Dashboard)

│   ├── expenses.html     (Expense Management)

│   ├── employees.html    (Salary Management)

│   ├── assets.html       (Asset Tracking)

│   ├── loans.html        (Loan Management)

│   └── static/

│       ├── css/style.css

│       └── js/app.js

├── backend/

│   ├── app.py            (Main Flask app + all API routes)

│   ├── models.py         (All database models)

│   ├── config.py         (Config settings)

│   └── uploads/          (Auto-created for images)

=== DATABASE MODELS ===

1. Expense Table:

   - id (Primary Key)

   - category (String): Vegetables, Meat, Utilities, Rent, Transport, Miscellaneous

   - date (Date)

   - total_amount (Float)

   - paid_amount (Float)

   - remaining_amount → auto-calculated (total - paid)

   - status → auto-calculated: "Fully Paid" / "Partially Paid" / "Pending"

   - bill_image (String - file path)

   - notes (String)

2. Salary Table:

   - id (Primary Key)

   - employee_name (String)

   - department (String): Kitchen, Waitstaff, Management, Cleaning, Other

   - total_salary (Float) - monthly salary

   - paid_amount (Float)

   - remaining_salary → auto-calculated

   - payment_date (Date)

   - notes (String)

3. Asset Table:

   - id (Primary Key)

   - name (String)

   - category (String): Kitchen Equipment, Furniture, Vehicles, Utensils

   - purchase_date (Date)

   - purchase_price (Float)

   - bill_image (String - file path)

   - notes (String)

4. Loan Table:

   - id (Primary Key)

   - source (String) - bank/lender name

   - total_amount (Float)

   - paid_amount (Float)

   - remaining_amount → auto-calculated

   - installment_date (Date)

   - interest (Float)

   - notes (String)

=== API ENDPOINTS ===

GET    /api/dashboard    → returns today's expenses, monthly expenses, 

                           total salary due, outstanding loans, 

                           expense breakdown by category

GET    /api/categories   → returns all category lists

GET    /api/expenses     → list all expenses

POST   /api/expenses     → add new expense (with image upload)

GET    /api/salaries     → list all employees/salaries

POST   /api/salaries     → add new salary record

GET    /api/assets       → list all assets

POST   /api/assets       → add new asset (with image upload)

GET    /api/loans        → list all loans

POST   /api/loans        → add new loan

GET    /uploads/<path>   → serve uploaded images

=== IMAGE UPLOAD SYSTEM ===

- Use Werkzeug secure_filename()

- Expenses saved to: backend/uploads/expenses/[category]/[filename]

- Assets saved to: backend/uploads/assets/[category]/[filename]

- Max file size: 50MB

- Create category folders automatically if they don't exist

- Return image URL in API response

- Show image thumbnail in table rows

=== PAGE-BY-PAGE REQUIREMENTS ===

--- 1. DASHBOARD (index.html) ---

- Header with "Chick'n'Chicks" branding + current date

- Sidebar navigation with links to all 5 pages

- 4 metric cards (fetched live from /api/dashboard):

    * Today's Expenses (PKR)

    * This Month's Expenses (PKR)

    * Total Salary Due (PKR)

    * Outstanding Loans (PKR)

- Pie chart: Expense breakdown by category

- Line chart: Monthly expense trend

- All data loaded via fetch() from backend API

--- 2. EXPENSES PAGE (expenses.html) ---

- Form to add new expense:

    * Category dropdown

    * Date picker

    * Total amount (PKR)

    * Paid amount (PKR)

    * Bill image upload (with preview before submit)

    * Notes field

- Table showing all expenses with columns:

    * Category, Date, Total, Paid, Remaining, Status, Bill Image, Actions

- Status shown as colored badge:

    * Green = Fully Paid

    * Yellow = Partially Paid

    * Red = Pending

- "Record Payment" button per row → opens modal to enter payment amount

- "View Image" button per row → opens bill image

- "Delete" button per row

--- 3. EMPLOYEES PAGE (employees.html) ---

- Form to add new employee:

    * Employee name

    * Department dropdown (Kitchen, Waitstaff, Management, Cleaning, Other)

    * Monthly salary amount (PKR)

    * Notes field

- Table showing all employees:

    * Name, Department, Total Salary, Paid, Remaining, Actions

- "Pay Salary" button → modal with payment amount + date + notes

- Payment history section per employee showing all past payments

- "Delete Payment" functionality for corrections

--- 4. ASSETS PAGE (assets.html) ---

- Form to add new asset:

    * Asset name

    * Category dropdown (Kitchen Equipment, Furniture, Vehicles, Utensils)

    * Purchase date

    * Purchase price (PKR)

    * Bill/receipt image upload

    * Notes (warranty, model number, etc.)

- Table showing all assets:

    * Name, Category, Purchase Date, Price, Bill Image, Notes, Actions

- "View Receipt" button per row

- "Delete" button per row

--- 5. LOANS PAGE (loans.html) ---

- Form to add new loan:

    * Lender/Source name

    * Total loan amount (PKR)

    * Interest rate (%)

    * Installment date

    * Notes (purpose, terms)

- Table showing all loans:

    * Source, Total Amount, Paid, Remaining, Interest, Next Installment, Actions

- "Record Payment" button → modal for entering payment

- Status badge: Active / Cleared

=== UI/UX REQUIREMENTS ===

- Fully responsive: works on mobile, tablet, desktop

- Sidebar collapses to hamburger menu on mobile

- Active page highlighted in sidebar

- Loading spinner while API data is fetching

- Success/error toast notifications after form submissions

- Form validation before submission (no empty required fields)

- Confirm dialog before any delete action

- All amounts displayed in PKR format with commas (e.g., PKR 1,25,000)

- Tables have alternating row colors for readability

- Modal popups for payment recording (not new pages)

=== BACKEND REQUIREMENTS ===

- Flask app runs on http://localhost:5000

- Frontend files served from Flask (no separate server needed)

- Database auto-initializes on first run (no manual setup)

- CORS enabled for development

- All API responses in JSON format

- Error responses include descriptive messages

- Flask development server with debug=True for local use

=== SETUP & RUN ===

The app should work with these commands:

  cd backend

  pip install flask flask-cors flask-sqlalchemy werkzeug

  python app.py

Then open: http://localhost:5000/index.html

=== EXTRA NOTES ===

- All PKR currency (Pakistani Rupees)

- Restaurant name "Chick'n'Chicks" appears in header and page title

- No user authentication needed (single user app)

- Keep all JS in vanilla JavaScript (no React/Vue/Angular)

- Use fetch() API for all backend calls (no jQuery)

- Database file saved as: backend/restaurant_finance.db

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://chicknchicks-finance-buddy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b534af21-e069-406a-a6ff-c4426c210bdd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
