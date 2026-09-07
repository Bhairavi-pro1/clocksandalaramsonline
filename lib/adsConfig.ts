/**
 * 💡 Global Advertising Configuration
 * 
 * Directly control whether ads (banners, sidebars, third-party ad scripts) are displayed across the site.
 * 
 * 🟢 Set `enabled: true` -> to show all ads and load ad scripts.
 * 🔴 Set `enabled: false` -> to hide all ads and stop ad scripts completely.
 */

export const ADS_CONFIG = {
  // Master toggle: set to true to display ads across the site
  enabled: true,

  // Google AdSense Client ID for verification & serving (e.g., 'ca-pub-xxxxxxxxxxxxxxxx')
  adsenseClientId: '',

  // HighRevenueFormat / Adsterra configuration
  highRevenueFormat: {
    skyscraperKey: '567dd7e4ba35c77101b1030963477add', // 160x600 size
    bannerKey: '39162fc50664fd8a206a45b32bcb9a57',     // 728x90 size
    mobileBannerKey: 'c46c752332042887002e546810f4b017', // 320x50 mobile size
  },
} as const

export const SHOW_ADS = ADS_CONFIG.enabled
export const areAdsEnabled = () => ADS_CONFIG.enabled
