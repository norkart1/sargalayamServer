# College Rank List - Backend API

## Overview
This is a Node.js backend application for managing college rankings with team and program management functionality. The application provides REST APIs for teams, programs, and admin operations with MongoDB database integration and Socket.IO for real-time features.

## Application URLs
- **Frontend Client**: https://sargalayam-client.onrender.com/ (hosted on Render)
- **Admin Dashboard**: https://admin-29iy.onrender.com (hosted on Render)
- **Backend API**: https://6d1f1e89-cf11-4e66-af35-b43c64ba7417-00-kt1lw9j04i8h.sisko.replit.dev/ (hosted on Replit)

## Project Status
- **Setup Date**: September 18, 2025
- **Current State**: Successfully configured for Replit environment
- **Database**: Connected to MongoDB Atlas
- **Server**: Running on port 5000 with 0.0.0.0 binding for Replit compatibility

## Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO integration
- **File Upload**: Multer middleware for image uploads
- **Authentication**: JWT-based authentication

## API Endpoints

### Admin Routes (`/admin`)
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout

### Teams & Programs Routes (`/teams`)
- `GET /teams/getAllteams` - Get all teams
- `GET /teams/getTeamById/:id` - Get team by ID
- `POST /teams/addteam` - Add new team
- `PUT /teams/updateteamBy/:id` - Update team
- `DELETE /teams/deleteteamBy/:id` - Delete team
- `GET /teams/getTeamsByProgram/:id` - Get teams by program

### Program Management
- `GET /teams/getAllPrograms` - Get all programs
- `POST /teams/createProgram` - Create new program
- `PUT /teams/updateProgram/:id` - Update program
- `DELETE /teams/deleteProgramById/:id` - Delete program
- `POST /teams/addTeamToProgram` - Add team to program
- `GET /teams/getTeamProgramDetails` - Get team-program details
- `PUT /teams/editTeamInProgram` - Edit team in program
- `DELETE /teams/deleteTeamFromProgram` - Remove team from program

## Configuration
- **Host**: 0.0.0.0 (required for Replit environment)
- **Port**: 5000 (from environment variables)
- **Database**: MongoDB Atlas with connection string in environment variables
- **Static Files**: Served from `./public` directory
- **File Uploads**: Stored in `./public/teamImages/` and `./public/programImg/`

## Environment Variables
- `MONGO_URL`: MongoDB connection string
- `PORT`: Server port (defaults to 5000)
- `JWT_SECRET`: JWT signing secret

## Deployment
- **Target**: Autoscale deployment
- **Command**: `npm start`
- **Build Process**: None required (direct Node.js execution)

## Recent Changes
- **Server Binding**: Updated to bind to 0.0.0.0 for Replit compatibility
- **MongoDB Options**: Removed deprecated useNewUrlParser and useUnifiedTopology options
- **Deployment**: Configured for Replit autoscale deployment

## Dependencies
- express: Web framework
- mongoose: MongoDB ODM
- socket.io: Real-time communication
- cors: Cross-origin resource sharing
- multer: File upload handling
- jsonwebtoken: JWT authentication
- dotenv: Environment variables
- nodemon: Development server (auto-restart)