# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for the AyurSutra Panchakarma Management System.

## Prerequisites

1. A Google Cloud Platform account
2. Node.js and npm installed
3. MongoDB running locally

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add the following authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
8. Copy the Client ID and Client Secret

## Step 2: Configure Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/ayursutra

# JWT Configuration
JWT_SECRET=ayursutra-secret-token
JWT_EXPIRATION=24h

# Session Configuration
SESSION_SECRET=ayursutra-session-secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Server Configuration
PORT=5000
NODE_ENV=development
```

Replace `your-google-client-id-here` and `your-google-client-secret-here` with your actual Google OAuth credentials.

## Step 3: Install Dependencies

The required dependencies are already installed in the server's `package.json`:
- `passport`
- `passport-google-oauth20`
- `express-session`

## Step 4: Start the Application

1. Start the MongoDB service
2. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
3. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

## Step 5: Test Google Authentication

1. Open your browser and go to `http://localhost:5173`
2. Click on "Get Started" or navigate to the login page
3. Click the "Google" button to test the OAuth flow
4. You should be redirected to Google's OAuth consent screen
5. After granting permissions, you'll be redirected back to the application

## Features Implemented

- ✅ Google OAuth 2.0 integration
- ✅ User model updated to support OAuth users
- ✅ Automatic user creation for new Google users
- ✅ Account linking for existing users with same email
- ✅ JWT token generation for OAuth users
- ✅ Frontend integration with Google login buttons
- ✅ Success page for OAuth callback handling
- ✅ Support for both login and signup flows

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**: Make sure the redirect URI in your Google Cloud Console exactly matches `http://localhost:5000/auth/google/callback`

2. **"invalid_client" error**: Check that your Google Client ID and Secret are correct in the `.env` file

3. **CORS errors**: Ensure the frontend URL (`http://localhost:5173`) is allowed in the CORS configuration

4. **Session not persisting**: Check that the session secret is set in your `.env` file

### Debug Steps:

1. Check the server console for error messages
2. Verify that all environment variables are loaded correctly
3. Test the OAuth flow step by step
4. Check browser developer tools for network errors

## Production Deployment

For production deployment:

1. Update the `GOOGLE_CALLBACK_URL` to your production domain
2. Add your production domain to the authorized redirect URIs in Google Cloud Console
3. Set `NODE_ENV=production`
4. Use HTTPS for all URLs
5. Update CORS settings to allow your production frontend domain

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for JWT and session configuration
- Regularly rotate your Google OAuth credentials
- Implement rate limiting for OAuth endpoints
- Use HTTPS in production
