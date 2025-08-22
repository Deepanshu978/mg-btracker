**Developer:** Deepanshu  
**Date:** August 2025

## Project Overview

MG BTracker is a full-stack web application that helps users manage their personal finances and group expenses with advanced features including transaction tracking, group expense splitting, detailed analytics, email notifications, and user profile management.

---

## Features

- Secure User Authentication (Login, Registration, Logout, Session Management)
- Personal Finance Tracking: income, expenses, savings with categorization
- Group Expense Management: create groups, split expenses, mark payments, track balances
- User Profile System: view and edit profile, change password, activity logs
- Email Notification System: transaction alerts, group invitations, payment confirmations
- Interactive Charts and Analytics using Chart.js
- Responsive and Modern User Interface
- Data Export to CSV
- Google reCAPTCHA integration (optional)
- Robust Security with password hashing, SQL injection prevention

---

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+), Chart.js, Font Awesome
- Backend: PHP 8+, MySQL 8, Apache 2.4
- Email: PHP mail with HTML templates
- Security: bcrypt password hashing, prepared statements, session-based auth

---

## API Endpoints

### Authentication API (`api/auth.php`)
- `POST ?action=login` - User login  
- `POST ?action=register` - User registration  
- `POST ?action=logout` - Logout  
- `GET  ?action=check`  - Session check  

### Transactions API (`api/transactions.php`)
- CRUD operations on personal transactions  
- Email notifications on transaction actions  

### Groups API (`api/groups.php`)
- Create/edit/delete groups and members  
- Add group expenses with automatic splitting  
- Mark expenses as paid  
- Get group balances and histories  
- Email notification triggers for all group activities  

### Profile API (`api/profile.php`)
- Get user profile info and stats  
- Edit profile details  
- Change password  
- Retrieve recent activity logs  

---

## Installation & Setup

1. Clone this repo/Upload files to your web server root.  
2. Configure `config/database.php` with your MySQL credentials.  
3. Import database schema (`database-schema.sql`).  
4. Set file permissions appropriately.  
5. Configure email settings in `includes/EmailNotifier.php`.  
6. (Optional) Configure Google reCAPTCHA keys in your login form and `auth.php`.  
7. Access your site via browser and register/login.

See `docs/perfect-setup-guide.md` for detailed installation instructions.

---

## Usage

- Use the login page to authenticate.  
- Navigate tabs for Personal, Groups, History, Analytics, and Profile.  
- Add transactions, create groups, add group expenses.  
- Track balances and debts with real-time updates.  
- Receive email notifications for important actions.  
- Export data for external analysis.

---

## Security Considerations

- Passwords are stored securely using bcrypt hashing.  
- All SQL queries use prepared statements to prevent injection.  
- Session management secures authenticated endpoints.  
- Optional Google reCAPTCHA integration for bot protection.

---

## Contact

Developed by Deepanshu  
For inquiries or contributions, please contact.

---
