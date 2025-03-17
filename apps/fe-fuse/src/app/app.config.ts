import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, isDevMode, provideAppInitializer } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideFuse } from '@fuse';

import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { appRoutes } from 'app/app.routes';

import { provideAuth } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { MockApiService } from 'app/mock-api';

import { provideOAuthClient } from 'angular-oauth2-oidc';
import { GLOBAL_AUTO_ANIMATE_OPTIONS } from 'ng-auto-animate';
import { NgxImageCompressService } from 'ngx-image-compress';
import { vi } from 'primelocale/js/vi.js';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';
import { MyPresetPrimeNG } from '../../primeng-color-preset';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';

//********************** ApplicationConfig *************************//

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideOAuthClient(),
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    providePrimeNG({
      theme: {
        preset: MyPresetPrimeNG,
        options: {
          darkModeSelector: 'none',
        },
      },
      ripple: true,
      translation: vi,
    }),

    // Material Date Adapter
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'D',
        },
        display: {
          dateInput: 'DDD',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'DD',
          monthYearA11yLabel: 'LLLL yyyy',
        },
      },
    },
    {
      provide: GLOBAL_AUTO_ANIMATE_OPTIONS,
      useValue: {
        duration: 150,
        // easing: 'ease-in',
        // etc.
      },
    },

    // Transloco Config
    provideTransloco({
      config: {
        availableLangs: [
          {
            id: 'en',
            label: 'English',
          },
          {
            id: 'tr',
            label: 'Turkish',
          },
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const translocoService = inject(TranslocoService);
      const defaultLang = translocoService.getDefaultLang();
      translocoService.setActiveLang(defaultLang);

      return firstValueFrom(translocoService.load(defaultLang));
    }),

    // Fuse
    provideAuth(),
    provideIcons(),
    provideFuse({
      mockApi: {
        delay: 0,
        service: MockApiService,
      },
      fuse: {
        layout: 'modern',
        scheme: 'light',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px',
        },
        theme: 'theme-default',
        themes: [
          {
            id: 'theme-default',
            name: 'Default',
          },
          {
            id: 'theme-brand',
            name: 'Brand',
          },
          {
            id: 'theme-teal',
            name: 'Teal',
          },
          {
            id: 'theme-rose',
            name: 'Rose',
          },
          {
            id: 'theme-purple',
            name: 'Purple',
          },
          {
            id: 'theme-amber',
            name: 'Amber',
          },
        ],
      },
    }),
    NgxImageCompressService,
  ],
};
