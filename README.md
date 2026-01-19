# Members Only 🕵️‍♂️

A full‑stack Node.js application where users can post anonymous messages to the public, while **club members** can see who wrote each post and interact with them inside a private clubhouse.

This project was built as part of **The Odin Project** curriculum to practice authentication, authorization, database design, and MVC architecture.

---

## ✨ Features

### Public users
- View a list of all messages
- See message content only (authors remain anonymous)

### Registered users (non‑members)
- Sign up and log in
- Create new posts
- See anonymous posts
- Join the club using a secret passcode

### Club members
- See post authors and timestamps
- Click messages to view full details
- Comment on other members’ posts
- Edit their own posts

### Admin users
- All member privileges
- Delete any post (only if it has no comments)
- Delete any comment

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Authentication:** Passport.js (Local Strategy), express-session
- **Database:** PostgreSQL
- **ORM/Querying:** pg (node-postgres)
- **Templating:** EJS
- **Styling:** Tailwind CSS (CDN)
- **Security:** bcrypt, express-validator
- **Architecture:** MVC (Models, Views, Controllers)

---

## 🧱 Database Schema

- **users**
  - username, first name, last name, email
  - password (hashed)
  - membership_status (boolean)
  - is_admin (boolean)

- **messages**
  - title, body, timestamps
  - belongs to a user

- **comments**
  - body, timestamp
  - belongs to a message and a user

Foreign key constraints ensure:
- Messages with comments cannot be deleted
- Data integrity between users, messages, and comments

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/disc3110/express-members-only.git
cd express-members-only
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/members_only
SESSION_SECRET=your_session_secret
MEMBER_PASSCODE=club123
ADMIN_PASSCODE=admin123
```

### 4. Create and seed the database

```bash
npm run db:schema
npm run db:seed
```

### 5. Start the server

```bash
npm run dev
```

Open your browser at:

```
http://localhost:3000
```

---

## 🧪 Test Accounts (from seed)

| Role  | Username | Password       |
|------|----------|----------------|
| Admin | admin    | Password123!   |
| Member | maria   | Password123!   |
| User  | diego   | Password123!   |

---

## 📚 What I Practiced

- User authentication and session management
- Role‑based authorization (public, member, admin)
- Secure password handling with bcrypt
- PostgreSQL relational design and constraints
- MVC project organization
- Server‑side rendering with EJS

---

## 🧠 Future Improvements

- Pagination for messages
- User profiles
- Markdown support for posts
- Tailwind build pipeline (instead of CDN)
- Better error pages

---

## 📝 License

This project is for educational purposes as part of **The Odin Project**.
