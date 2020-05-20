export const environment = {
  production: true,

  /**
   * URLs for API rest calls
   */
  api: {
    envServerUrl: '/fpcare/api/env', // spa-env service - splash page information
    loggingURL: '/fpcare/api/logging', // splunk forwarder service
    captchaURL: '/fpcare/api/captcha', // captcha for authorization
  },

  /**
   * assist with development - turned off for production
   */
  developmentMode: {
    enabled: false,

    /**
     * Bypass page guards
     */
    bypassGuards: false,

    /**
     * log HTTP requests to console
     */
    logHTTPRequestsToConsole: false,

    /**
     * Simulate back-end
     */
    mockBackend: {
      enabled: false,

      // YYYY-MM-DD 24H:mm:ss
      maintModeStart: '',
      maintModeEnd: '',
      maintModeMessage: '',
    },
  },
};
