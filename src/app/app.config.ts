import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { API_URL } from './core/tokens'; // Import token
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // Day 1: Zone.js enabled. Day 2: switch to provideZonelessChangeDetection()
    //provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    provideHttpClient(withFetch()),
    { provide: API_URL, useValue: 'http://localhost:3000' },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        // remove /images/ from src
        const src = config.src.replace('/images/', '');
        return `https://static-assets.dev/cdn-cgi/image/width=${config.width},format=auto/https://storage.googleapis.com/images-cdn-e0395.firebasestorage.app/${src}`;
      },
    },
    provideClientHydration(withEventReplay()),
  ],
};
