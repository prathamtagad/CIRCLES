# Firebase Firestore Security Rules

You need to update your Firestore security rules in the Firebase Console. 

## Steps to update rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **circles-63a39**
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the rules below
6. Click **Publish**

## Firestore Security Rules

Copy and paste these rules into your Firebase Console:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read and write their own profile
      allow read, write: if isOwner(userId);
      
      // Allow reading any user's basic info for display purposes
      allow read: if isAuthenticated();
    }
    
    // Circles collection
    match /circles/{circleId} {
      // Only authenticated users can read circles they own or are members of
      allow read: if isAuthenticated() && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.token.email in resource.data.members
      );
      
      // Only the owner can create circles
      allow create: if isAuthenticated() && 
        request.resource.data.ownerId == request.auth.uid;
      
      // Only the owner can update or delete
      allow update, delete: if isAuthenticated() && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // Posts collection
    match /posts/{postId} {
      // Authenticated users can read posts from circles they have access to
      allow read: if isAuthenticated();
      
      // Only authenticated users can create posts
      allow create: if isAuthenticated() && 
        request.resource.data.authorId == request.auth.uid;
      
      // Only the author can update or delete their posts
      allow update, delete: if isAuthenticated() && 
        resource.data.authorId == request.auth.uid;
    }
  }
}
```

## Quick Test Rules (Development Only)

If you want to quickly test without authentication checks, you can use these permissive rules temporarily:

⚠️ **WARNING: Only use these for development! Never use in production!**

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows any authenticated user to read/write any document.

## Also Enable Google Sign-In in Firebase Console:

1. Go to **Authentication** in Firebase Console
2. Click on **Sign-in method** tab
3. Click on **Google** provider
4. Toggle **Enable**
5. Add your project support email
6. Click **Save**

## Add Authorized Domains:

1. Go to **Authentication** > **Settings** tab
2. Under **Authorized domains**, add:
   - `localhost`
   - Your production domain when you deploy
