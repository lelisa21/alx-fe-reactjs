
# BookLibrary - A Modern Book Discovery Platform

## Overview
BookLibrary is a responsive web application for discovering, searching, and managing books. Built with React and integrated with the OpenLibrary API, it provides a seamless reading experience with personal tracking features.

## Features
- **Book Search**: Search millions of books by title, author, or genre
- **Category Browsing**: Explore books across 8 categories (Fiction, Science, Fantasy, etc.)
- **Reading List**: Save books to your personal reading list
- **Reading Progress**: Track your reading progress and set goals
- **User Profiles**: Create accounts to save preferences and reading history
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## Tech Stack
- **Frontend**: React 18 with React Router
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Integration**: OpenLibrary REST API
- **Deployment**: Vercel

## Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/      # React Context providers
├── pages/         # Page components
├── utils/         # Helper functions and constants
└── styles/        # Global styles
```

## Key Components
- **HomePage**: Featured books and quick access
- **SearchPage**: Advanced book search with filters
- **CategoriesPage**: Browse books by category
- **BookDetailPage**: Detailed book information
- **ProfilePage**: User profile and reading progress
- **Login/Register**: User authentication

## API Integration
The app uses OpenLibrary API for:
- Book search and details
- Book covers and metadata
- Category-based book listings
- Author information

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```
4. Open http://localhost:3000 in your browser

### Building for Production
```bash
npm run build
```
The build artifacts will be in the `dist/` directory.

## Deployment
The app is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

## Features in Detail

### 1. Book Search
- Real-time search with debouncing
- Advanced filters (publication year, language, cover availability)
- Sort by relevance, year, or rating

### 2. Reading Management
- Add/remove books from reading list
- Track reading progress
- Set reading goals
- View reading statistics

### 3. User Experience
- Dark/light mode toggle
- Responsive design
- Loading states and error handling
- Smooth animations and transitions

### 4. Performance
- Code splitting for faster loads
- Image lazy loading
- Optimized API calls
- Efficient state management

## Environment Variables
No environment variables required for basic functionality. The app uses public OpenLibrary API endpoints.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Future Enhancements
- Book reviews and ratings
- Social sharing features
- Reading challenges
- Book recommendations
- Offline reading list
- Export reading data

---

**Note**: This is a frontend-only application. All book data comes from the public OpenLibrary API. User data is stored locally in the browser.
