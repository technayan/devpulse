# DevPulse
Internal Tech Issue & Feature Tracker
A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

### Live URL: <a href="https://devpulse-two-pi.vercel.app/">https://devpulse-two-pi.vercel.app/</a>

## Features
<ul>
  <li>Create New User</li>
  <li>Login User</li>
  <li>Create Issue - only maintainer and contributor can create an issue</li>
  <li>Get All Users</li>
  <li>Get Single Issue</li>
  <li>Update Issue - Only the maintainer can update any issues, but the contributor who created the issue can update the issue while the issue.status is open</li>
  <li>Delete Issue - Only the maintainer can delete Issue</li>
</ul>

## 🛠️ Technology Stack
<ul>
  <li>Node.js</li>
  <li>TypeScript</li>
  <li>Express.js</li>
  <li>PostgreSQL</li>
  <li>Raw SQL</li>
  <li>bcrypt</li>
  <li>jsonwebtoken</li>
</ul>

## Setup steps
First, we've initialized the data with Node.js and then installed Express.js. We've created our API endpoints according to the requirements in the route. We handled the response in the controller, and we've managed our database queries in the service. We've made a few protected routes with a user role. We've maintained user signup and login.

## API endpoint list
<ul>
  <li>User Registration: <a href="https://devpulse-two-pi.vercel.app/api/auth/signup">https://devpulse-two-pi.vercel.app/api/auth/signup</a></li>
  <li>User Login: <a href="https://devpulse-two-pi.vercel.app/api/auth/login">https://devpulse-two-pi.vercel.app/api/auth/login</a></li>
  <li>Create Issue: <a href="https://devpulse-two-pi.vercel.app/api/issues">https://devpulse-two-pi.vercel.app/api/issues</a></li>
  <li>Get All Users: <a href="https://devpulse-two-pi.vercel.app/api/issues">https://devpulse-two-pi.vercel.app/api/issues</a></li>
  <li>Get Single User: <a href="https://devpulse-two-pi.vercel.app/api/issues/1">https://devpulse-two-pi.vercel.app/api/issues/1</a></li>
  <li>Update User: <a href="https://devpulse-two-pi.vercel.app/api/issues/1">https://devpulse-two-pi.vercel.app/api/issues/1</a></li>
  <li>Delete User: <a href="https://devpulse-two-pi.vercel.app/api/issues/1">https://devpulse-two-pi.vercel.app/api/issues/1</a></li>
</ul>

## database schema summary
There are two tables in Database

### Users:
{
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

Users store name, email, password (hash), and role of the user.

### Issues:
{
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: number;
}

Issues store title, description, type, status, and reporter_id of the user.
