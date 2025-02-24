import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync(),MessageService, providePrimeNG(
    {
      theme:{
        preset:Aura
      }
    }
  ), provideHttpClient(withFetch(),withInterceptors([authTokenInterceptor])), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
