# Azure Blob Storage UPC File Explorer

This project is a full-stack application for browsing and downloading files from Azure Blob Storage, organized by UPC folders.

## Features
- React frontend for browsing UPC folders and files
- Node.js/Express backend for Azure Blob Storage API
- Download individual files or zip multiple selections
- Connection status indicators for backend and Azure Blob

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- An Azure Storage Account with a container containing UPC folders

### Setup
1. Clone this repository.
2. In the `backend` folder, create a `.env` file:
   ```env
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
   AZURE_STORAGE_CONTAINER=your_container_name_here
   ```
3. Install dependencies:
   - In `backend`: `npm install`
   - In `frontend`: `npm install`
4. Start the servers:
   - In `backend`: `npm start`
   - In `frontend`: `npm run dev`
5. Open your browser to the port shown in the frontend terminal (default: http://localhost:5173/ or http://localhost:5174/)

## Project Structure
- `backend/` — Node.js Express API for Azure Blob Storage
- `frontend/` — React app (Vite) for the user interface

## Notes
- The frontend proxies API requests to the backend using Vite's dev server proxy.
- The backend logs Azure Blob Storage connection status on startup.

## License
MIT
