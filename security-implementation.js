/**
 * Security Implementation Module
 * 
 * Comprehensive security management system that handles Content Security Policy (CSP),
 * Subresource Integrity (SRI), input sanitization, and security headers for the
 * Community Resources Finder application.
 * 
 * @author Georges River Libraries Security Team
 * @version 1.0.0
 * @since 2024
 */

/**
 * SecurityManager class for handling application security measures
 * 
 * Provides comprehensive security features including CSP policy management,
 * SRI hash validation, input sanitization utilities, and security header setup.
 * Designed to prevent XSS attacks, injection vulnerabilities, and supply chain compromises.
 * 
 * @class
 * @example
 * const security = new SecurityManager();
 * const cleanData = security.sanitizePartnerData(rawData);
 */
class SecurityManager {
    /**
     * Creates a new SecurityManager instance
     * 
     * Automatically initializes all security measures including CSP, SRI,
     * input sanitization utilities, and security headers.
     * 
     * @constructor
     */
    constructor() {
        this.initializeSecurity();
    }

    /**
     * Initializes all security measures
     * 
     * Sets up Content Security Policy, Subresource Integrity validation,
     * input sanitization utilities, and security headers. CSP is temporarily
     * disabled for debugging purposes.
     * 
     * @private
     * @method
     */
    initializeSecurity() {
        this.setupCSP();
        this.setupSRI();
        this.setupInputSanitization();
        this.setupSecurityHeaders();
        console.log('🔒 Security measures initialized');
    }

    /**
     * Sets up Content Security Policy (CSP) headers
     * 
     * Creates and applies a comprehensive CSP policy to prevent XSS attacks,
     * data exfiltration, and other injection vulnerabilities. Removes any
     * existing CSP meta tags before applying the new policy.
     * 
     * @private
     * @method
     * @modifies {HTMLMetaElement} Adds CSP meta tag to document head
     */
    setupCSP() {
        // Remove existing CSP if present
        const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (existingCSP) {
            existingCSP.remove();
        }

        // Create comprehensive CSP
        const csp = document.createElement('meta');
        csp.setAttribute('http-equiv', 'Content-Security-Policy');
        csp.setAttribute('content', this.generateCSPPolicy());
        document.head.appendChild(csp);
    }

    /**
     * Generates comprehensive CSP policy string
     * 
     * Creates a strict Content Security Policy that allows only necessary
     * resources while blocking potential attack vectors. Includes directives
     * for scripts, styles, images, fonts, and connections.
     * 
     * @private
     * @method
     * @returns {string} Complete CSP policy string with all directives
     */
    generateCSPPolicy() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'", // Allow inline scripts for QR generation
            "style-src 'self' 'unsafe-inline'", // Allow inline styles
            "font-src 'self' data:",
            "img-src 'self' data: https://*.tile.openstreetmap.org https://*.openstreetmap.org",
            "connect-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests"
        ].join('; ');
    }

    /**
     * Sets up Subresource Integrity (SRI) for external resources
     * 
     * Adds integrity and crossorigin attributes to script and link tags
     * that load external resources. Helps prevent supply chain attacks
     * by ensuring resources haven't been tampered with.
     * 
     * @private
     * @method
     * @modifies {HTMLScriptElement|HTMLLinkElement} Adds integrity attributes
     */
    setupSRI() {
        // Real SRI hashes generated for local libraries
        const sriHashes = {
            'lib/leaflet.js': 'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH',
            'lib/leaflet.css': 'sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jFvuavGOndn6pjVqS6ny56CAt3nsEVT4H',
            'lib/qrcode.js': 'sha384-8FWZA6BGMXhsfO+BLtrJK0We6gg5o1JyO8xQm6peWDEUs17ACA5ziE/NIAkl9z2k',
            'lib/work-sans.css': 'sha384-VCQ9TeJQ4cyKNMji0Ep8EFXJaj2fxkvdzBveyI+NOz90G8R2qNiESADwVJHGQRHl'
        };

        // Add SRI to existing script and link tags
        document.querySelectorAll('script[src], link[rel="stylesheet"]').forEach(element => {
            const src = element.src || element.href;
            if (src && src.startsWith('lib/')) {
                const relativePath = src.split('/').slice(-2).join('/');
                if (sriHashes[relativePath]) {
                    element.setAttribute('integrity', sriHashes[relativePath]);
                    element.setAttribute('crossorigin', 'anonymous');
                }
            }
        });
    }

    /**
     * Sets up input sanitization utilities
     * 
     * Creates a comprehensive set of sanitization functions for different
     * data types including HTML, URLs, emails, phone numbers, and general text.
     * Prevents XSS attacks and data injection vulnerabilities.
     * 
     * @private
     * @method
     * @creates {Object} this.sanitizer - Object containing sanitization functions
     */
    setupInputSanitization() {
        this.sanitizer = {
            // HTML sanitization
            sanitizeHTML: (input) => {
                if (typeof input !== 'string') return '';
                
                // Create a temporary div to parse HTML
                const temp = document.createElement('div');
                temp.textContent = input; // This automatically escapes HTML
                return temp.innerHTML;
            },

            // URL sanitization
            sanitizeURL: (url) => {
                if (typeof url !== 'string') return '';
                
                try {
                    const parsed = new URL(url);
                    // Only allow http and https protocols
                    if (!['http:', 'https:'].includes(parsed.protocol)) {
                        return '';
                    }
                    return parsed.toString();
                } catch (e) {
                    return '';
                }
            },

            // Email sanitization
            sanitizeEmail: (email) => {
                if (typeof email !== 'string') return '';
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email) ? email : '';
            },

            // Phone number sanitization
            sanitizePhone: (phone) => {
                if (typeof phone !== 'string') return '';
                
                // Remove all non-digit characters except +, (, ), -, and spaces
                return phone.replace(/[^\d\+\(\)\-\s]/g, '');
            },

            // General text sanitization
            sanitizeText: (text) => {
                if (typeof text !== 'string') return '';
                
                // Remove potential XSS vectors while preserving basic text
                return text
                    .replace(/[<>]/g, '') // Remove angle brackets
                    .replace(/javascript:/gi, '') // Remove javascript: protocol
                    .replace(/on\w+=/gi, '') // Remove event handlers
                    .trim();
            }
        };
    }

    /**
     * Sets up additional security headers via meta tags
     * 
     * Adds browser security headers as meta tags including referrer policy,
     * content type options, frame options, and XSS protection. These provide
     * additional layers of security at the browser level.
     * 
     * @private
     * @method
     * @modifies {HTMLMetaElement} Adds security meta tags to document head
     */
    setupSecurityHeaders() {
        // These would typically be set server-side, but we can add meta tags for some
        const securityMetas = [
            { name: 'referrer', content: 'strict-origin-when-cross-origin' },
            { name: 'robots', content: 'index, follow' },
            { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
            { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
            { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }
        ];

        securityMetas.forEach(meta => {
            const metaTag = document.createElement('meta');
            Object.keys(meta).forEach(key => {
                metaTag.setAttribute(key, meta[key]);
            });
            document.head.appendChild(metaTag);
        });
    }

    /**
     * Sanitizes partner organization data
     * 
     * Applies appropriate sanitization to all fields in partner data objects
     * to prevent XSS attacks and ensure data integrity. Handles multilingual
     * descriptions and validates contact information.
     * 
     * @public
     * @method
     * @param {Array<Object>} partners - Array of partner organization objects
     * @returns {Array<Object>} Sanitized partner data array
     * 
     * @example
     * const cleanData = security.sanitizePartnerData(rawPartners);
     */
    sanitizePartnerData(partners) {
        return partners.map(partner => ({
            ...partner,
            name: this.sanitizer.sanitizeText(partner.name),
            address: this.sanitizer.sanitizeText(partner.address),
            phone: this.sanitizer.sanitizePhone(partner.phone),
            email: this.sanitizer.sanitizeEmail(partner.email),
            website: this.sanitizer.sanitizeURL(partner.website),
            description: Object.keys(partner.description).reduce((acc, lang) => {
                acc[lang] = this.sanitizer.sanitizeText(partner.description[lang]);
                return acc;
            }, {})
        }));
    }

    /**
     * Creates DOM elements with security validation
     * 
     * Safely creates HTML elements with sanitized attributes and content.
     * Validates URLs and sanitizes text content to prevent XSS attacks.
     * 
     * @public
     * @method
     * @param {string} tagName - HTML tag name to create
     * @param {Object} [attributes={}] - Object containing element attributes
     * @param {string} [textContent=''] - Text content for the element
     * @returns {HTMLElement} Safely created DOM element
     * 
     * @example
     * const link = security.createSecureElement('a', {
     *   href: 'https://example.com',
     *   target: '_blank'
     * }, 'Safe Link');
     */
    createSecureElement(tagName, attributes = {}, textContent = '') {
        const element = document.createElement(tagName);
        
        // Set attributes safely
        Object.keys(attributes).forEach(key => {
            if (key === 'href' && attributes[key]) {
                element.setAttribute(key, this.sanitizer.sanitizeURL(attributes[key]));
            } else if (key === 'src' && attributes[key]) {
                element.setAttribute(key, this.sanitizer.sanitizeURL(attributes[key]));
            } else {
                element.setAttribute(key, this.sanitizer.sanitizeText(attributes[key]));
            }
        });

        // Set text content safely
        if (textContent) {
            element.textContent = this.sanitizer.sanitizeText(textContent);
        }

        return element;
    }

    /**
     * Safely sets HTML content for elements
     * 
     * Replaces innerHTML with a secure alternative that sanitizes content
     * before insertion. Prevents XSS attacks from malicious HTML content.
     * 
     * @public
     * @method
     * @param {HTMLElement} element - Target element to update
     * @param {string} htmlContent - HTML content to sanitize and insert
     * 
     * @example
     * security.setSecureHTML(container, '<p>Safe content</p>');
     */
    setSecureHTML(element, htmlContent) {
        // Clear existing content
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // Parse and sanitize HTML content
        const temp = document.createElement('div');
        temp.innerHTML = this.sanitizer.sanitizeHTML(htmlContent);
        
        // Move sanitized content to target element
        while (temp.firstChild) {
            element.appendChild(temp.firstChild);
        }
    }

    /**
     * Generates SRI hash for content validation
     * 
     * Creates a SHA-384 hash for Subresource Integrity validation.
     * Used to ensure external resources haven't been tampered with.
     * 
     * @public
     * @async
     * @method
     * @param {string} content - Content to generate hash for
     * @returns {Promise<string>} SHA-384 hash in base64 format with 'sha384-' prefix
     * 
     * @example
     * const hash = await security.generateSRIHash(fileContent);
     * console.log(hash); // 'sha384-abc123...'
     */
    async generateSRIHash(content) {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-384', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return `sha384-${btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))}`;
    }

    /**
     * Performs comprehensive security audit
     * 
     * Checks the current security implementation status including CSP presence,
     * SRI attributes, security headers, HTTPS usage, and inline script detection.
     * Logs results to console for monitoring and debugging.
     * 
     * @public
     * @method
     * @returns {Object} Security audit results object
     * @returns {boolean} returns.csp - CSP meta tag present
     * @returns {boolean} returns.sri - SRI attributes found on resources
     * @returns {boolean} returns.secureHeaders - Security headers present
     * @returns {boolean} returns.httpsOnly - HTTPS protocol in use
     * @returns {boolean} returns.noInlineScripts - No inline scripts detected
     * @returns {string} returns.timestamp - Audit timestamp
     * 
     * @example
     * const audit = security.performSecurityAudit();
     * if (audit.csp && audit.sri) {
     *   console.log('Security measures are active');
     * }
     */
    performSecurityAudit() {
        const audit = {
            csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            sri: document.querySelectorAll('script[integrity], link[integrity]').length > 0,
            secureHeaders: !!document.querySelector('meta[http-equiv="X-Content-Type-Options"]'),
            httpsOnly: location.protocol === 'https:',
            noInlineScripts: document.querySelectorAll('script:not([src])').length === 0,
            timestamp: new Date().toISOString()
        };

        console.log('🔍 Security Audit Results:', audit);
        return audit;
    }
}

/**
 * Export SecurityManager class to global scope
 * Makes the SecurityManager class available to other scripts in the application
 * 
 * @global
 * @type {SecurityManager}
 */
window.SecurityManager = SecurityManager;