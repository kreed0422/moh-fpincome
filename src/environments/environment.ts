// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  /**
   * URLs for API rest calls
   */
  api: {
    envServerUrl: '/fpcare/api/env', // spa-env service - splash page information
    loggingURL: '/fpcare/api/logging', // splunk forwarder service
    captchaBaseURL: '/fpcare/api/captcha', // captcha for authorization
    baseAPIUrl: '/fpcare/api/fpcareIncome/', // middleware url to send requests
  },

  /**
   * URL links for other sites
   */
  links: {
    mspSuppBenefits: 'https://www.gov.bc.ca/MSP/supplementarybenefits',
    hlth5355: 'https://www2.gov.bc.ca/assets/gov/health/forms/5355fil.pdf',
  },

  /**
   * assist with development - turned off for production
   */
  developmentMode: {
    /** When enabled = true, page guards can be bypassed if bypassGuards = true */
    enabled: true,

    /**
     * Bypass page guards
     */
    bypassGuards: true,

    /**
     * log HTTP requests to console
     */
    logHTTPRequestsToConsole: true,

    /**
     * Simulate back-end
     * When enabled = true, mockBackend can be used when mockBackend: {enabled = true}, loads provider for a fake backend
     */
    mockBackend: {
      enabled: false,

      // YYYY-MM-DD 24H:mm:ss
      maintModeStart: '2020-05-13 21:45:00',
      maintModeEnd: '2020-05-13 21:50:00',
      maintModeMessage: 'Fair PharmaCare Income Review is unavailable..',
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
