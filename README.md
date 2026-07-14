# FundSpark — Crowdfunding Platform

FundSpark is a full-stack crowdfunding platform where Creators launch campaigns for projects, causes, and products, Supporters discover and contribute credits toward campaigns they care about, and Admins oversee approvals, payouts, and platform health. Built as a role-based, three-dashboard MERN-style application with modern authentication and real payment processing.

## 🔗 Live Links

- **Live Site (Frontend):** https://fund-spark-client.vercel.app
- **Backend API:** https://fundspark-server.onrender.com
- **Client GitHub Repository:** https://github.com/YOUR_USERNAME/YOUR_CLIENT_REPO
- **Server GitHub Repository:** https://github.com/YOUR_USERNAME/YOUR_SERVER_REPO

## 🔑 Admin Credentials

- **Admin Email:** admin@fundspark.com
- **Admin Password:** (set via manual role promotion in MongoDB Atlas — see Admin Access note below)

> **Note:** Registration only allows Supporter or Creator roles by design (per platform security rules). The admin account was promoted manually in the database, and is not self-registerable — this is intentional, matching how most real-world platforms protect elevated privileges.

## ✨ Key Features

- **Three fully separated role-based dashboards** — Supporter, Creator, and Admin — each with its own sidebar navigation, home stats, and permitted actions, enforced by middleware on both the route and database level.
- **Dual authentication system** powered by Better Auth, supporting both email/password registration with strength validation and one-click Google OAuth sign-in.
- **Automatic starting credits on signup** — Supporters receive 50 credits and Creators receive 20 credits exactly once, tracked to prevent duplicate grants even across repeated logins.
- **End-to-end campaign lifecycle** — Creators submit campaigns that stay hidden until Admin approval, after which they become publicly discoverable with live progress bars showing funds raised against the goal.
- **Real Stripe payment integration** for purchasing credit packages (100/300/800/1500 credits), using Stripe PaymentIntents and Elements rather than a simulated checkout.
- **Contribution approval workflow** — Supporter contributions sit as pending until the campaign's Creator approves (adding funds to the campaign) or rejects (automatically refunding the Supporter's credits).
- **Credit-to-cash withdrawal system** for Creators, enforcing a 200-credit ($10) minimum and converting at a fixed 20-credits-per-dollar platform rate, with Admin-side "Payment Success" confirmation.
- **Live notification system** — every key event (contribution approved/rejected, campaign approved/rejected, withdrawal processed) generates a real-time notification, delivered via a polling-based floating popup that closes on outside click.
- **Campaign reporting and moderation** — Supporters can flag suspicious or fraudulent campaigns with a reason, and Admins can suspend or permanently delete reported campaigns (with automatic refunds to affected Supporters).
- **Paginated contribution history** for Supporters, with server-side pagination rather than loading the entire dataset client-side.
- **Fully responsive design** across mobile, tablet, and desktop — including a collapsible mobile sidebar for all three dashboards — built with Tailwind CSS and animated using Framer Motion.
- **Public and authenticated browsing** — anyone can explore approved campaigns without logging in, while contributing requires a Supporter account, mirroring real crowdfunding platform UX.
- **Persistent sessions across reloads** — reloading any private dashboard route does not incorrectly redirect an authenticated user back to the login page.

## 🛠️ Tech Stack

**Frontend (client)**

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Swiper (hero slider, testimonials)
- Better Auth (React client)
- Stripe Elements (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Axios
- React Hot Toast
- Lucide React + React Icons

**Backend (server)**

- Node.js + Express.js
- MongoDB Atlas + Mongoose
- Better Auth (session verification via proxy)
- Stripe (Node SDK)
- Role-based middleware (session + role verification)

**Deployment**

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 👥 User Roles & Capabilities

| Role          | Capabilities                                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supporter** | Explore campaigns, contribute credits, purchase credit packages via Stripe, view contribution history (paginated), report suspicious campaigns, receive notifications |
| **Creator**   | Launch campaigns, manage/update/delete own campaigns, approve or reject incoming contributions, request credit withdrawals, view payment history                      |
| **Admin**     | Approve/reject campaigns, manage all users and roles, manage/delete any campaign, process withdrawal requests, review and act on reports                              |

## 📂 Project Structure
