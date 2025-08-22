/**
 * Bundle size analysis and reporting utilities
 * Helps identify large dependencies and optimization opportunities
 */

/**
 * Analyzes bundle composition and provides insights
 * @returns {Object} Bundle analysis results
 */
export const analyzeBundleComposition = () => {
  const analysis = {
    timestamp: new Date().toISOString(),
    totalBundleSize: 0,
    vendorSize: 0,
    appSize: 0,
    chunks: [],
    largestModules: [],
    recommendations: []
  };

  try {
    // In production, this would analyze the built bundle
    // For now, we'll provide estimated sizes based on package.json
    
    const estimatedSizes = {
      'react': 42000, // ~42KB
      'react-dom': 130000, // ~130KB
      'styled-components': 45000, // ~45KB
      'react-quill': 200000, // ~200KB
      'axios': 32000, // ~32KB
      'jspdf': 180000, // ~180KB
      'html2canvas': 340000, // ~340KB
      'prop-types': 15000 // ~15KB
    };

    analysis.vendorSize = Object.values(estimatedSizes).reduce((a, b) => a + b, 0);
    analysis.appSize = 85000; // Estimated app code size
    analysis.totalBundleSize = analysis.vendorSize + analysis.appSize;

    // Identify largest modules
    analysis.largestModules = Object.entries(estimatedSizes)
      .map(([name, size]) => ({ name, size, percentage: (size / analysis.totalBundleSize * 100).toFixed(1) }))
      .sort((a, b) => b.size - a.size);

    // Generate recommendations
    generateOptimizationRecommendations(analysis);

    return analysis;

  } catch (error) {
    console.error('Bundle analysis failed:', error);
    return { error: error.message };
  }
};

/**
 * Generates optimization recommendations based on bundle analysis
 * @param {Object} analysis - Bundle analysis results
 */
const generateOptimizationRecommendations = (analysis) => {
  const recommendations = [];

  // Check for large dependencies
  analysis.largestModules.forEach(module => {
    if (module.size > 100000) { // > 100KB
      switch (module.name) {
        case 'html2canvas':
          recommendations.push({
            type: 'code-splitting',
            priority: 'high',
            module: module.name,
            currentSize: `${Math.round(module.size / 1024)}KB`,
            suggestion: 'Load html2canvas dynamically only when PDF generation is needed',
            implementation: 'Use React.lazy() or dynamic import()'
          });
          break;

        case 'react-quill':
          recommendations.push({
            type: 'code-splitting',
            priority: 'medium',
            module: module.name,
            currentSize: `${Math.round(module.size / 1024)}KB`,
            suggestion: 'Load ReactQuill only in edit mode',
            implementation: 'Conditional loading based on editing state'
          });
          break;

        case 'jspdf':
          recommendations.push({
            type: 'code-splitting',
            priority: 'high',
            module: module.name,
            currentSize: `${Math.round(module.size / 1024)}KB`,
            suggestion: 'Load jsPDF dynamically for PDF generation',
            implementation: 'Use dynamic import in PDF generation function'
          });
          break;

        case 'react-dom':
          recommendations.push({
            type: 'optimization',
            priority: 'low',
            module: module.name,
            currentSize: `${Math.round(module.size / 1024)}KB`,
            suggestion: 'React DOM is essential, but ensure tree shaking is working',
            implementation: 'Verify unused React DOM features are tree-shaken'
          });
          break;
      }
    }
  });

  // Check overall bundle size
  if (analysis.totalBundleSize > 500000) { // > 500KB
    recommendations.push({
      type: 'performance',
      priority: 'high',
      module: 'overall',
      currentSize: `${Math.round(analysis.totalBundleSize / 1024)}KB`,
      suggestion: 'Total bundle size exceeds recommended 500KB',
      implementation: 'Implement aggressive code splitting and lazy loading'
    });
  }

  // Check vendor vs app code ratio
  const vendorRatio = (analysis.vendorSize / analysis.totalBundleSize) * 100;
  if (vendorRatio > 80) {
    recommendations.push({
      type: 'architecture',
      priority: 'medium',
      module: 'vendor',
      currentSize: `${vendorRatio.toFixed(1)}%`,
      suggestion: 'Vendor code makes up large portion of bundle',
      implementation: 'Consider lighter alternatives for heavy dependencies'
    });
  }

  analysis.recommendations = recommendations;
};

/**
 * Generates a detailed bundle report
 * @returns {string} Formatted report
 */
export const generateBundleReport = () => {
  const analysis = analyzeBundleComposition();

  if (analysis.error) {
    return `Bundle Analysis Error: ${analysis.error}`;
  }

  let report = `
📦 Bundle Size Analysis Report
Generated: ${new Date(analysis.timestamp).toLocaleString()}

📊 Bundle Composition:
├── Total Size: ${Math.round(analysis.totalBundleSize / 1024)}KB
├── Vendor Code: ${Math.round(analysis.vendorSize / 1024)}KB (${((analysis.vendorSize / analysis.totalBundleSize) * 100).toFixed(1)}%)
└── App Code: ${Math.round(analysis.appSize / 1024)}KB (${((analysis.appSize / analysis.totalBundleSize) * 100).toFixed(1)}%)

📈 Largest Modules:`;

  analysis.largestModules.forEach((module, index) => {
    const connector = index === analysis.largestModules.length - 1 ? '└──' : '├──';
    report += `\n${connector} ${module.name}: ${Math.round(module.size / 1024)}KB (${module.percentage}%)`;
  });

  if (analysis.recommendations.length > 0) {
    report += `\n\n💡 Optimization Recommendations:`;
    
    analysis.recommendations.forEach((rec, index) => {
      const connector = index === analysis.recommendations.length - 1 ? '└──' : '├──';
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      
      report += `\n${connector} ${priority} ${rec.type.toUpperCase()}: ${rec.suggestion}`;
      report += `\n    Current: ${rec.currentSize} | Implementation: ${rec.implementation}`;
    });
  }

  report += `\n\n🎯 Performance Score: ${calculatePerformanceScore(analysis)}/100`;

  return report;
};

/**
 * Calculates a performance score based on bundle analysis
 * @param {Object} analysis - Bundle analysis results
 * @returns {number} Performance score (0-100)
 */
const calculatePerformanceScore = (analysis) => {
  let score = 100;

  // Penalize large bundle size
  if (analysis.totalBundleSize > 1000000) { // > 1MB
    score -= 40;
  } else if (analysis.totalBundleSize > 500000) { // > 500KB
    score -= 20;
  } else if (analysis.totalBundleSize > 250000) { // > 250KB
    score -= 10;
  }

  // Penalize high vendor ratio
  const vendorRatio = (analysis.vendorSize / analysis.totalBundleSize) * 100;
  if (vendorRatio > 90) {
    score -= 20;
  } else if (vendorRatio > 80) {
    score -= 10;
  }

  // Penalize number of large modules
  const largeModules = analysis.largestModules.filter(m => m.size > 100000);
  score -= largeModules.length * 5;

  // Penalize high priority recommendations
  const highPriorityRecs = analysis.recommendations.filter(r => r.priority === 'high');
  score -= highPriorityRecs.length * 10;

  return Math.max(0, score);
};

/**
 * Monitors performance metrics and bundle loading
 * @returns {Object} Performance metrics
 */
export const measurePerformanceMetrics = () => {
  const metrics = {};

  try {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Navigation timing
    if (performance.timing) {
      const timing = performance.timing;
      metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      metrics.loadComplete = timing.loadEventEnd - timing.navigationStart;
      metrics.firstPaint = timing.loadEventEnd - timing.fetchStart;
    }

    // Memory usage (if available)
    if (performance.memory) {
      metrics.memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }

    // Resource timing
    const resources = performance.getEntriesByType('resource');
    metrics.resources = {
      total: resources.length,
      scripts: resources.filter(r => r.initiatorType === 'script').length,
      stylesheets: resources.filter(r => r.initiatorType === 'css').length,
      images: resources.filter(r => r.initiatorType === 'img').length,
      totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
    };

  } catch (error) {
    console.error('Performance measurement failed:', error);
    metrics.error = error.message;
  }

  return metrics;
};

/**
 * Creates a performance monitoring dashboard
 * @returns {Object} Dashboard data
 */
export const createPerformanceDashboard = () => {
  const bundleAnalysis = analyzeBundleComposition();
  const performanceMetrics = measurePerformanceMetrics();

  return {
    timestamp: new Date().toISOString(),
    bundle: bundleAnalysis,
    performance: performanceMetrics,
    recommendations: bundleAnalysis.recommendations || [],
    score: calculatePerformanceScore(bundleAnalysis),
    status: getPerformanceStatus(bundleAnalysis, performanceMetrics)
  };
};

/**
 * Gets overall performance status
 * @param {Object} bundleAnalysis - Bundle analysis results
 * @param {Object} performanceMetrics - Performance metrics
 * @returns {string} Status description
 */
const getPerformanceStatus = (bundleAnalysis) => {
  const score = calculatePerformanceScore(bundleAnalysis);
  
  if (score >= 90) return '🟢 Excellent';
  if (score >= 70) return '🟡 Good';
  if (score >= 50) return '🟠 Fair';
  return '🔴 Needs Improvement';
};

export default {
  analyzeBundleComposition,
  generateBundleReport,
  measurePerformanceMetrics,
  createPerformanceDashboard
};