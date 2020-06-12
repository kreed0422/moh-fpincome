export const environment = {
  production: true,

  /**
   * URLs for API rest calls
   */
  api: {
    envServerUrl: '/fpcare/income-review/api/env', // spa-env service - splash page information
    loggingURL: '/fpcare/income-review/api/logging', // splunk forwarder service
    captchaBaseURL: '/fpcare/income-review/api/captcha', // captcha for authorization
    baseAPIUrl: '/fpcare/income-review/api/fpcareIncome', // middleware url to send requests
    application: 'application', // end point for submitting income review applications
    attachments: '/fpcare/income-review/api/fpcareAttachment', // end point for submitting supporting documents
  },

  /**
   * URL links for other sites
   */
  links: {
    mspSuppBenefits: 'https://www.gov.bc.ca/MSP/supplementarybenefits',
    hlth5355: 'https://www2.gov.bc.ca/assets/gov/health/forms/5355fil.pdf',
    fpcRegStatus:
      'https://my.gov.bc.ca/fpcare/registration-status/request-status',
    hibc:
      'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us',
    collectionNoticeEmail:
      'mailto:Pharma@Gov.bc.ca?subject=FPC Income Review Inoformation Collection Notice',
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
      executeErrorScenario: false,

      // YYYY-MM-DD 24H:mm:ss
      maintModeStart: '',
      maintModeEnd: '',
      maintModeMessage: '',
    },
  },
};
