# Node REST Uptime Monitor

A vanilla Node.js application with zero external dependencies that demonstrates how to build a complete web application from scratch. This project provides uptime monitoring for websites with WhatsApp notifications when sites go down.

## Educational Purpose

This project was created for educational purposes to demonstrate:

1. How to build a web server in Node.js **without any frameworks**
2. Implementing REST API principles with pure Node.js
3. Session-based authentication with tokens
4. File-based data storage without databases
5. Background workers for periodic tasks
6. Web template rendering system
7. Logging and log rotation systems
8. Frontend-Backend integration
9. Separation of concerns and modular design

## Project Architecture

### Core Modules

- **Server**: HTTP/HTTPS server implementation with custom router
- **Handlers**: Request handlers for both web UI and JSON API
- **Workers**: Background processes that check websites and send alerts
- **Data**: File-based data storage system
- **Helpers**: Utility functions (templating, hashing, notifications)
- **Logs**: Logging and log compression system

### Directory Structure

```
/
├── .data/              # Data storage (JSON files)
│   ├── users/          # User accounts
│   ├── tokens/         # Authentication tokens
│   └── checks/         # Uptime check configurations
├── .logs/              # Application logs
├── https/              # SSL certificates
├── lib/                # Core application modules
│   ├── config.js       # Environment configuration
│   ├── data.js         # Data storage operations
│   ├── handlers.js     # Request handlers
│   ├── helpers.js      # Utility functions
│   ├── logs.js         # Logging system
│   ├── server.js       # HTTP/HTTPS server
│   └── workers.js      # Background workers
├── public/             # Static assets
│   ├── app.css         # Stylesheet
│   ├── app.js          # Frontend JavaScript
│   └── logo.png        # Images
├── templates/          # HTML templates
│   ├── _header.html    # Common header
│   ├── _footer.html    # Common footer
│   ├── index.html      # Homepage
│   └── ...             # Other page templates
├── server.js           # Application entry point
└── README.md           # This file
```

## Features

### User Management
- Create account with phone number (for WhatsApp)
- Login/logout with token-based sessions
- Edit profile
- Delete account

### Uptime Monitoring
- Create HTTP/HTTPS checks for any website
- Configure protocols, methods, and success codes
- Set custom timeouts
- Background workers verify site status every minute
- Receive WhatsApp notifications when sites go down/up

### API Endpoints

#### User Management
- `POST /api/users` - Create user account
- `GET /api/users?phone=X` - Get user info (requires authentication)
- `PUT /api/users` - Update user data
- `DELETE /api/users?phone=X` - Delete user account

#### Authentication
- `POST /api/tokens` - Create authentication token (login)
- `GET /api/tokens?id=X` - Verify token
- `PUT /api/tokens` - Extend token validity
- `DELETE /api/tokens?id=X` - Delete token (logout)

#### Checks
- `POST /api/checks` - Create a new check
- `GET /api/checks?id=X` - Get check details
- `PUT /api/checks` - Update check configuration
- `DELETE /api/checks?id=X` - Delete check

## Key Learning Concepts

### 1. HTTP Server From Scratch
- Creating HTTP and HTTPS servers without Express
- Parsing URLs, headers, query strings, and payloads
- Custom router implementation
- Content type negotiation

### 2. Authentication System
- Password hashing with crypto module
- Token generation and verification
- Session management
- Route protection

### 3. File-Based Data Storage
- CRUD operations with the filesystem
- JSON data structure
- Atomicity in file operations
- Data relationships

### 4. Background Processing
- Creating worker processes
- Periodic task scheduling
- Managing state across processes
- Error handling in background tasks

### 5. Template System
- HTML template parsing and interpolation
- String replacement for dynamic content
- Composable templates with headers/footers
- Static asset serving

### 6. Logging System
- Writing logs to files
- Log rotation
- Compression with zlib
- Debugging patterns

## Getting Started

### Prerequisites
- Node.js v12+ (no npm packages required)
- For WhatsApp notifications: Twilio account

### Setup
1. Clone the repository
2. Create required directories:
   ```
   mkdir -p .data/{users,tokens,checks} .logs
   ```
3. Update Twilio credentials in `lib/config.js` (for notifications)
4. Generate SSL certificates for HTTPS (optional):
   ```
   mkdir https
   openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout https/key.pem -out https/cert.pem
   ```

### Running the Application
Start the server with:
```
node server.js
```

For production mode:
```
NODE_ENV=production node server.js
```

### Usage
1. Visit `http://localhost:3000` in your browser
2. Create an account with your WhatsApp number
3. Add websites to monitor
4. Receive notifications when your sites go down

## Advanced Concepts Demonstrated

- **Unified Request Handler**: Shared logic for HTTP and HTTPS
- **Payload Streaming**: Stream-based parsing of request bodies
- **Debug Logging**: Conditional debug output
- **Environment Management**: Staging vs Production configs
- **Input Validation**: Thorough validation of all user inputs
- **Error Handling**: Graceful error management across the application
- **Resource Cleanup**: Proper file descriptor management
- **String Interpolation**: Custom template rendering
- **Worker Process**: Background tasks with proper separation

## Why This Project Matters

Most Node.js tutorials focus on using Express, MongoDB, and other frameworks that abstract away core concepts. This project demonstrates how these frameworks work under the hood, giving you a deeper understanding of:

- HTTP protocol details
- Node.js's core modules
- Asynchronous patterns
- Error handling
- Security practices
- Application architecture

By studying this codebase, you'll gain insights that will make you a better Node.js developer, even when using higher-level frameworks.

## License

This project is open source and available under the MIT license.

## Acknowledgements

This project was inspired by the desire to understand Node.js at a fundamental level without relying on external dependencies or frameworks.
