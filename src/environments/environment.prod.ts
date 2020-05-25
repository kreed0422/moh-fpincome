export const environment = {
  production: true,

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
