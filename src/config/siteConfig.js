// Site Configuration - Enable/Disable sections
export const siteConfig = {
  // Toggle full content visibility (true = show all, false = show only profile image)
  showFullContent: true,
  
  // Gallery configuration
  gallery: {
    enabled: true,
    sharePath: '//192.168.1.213/photos'
  },
  
  sections: {
    profile: true,
    titles: true,
    communities: true,
    banner: true
  },
  theme: {
    primaryColor: '#00ff41',
    backgroundColor: '#000',
    fontFamily: "'Courier New', monospace"
  },
  animation: {
    matrixRain: true,
    fadeInDelay: 500
  }
};
