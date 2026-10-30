# A full-stack Reddit-clone
### A full-stack Reddit-clone application built with React, Redux, Node.js, and PostgreSQL.

## [Live demo](https://reddit-clone-app-1234512345-fecf0e20e036.herokuapp.com/) · [Backend Repository](https://github.com/Anpes99/Reddit-Clone-Backend)


# Tech Stack
 - Frontend: React, Redux, JavaScript, Tailwind CSS, CSS, HTML
 - Backend: Node.js, Express.js, PostgreSQL, Sequelize ORM, Redis
 - Authentication & Validation: JWT, refresh-token rotation and revocation, email verification, Redis-backed API rate limiting, Joi
 - Email Services: Brevo, Nodemailer
 - Real-time Communication: Socket.IO
 - Storage: AWS S3
 - AI & Search: Voyage AI embeddings, semantic search
 - Deployment: Heroku


## Key Features

### Authentication & Security
- ✅ Password hashing
- ✅ JWT authentication and refresh-token rotation
- ✅ Refresh-token revocation using Redis to invalidate old or revoked refresh tokens, preventing their reuse and strengthening session security
- ✅ Mandatory email verification for all accounts, with hashed expiring database-stored tokens, resend functionality, and email delivery using Brevo and Nodemailer
- ✅ Secure email-based password recovery with a dedicated password reset page and hashed, database-stored reset tokens that expire after 30 minutes
- ✅ Authentication and role-based authorization
- ✅ CSRF protection through origin validation for state-changing API methods
- ✅ Security headers using Helmet, including clickjacking protection, Content Security Policy (CSP) to restrict resource loading and prevent unauthorized framing, and production-only HSTS with a one-year max age.
- ✅ Redis-backed rate limiting for login, signup, post and comment creation, and general API requests

### Backend & Database
- ✅ Express.js REST API
- ✅ PostgreSQL with Sequelize ORM
- ✅ Joi request validation

### Frontend
- ✅ Redux-based state management
- ✅ Responsive layouts for mobile and desktop

### Storage & Deployment
- ✅ AWS S3 image storage with server-side file size limits for image uploads
- ✅ Live application deployment on Heroku






## User

- ✅ Login & Logout
- ✅ User registration with mandatory email verification, expiring verification tokens, and email resend functionality
- ✅ Password recovery via email with a dedicated password reset page and 30-minute expiring reset tokens
- ✅ Edit user avatar, profile page background image and introduction
- ✅ User profile page with overview, posts, and comments feed tabs


## Subreddit

- ✅ Create subreddit
- ✅ Edit subreddit icon, subreddit page background image and description  (Moderator and Owner)
- ✅ Join subreddit
- ✅ Leave subreddit
- ✅ Search for subreddits
- ✅ Subreddit page with post feed
- ✅ Real-time count of authenticated users currently viewing each subreddit using Socket.IO
- ✅ Subreddit member count leaderboard: Automatically updates daily using a scheduled cron job, with rank-change indicators showing each subreddit's movement compared to the previous day's leaderboard


## Post

- ✅ Create post
- ✅ Vote post
- ✅ Add an image to a post
- ✅ Sort post feed by new and top
- ✅ Search for posts
- ✅ Infinite scrolling for posts
- ✅ Post page with comment section
- ✅ Real-time post vote count updates using Socket.IO


## Comments

- ✅ Create comment
- ✅ Vote comment
- ✅ Real-time comment vote count updates using Socket.IO
- ✅ Nested comments


## Search

- ✅ **Semantic post search** using Voyage AI embeddings to find relevant posts based on meaning, not just keywords
- ✅ Typo-tolerant subreddit search
- ✅ Search bar with subreddit suggestions


















### Homepage mobile view
<img width="233" height="411" alt="frontpage_mobile2" src="https://github.com/user-attachments/assets/7f728e5e-8803-4f76-b9ce-496e487c5552" />
















### Responsive web design
<img width="785" height="330" alt="frontpage_responsive3" src="https://github.com/user-attachments/assets/9fd5ece3-a52b-4f4c-8bdc-a2afb2ba1f64" />
















### Subreddit creation and customization
<img width="800" height="450" alt="subreddit_creation2" src="https://github.com/user-attachments/assets/5fd1dd6f-9c13-4a38-92a8-f03cf249b2b6" />






















### User creation and customization
<img width="800" height="450" alt="user_creation1" src="https://github.com/user-attachments/assets/749dd3d1-ea17-4520-9940-814085efffa4" />

















### Post creation
<img width="578" height="328" alt="post_creation6" src="https://github.com/user-attachments/assets/307c3f9e-54c6-40a2-9e34-fe61532adaf5" />

















### Post page and nested comments
<img width="800" height="450" alt="postpage3" src="https://github.com/user-attachments/assets/3b9a49a1-2830-4b1b-aa2d-4cb6d0a58437" />












### Search page and semantic search
<img width="355" height="638" alt="searchpage_mobile8" src="https://github.com/user-attachments/assets/3648dd38-47c8-468d-97e5-6bbac0beabae" />







## Database Diagram
<img width="1698" height="870" alt="db-diagram" src="https://github.com/user-attachments/assets/d13ce64f-3024-46b6-9591-d0e4c180a85f" />























