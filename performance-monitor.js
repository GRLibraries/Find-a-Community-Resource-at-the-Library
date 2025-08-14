<<<<<<< HEAD
/**
 * Performance Monitoring Utility
 * 
 * Tracks application performance metrics and provides insights
 * for optimization opportunities.
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.recordPageLoadMetrics();
        });

        // Monitor user interactions
        this.setupInteractionTracking();
    }

    recordPageLoadMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        this.metrics = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            totalLoadTime: performance.now() - this.startTime
        };

        console.log('📊 Performance Metrics:', this.metrics);
        this.reportPerformance();
    }

    setupInteractionTracking() {
        let interactionCount = 0;
        
        ['click', 'keydown', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
            }, { passive: true });
        });

        // Report interaction metrics every 30 seconds
        setInterval(() => {
            if (interactionCount > 0) {
                console.log(`🖱️ User interactions in last 30s: ${interactionCount}`);
                interactionCount = 0;
            }
        }, 30000);
    }

    reportPerformance() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null,
            metrics: this.metrics
        };

        // In a real application, you might send this to an analytics service
        console.log('📈 Performance Report:', report);
        
        // Store locally for debugging
        localStorage.setItem('performanceReport', JSON.stringify(report));
    }

    // Method to get current performance snapshot
    getSnapshot() {
        return {
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            } : null,
            timing: this.metrics,
            resources: performance.getEntriesByType('resource').length
        };
    }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
=======
/**
 * Performance Monitoring Utility
 * 
 * Tracks application performance metrics and provides insights
 * for optimization opportunities.
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.recordPageLoadMetrics();
        });

        // Monitor user interactions
        this.setupInteractionTracking();
    }

    recordPageLoadMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');

        this.metrics = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            totalLoadTime: performance.now() - this.startTime
        };

        console.log('📊 Performance Metrics:', this.metrics);
        this.reportPerformance();
    }

    setupInteractionTracking() {
        let interactionCount = 0;
        
        ['click', 'keydown', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
            }, { passive: true });
        });

        // Report interaction metrics every 30 seconds
        setInterval(() => {
            if (interactionCount > 0) {
                console.log(`🖱️ User interactions in last 30s: ${interactionCount}`);
                interactionCount = 0;
            }
        }, 30000);
    }

    reportPerformance() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : null,
            metrics: this.metrics
        };

        // In a real application, you might send this to an analytics service
        console.log('📈 Performance Report:', report);
        
        // Store locally for debugging
        localStorage.setItem('performanceReport', JSON.stringify(report));
    }

    // Method to get current performance snapshot
    getSnapshot() {
        return {
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            } : null,
            timing: this.metrics,
            resources: performance.getEntriesByType('resource').length
        };
    }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
>>>>>>> 5369711407e051a14a4fe1914ed8b7050caeb5c7
}