# Flutter Developer Portfolio - Local Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Firebase account (free tier is sufficient)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd flutter-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "tayyub-portfolio")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Required Services

#### Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

#### Enable Authentication
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

#### Create Admin User
1. Go to "Authentication" > "Users" tab
2. Click "Add user"
3. Enter email: `admin@tayyubkhan.dev`
4. Enter password: `admin123`
5. Click "Add user"

### Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ > "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register your app with a nickname (e.g., "Portfolio Web")
5. Copy the Firebase configuration object

### Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 5: Update Firebase Configuration

Update `src/lib/firebase.ts` with your configuration:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
```

## 🔐 Admin Panel Access

### Access the Admin Panel
1. Navigate to `http://localhost:5173/admin`
2. Use credentials:
   - **Email**: `admin@tayyubkhan.dev`
   - **Password**: `admin123`

### Admin Panel Features
- ✅ **Skills Management**: Add, edit, delete skills with icons and proficiency levels
- ✅ **Projects Management**: Complete project CRUD with images, tags, and metrics
- ✅ **Real-time Updates**: Changes reflect immediately on the main portfolio
- ✅ **Form Validation**: Comprehensive input validation
- ✅ **Responsive Design**: Works on all devices

## 📊 Database Structure

### Skills Collection (`skills`)
```javascript
{
  id: "auto-generated",
  title: "Flutter Development",
  level: 95,
  description: "Expert in building cross-platform mobile apps",
  icon: "Code", // Lucide icon name
  color: "bg-blue-500", // Tailwind color class
  category: "Frontend",
  order: 1,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Projects Collection (`projects`)
```javascript
{
  id: "auto-generated",
  title: "ECommerce Mobile App",
  description: "Short description",
  longDescription: "Detailed description",
  image: "https://example.com/image.jpg",
  tags: ["Flutter", "Firebase", "REST API"],
  features: ["User Auth", "Payment Gateway", "Push Notifications"],
  metrics: {
    users: "10K+",
    rating: "4.8",
    downloads: "50K+"
  },
  links: {
    github: "https://github.com/...",
    live: "https://app.example.com",
    demo: "https://demo.example.com"
  },
  category: "E-commerce",
  featured: true,
  order: 1,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🛡️ Security Rules

### Firestore Security Rules
In Firebase Console > Firestore Database > Rules, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users for skills and projects
    match /skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Authentication Rules
- Only authenticated users can write data
- Public read access for portfolio display
- Admin authentication required for admin panel

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📱 Features

### Portfolio Features
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Dark Mode**: Automatic theme switching
- ✅ **Smooth Animations**: Framer Motion powered
- ✅ **SEO Optimized**: Meta tags and structured data
- ✅ **Performance**: Optimized loading and caching
- ✅ **Accessibility**: WCAG compliant

### Admin Features
- ✅ **Secure Authentication**: Firebase Auth integration
- ✅ **Real-time Updates**: Live data synchronization
- ✅ **Rich Forms**: Comprehensive input validation
- ✅ **File Management**: Image upload and management
- ✅ **Bulk Operations**: Efficient data management

## 🐛 Troubleshooting

### Common Issues

#### Firebase Connection Error
- Check if `.env` file exists and has correct values
- Verify Firebase project is active
- Ensure Firestore is enabled

#### Authentication Error
- Verify admin user exists in Firebase Auth
- Check if Email/Password provider is enabled
- Confirm credentials are correct

#### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run dev -- --force`
- Check TypeScript errors: `npx tsc --noEmit`

#### Deployment Issues
- Verify environment variables are set in hosting platform
- Check build output in `dist` folder
- Ensure Firebase configuration is correct

### Getting Help
- Check browser console for errors
- Review Firebase Console for authentication/database issues
- Verify network connectivity
- Check Firestore security rules

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Firebase Console for errors
3. Check browser developer tools
4. Verify all environment variables are set correctly

---

**Happy coding! 🚀**