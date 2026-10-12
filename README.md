# MoneyMov

A full-stack money tracker that understands how people actually handle money. It separates real spending from savings and lending, so a committee (kameti) payment is not counted as an expense and money you lent is not counted as gone.

**Live demo:** https://moneymov.netlify.app

## Features

- **Four transaction types:** income, expense, investment (including committee/kameti) and lending, each treated correctly in your balance
- **Dashboard:** balance, income, sent out (with breakdown), savings rate, a category pie chart and an income vs sent out trend
- **Periods:** weekly, monthly, yearly or a custom date range
- **Custom categories** on top of sensible defaults
- **Multi-currency** (PKR, USD, EUR, GBP, INR, AED, SAR), with region-aware features such as committee tracking for PKR and INR
- **Personalised setup:** a short onboarding and Settings page to switch committee, lending and investments on or off
- **Account tools:** email verification, forgot and reset password, change password, delete account
- **In-app feedback**, saved to the database and sent to the admin by email
- Responsive dark UI, landing page and privacy policy

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Recharts, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Email | Nodemailer with Brevo SMTP |
| Hosting | Netlify (frontend), Render (backend) |

## Security

- Passwords hashed with bcrypt, and a server-side password policy (8+ characters, upper and lower case, a number and a symbol)
- JWT stored in an `httpOnly` cookie, with `Secure` and `SameSite=None` in production
- Password reset and email verification tokens are stored hashed and expire
- `helmet`, `express-mongo-sanitize` and `hpp`, plus a 10 KB request body limit
- Rate limiting on login, register and forgot password
- Every transaction and category route checks that the record belongs to the logged-in user

## Project structure

```
.
├── client/     React + Vite frontend
└── backend/    Node + Express API
```

## Run it locally

You need Node.js 20 or newer, a MongoDB connection string (Atlas or local) and SMTP credentials for the emails.

**1. Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development

SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=2525
SMTP_USER=your_smtp_login
SMTP_PASS=your_smtp_key
SMTP_FROM=a_verified_sender@example.com
ADMIN_EMAIL=where_feedback_should_arrive@example.com
```

```bash
npm run dev
```

**2. Frontend**

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open the URL Vite prints, and make sure it matches `CLIENT_URL` in the backend `.env`.

## Deployment notes

- Set `NODE_ENV=production` on the backend host so the cookie uses `Secure` and `SameSite=None`.
- Set `CLIENT_URL` to the exact frontend URL, with no trailing slash.
- Some hosts block SMTP port 587. Brevo also accepts port 2525.
- Render's free tier sleeps after inactivity, so the first request can be slow.

## Feedback

Found a bug or have an idea? Open an issue, or use the Send feedback button inside the app.
