/**
 * Application Configuration
 *
 * This file configures the Angular application at bootstrap level.
 *
 * It sets up:
 * - Firebase (App & Firestore)
 * - Routing
 * - Zone optimization
 *
 * 🔥 Firebase setup is done here (Angular 16+), not inside services.
 * This provides better performance, clearer structure, and easier testing.
 *
 * IMPORTANT:
 * You must replace the Firebase config below with your own values.
 * You get them from the Firebase Console:
 * → Project Settings > General > Your App > Firebase SDK snippet
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

/**
 * Firebase Configuration
 *
 * Replace these placeholder values with your actual Firebase project settings.
 * You find these values in your Firebase Console under:
 * Project Settings → Your App → Firebase SDK snippet.
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const appConfig: ApplicationConfig = {
  /**
   * Providers for core app features:
   * - Zone change detection optimization for better performance
   * - Router configuration with app routes
   * - Firebase app initialization
   * - Firestore service setup
   */
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ]
};

