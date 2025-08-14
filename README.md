# Community Resources Finder

A multilingual Progressive Web Application (PWA) that helps users discover community resources and services at Georges River Libraries. Built with vanilla JavaScript, this accessible web app supports 6 languages and provides an interactive map interface for finding local organizations and services.

## ✨ Features

### 🌍 Multilingual Support
- **6 Languages**: English, Mandarin (普通话), Cantonese (粤语), Nepali (नेपाली), Italian (Italiano), Greek (Ελληνικά)
- Dynamic language switching with native script display

### 📍 Interactive Experience  
- **Interactive Map**: Leaflet.js powered location mapping with custom markers
- **QR Code Generation**: Instant QR codes for easy mobile access to organization websites
- **Category Filtering**: 13 service categories including First Nations, Arts, Health & Wellbeing
- **18+ Organizations**: Comprehensive directory of community resources

### 📱 Modern Web App
- **PWA Ready**: Installable app with offline functionality via service worker
- **Mobile Responsive**: Optimized for all screen sizes and devices
- **Accessibility First**: WCAG compliant with screen reader support and keyboard navigation
- **Performance Optimized**: Lighthouse score 90+ across all categories

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/cwrigh13/Find-a-Community-Resource-at-the-Library.git
   cd Find-a-Community-Resource-at-the-Library
   ```

2. **Serve locally** (choose one method)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

## 📁 Project Structure

```
Find-a-Community-Resource-at-the-Library/
├── index.html                    # Main application entry point
├── script.js                     # Core application logic & data
├── styles.css                    # Custom styling (embedded in HTML)
├── security-implementation.js    # CSP and security features
├── service-worker.js            # PWA caching and offline support
├── performance-monitor.js       # Performance tracking utilities
├── manifest.json               # PWA manifest configuration
├── production-checklist.md     # Deployment and optimization guide
├── security-checklist.md       # Security implementation checklist
├── assets/
│   └── images/                 # Logos and visual assets
└── lib/                        # Third-party libraries (local copies)
    ├── leaflet.js             # Interactive mapping library
    ├── leaflet.css            # Leaflet map styling
    ├── qrcode.js              # QR code generation
    ├── work-sans.css          # Custom font definitions
    └── work-sans-*.ttf        # Font files
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Mapping**: Leaflet.js for interactive maps
- **QR Codes**: QRCode.js library
- **PWA**: Service Worker API, Web App Manifest
- **Fonts**: Work Sans (locally hosted)
- **Security**: Content Security Policy, Subresource Integrity

## 🔧 Development

### Local Development
The application is built with vanilla web technologies and requires no build process. Simply serve the files from a local web server.

### Adding New Organizations
Organizations are defined in the `partners` array within `script.js`. Each organization includes:
- Geographic coordinates for map placement
- Multilingual descriptions
- Contact information
- Service categories
- Supported languages

### Adding New Languages
1. Add language option to the language filter buttons in `index.html`
2. Add translations to the `translations` object in `script.js`
3. Add descriptions for each organization in the new language
4. Update the `categories` array with translated category names

## 🚀 Deployment

### Production Checklist
1. **HTTPS Required**: Ensure SSL certificate is properly configured
2. **Server Headers**: Configure security headers (see `production-checklist.md`)
3. **Performance**: Optimize images and enable gzip compression
4. **Testing**: Verify all functionality across target browsers
5. **Monitoring**: Set up performance and error monitoring

### Hosting Options
- **Static Hosting**: GitHub Pages, Netlify, Vercel
- **Traditional Web Hosting**: Any web server with HTTPS support
- **CDN**: CloudFlare, AWS CloudFront for global distribution

## 🔒 Security Features

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Subresource Integrity (SRI)**: Ensures library integrity
- **Input Sanitization**: Protects against malicious input
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **HTTPS Enforcement**: Secure data transmission

## 📱 Progressive Web App

### Installation
Users can install this as a native-like app:
- **Desktop**: Install button in browser address bar
- **Mobile**: "Add to Home Screen" from browser menu
- **Offline Support**: Core functionality available without internet

### PWA Features
- App-like experience with custom splash screen
- Offline functionality via service worker caching
- Responsive design optimized for mobile devices
- Fast loading with intelligent caching strategies

## 🌐 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 80+ | Full PWA support |
| Firefox | 75+ | Full functionality |
| Safari | 13+ | PWA support limited |
| Edge | 80+ | Full PWA support |

## 📊 Performance Metrics

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Service Worker**: Intelligent caching for offline use

## 🤝 Contributing

We welcome contributions to improve the Community Resources Finder! Here's how you can help:

### Ways to Contribute
- **Add Organizations**: Submit new community resources with complete information
- **Improve Translations**: Enhance existing translations or add new languages
- **Bug Reports**: Report issues via GitHub Issues
- **Feature Requests**: Suggest new functionality or improvements
- **Documentation**: Help improve setup and usage documentation

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Test your changes thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Georges River Libraries** - Project sponsor and community partner
- **Community Organizations** - For providing accurate service information
- **Open Source Libraries**: Leaflet.js, QRCode.js, and the broader web development community
- **Contributors** - Everyone who helps improve this resource

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/cwrigh13/Find-a-Community-Resource-at-the-Library/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cwrigh13/Find-a-Community-Resource-at-the-Library/discussions)
- **Repository**: [GitHub Repository](https://github.com/cwrigh13/Find-a-Community-Resource-at-the-Library)

---

**Version**: 1.0.0  
**Last Updated**: August 2025  
**Maintained by**: cwrigh13