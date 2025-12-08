# Local Development Installation
This is a Next.js project bootstrapped with create-next-app.

## Prerequisites

Node.js v20.19.6 (LTS) or later
One of the following package managers:

npm (comes with Node.js)
Yarn
Bun

## Getting Started
### 1. Install Dependencies
Choose your preferred package manager:
#### Using npm:
```bash
npm install
```
#### Using Yarn:
```bash
yarn install
```
#### Using Bun:
```bash
bun install
```

> Note: If you encounter dependency issues with npm, you can perform a clean install:
```bash
rm -rf node_modules && rm -f package-lock.json && npm cache clean --force && npm install
```

### 2. Environment Configuration
Create a .env.local file in the root directory and add the required environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
Replace http://localhost:8000 with your backend server URL.

### 3. Run the Development Server
Using npm:
```bash
npm run dev
```
Using Yarn:
```bash
yarn dev
```
Using Bun:
```bash
bun dev
```

### 4. View the Application
Open http://localhost:3000 in your browser to see the application.
The page will auto-update as you edit files in the project.

Available Scripts:
- `dev` - Starts the development server
- `build` - Creates an optimized production build
- `start` - Runs the production server
- `lint` - Runs ESLint to check code quality
- `format` - Runs Prettier to format and standardize code style

### Troubleshooting
Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
# npm
npm run dev -- -p 3001

# yarn
yarn dev -p 3001

# bun
bun dev --port 3001
```

### Clean Installation
If you experience persistent dependency issues, try removing all cached data:
npm:
```bash
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
```
Yarn:
```bash
rm -rf node_modules yarn.lock .next
yarn cache clean
yarn install
```
Bun:
```bash
rm -rf node_modules bun.lockb .next
bun install
```
