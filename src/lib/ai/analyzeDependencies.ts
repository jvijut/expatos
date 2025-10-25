import { Document } from './mockData';

export interface DependencyAnalysis {
  healthScore: number;
  criticalAlerts: CriticalAlert[];
  dependencies: DocumentDependency[];
}

export interface CriticalAlert {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedDocuments: string[];
  actionRequired: string;
  deadline: string;
  daysUntilDeadline: number;
}

export interface DocumentDependency {
  parent: string;
  requires: string;
  status: 'failing' | 'warning' | 'ok';
  reason: string;
  currentValidity: string;
  requiredValidity: string;
}

// Helper function to calculate days between dates
const getDaysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get days until expiry
const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to check if document is expired
const isExpired = (expiryDate: string): boolean => {
  return getDaysUntilExpiry(expiryDate) <= 0;
};

// Helper function to format date
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function analyzeDependencies(documents: Document[]): DependencyAnalysis {
  const criticalAlerts: CriticalAlert[] = [];
  const dependencies: DocumentDependency[] = [];
  
  // Find key documents
  const uaeVisa = documents.find(doc => doc.type === 'uae_visa');
  const passport = documents.find(doc => doc.type === 'passport');
  const healthInsurance = documents.find(doc => doc.type === 'health_insurance');
  const ejari = documents.find(doc => doc.type === 'ejari');
  const emiratesId = documents.find(doc => doc.type === 'emirates_id');

  if (!uaeVisa) {
    return {
      healthScore: 0,
      criticalAlerts: [{
        severity: 'critical',
        title: 'UAE Visa Not Found',
        description: 'No UAE visa document found. This is required for dependency analysis.',
        affectedDocuments: [],
        actionRequired: 'Upload your UAE visa document',
        deadline: 'Immediately',
        daysUntilDeadline: 0
      }],
      dependencies: []
    };
  }

  const visaExpiryDays = getDaysUntilExpiry(uaeVisa.expiryDate);
  const visaExpiryDate = uaeVisa.expiryDate;
  
  // Only analyze if visa expires within 12 months
  if (visaExpiryDays <= 365) {
    
    // 1. PASSPORT DEPENDENCY CHECK
    if (passport) {
      const passportExpiryDays = getDaysUntilExpiry(passport.expiryDate);
      const requiredPassportValidity = new Date(visaExpiryDate);
      requiredPassportValidity.setMonth(requiredPassportValidity.getMonth() + 6);
      
      const daysBetweenVisaAndPassport = getDaysBetween(visaExpiryDate, passport.expiryDate);
      
      if (daysBetweenVisaAndPassport < 180) { // Less than 6 months
        const status = passportExpiryDays <= 0 ? 'failing' : 'warning';
        const severity = passportExpiryDays <= 0 ? 'critical' : 'warning';
        
        dependencies.push({
          parent: 'uae_visa',
          requires: 'passport',
          status,
          reason: `Passport expires ${formatDate(passport.expiryDate)}, but visa renewal requires passport valid until ${formatDate(requiredPassportValidity.toISOString().split('T')[0])}`,
          currentValidity: formatDate(passport.expiryDate),
          requiredValidity: formatDate(requiredPassportValidity.toISOString().split('T')[0])
        });

        criticalAlerts.push({
          severity,
          title: '🚨 CRITICAL: Passport Validity Insufficient for Visa Renewal',
          description: `Your passport expires ${formatDate(passport.expiryDate)}, but UAE visa renewal requires your passport to be valid for at least 6 months AFTER your visa expiry date (${formatDate(visaExpiryDate)}). You need to renew your passport IMMEDIATELY or your visa renewal will be REJECTED.`,
          affectedDocuments: ['passport', 'uae_visa'],
          actionRequired: 'Renew passport immediately - visa renewal depends on this',
          deadline: formatDate(passport.expiryDate),
          daysUntilDeadline: passportExpiryDays
        });
      } else {
        dependencies.push({
          parent: 'uae_visa',
          requires: 'passport',
          status: 'ok',
          reason: 'Passport validity sufficient for visa renewal',
          currentValidity: formatDate(passport.expiryDate),
          requiredValidity: formatDate(requiredPassportValidity.toISOString().split('T')[0])
        });
      }
    } else {
      dependencies.push({
        parent: 'uae_visa',
        requires: 'passport',
        status: 'failing',
        reason: 'No passport document found',
        currentValidity: 'Not found',
        requiredValidity: 'Required'
      });

      criticalAlerts.push({
        severity: 'critical',
        title: '🚨 CRITICAL: Passport Document Missing',
        description: 'No passport document found. UAE visa renewal requires a valid passport.',
        affectedDocuments: ['passport'],
        actionRequired: 'Upload your passport document',
        deadline: 'Before visa renewal',
        daysUntilDeadline: visaExpiryDays
      });
    }

    // 2. HEALTH INSURANCE DEPENDENCY CHECK
    if (healthInsurance) {
      const healthExpiryDays = getDaysUntilExpiry(healthInsurance.expiryDate);
      
      if (isExpired(healthInsurance.expiryDate)) {
        dependencies.push({
          parent: 'uae_visa',
          requires: 'health_insurance',
          status: 'failing',
          reason: 'Health insurance has expired',
          currentValidity: formatDate(healthInsurance.expiryDate),
          requiredValidity: 'Active (not expired)'
        });

        criticalAlerts.push({
          severity: 'critical',
          title: '🚨 CRITICAL: Health Insurance EXPIRED',
          description: `Your health insurance expired on ${formatDate(healthInsurance.expiryDate)}. UAE visa renewal requires active health insurance. You MUST renew your health insurance immediately or your visa renewal will be REJECTED.`,
          affectedDocuments: ['health_insurance', 'uae_visa'],
          actionRequired: 'Renew health insurance immediately',
          deadline: 'Immediately',
          daysUntilDeadline: 0
        });
      } else if (healthExpiryDays <= 90) {
        dependencies.push({
          parent: 'uae_visa',
          requires: 'health_insurance',
          status: 'warning',
          reason: 'Health insurance expires soon',
          currentValidity: formatDate(healthInsurance.expiryDate),
          requiredValidity: 'Active (not expired)'
        });

        criticalAlerts.push({
          severity: 'warning',
          title: '⚠️ WARNING: Health Insurance Expiring Soon',
          description: `Your health insurance expires on ${formatDate(healthInsurance.expiryDate)} (${healthExpiryDays} days). Renew it before your visa renewal to avoid complications.`,
          affectedDocuments: ['health_insurance', 'uae_visa'],
          actionRequired: 'Renew health insurance before visa renewal',
          deadline: formatDate(healthInsurance.expiryDate),
          daysUntilDeadline: healthExpiryDays
        });
      } else {
        dependencies.push({
          parent: 'uae_visa',
          requires: 'health_insurance',
          status: 'ok',
          reason: 'Health insurance is active',
          currentValidity: formatDate(healthInsurance.expiryDate),
          requiredValidity: 'Active (not expired)'
        });
      }
    } else {
      dependencies.push({
        parent: 'uae_visa',
        requires: 'health_insurance',
        status: 'failing',
        reason: 'No health insurance document found',
        currentValidity: 'Not found',
        requiredValidity: 'Required'
      });

      criticalAlerts.push({
        severity: 'critical',
        title: '🚨 CRITICAL: Health Insurance Document Missing',
        description: 'No health insurance document found. UAE visa renewal requires active health insurance.',
        affectedDocuments: ['health_insurance'],
        actionRequired: 'Upload your health insurance document',
        deadline: 'Before visa renewal',
        daysUntilDeadline: visaExpiryDays
      });
    }

    // 3. EJARI DEPENDENCY CHECK
    if (ejari) {
      const ejariExpiryDays = getDaysUntilExpiry(ejari.expiryDate);
      const requiredEjariValidity = new Date();
      requiredEjariValidity.setMonth(requiredEjariValidity.getMonth() + 3);
      
      if (ejariExpiryDays < 90) { // Less than 3 months
        const status = ejariExpiryDays <= 0 ? 'failing' : 'warning';
        const severity = ejariExpiryDays <= 0 ? 'critical' : 'warning';
        
        dependencies.push({
          parent: 'uae_visa',
          requires: 'ejari',
          status,
          reason: `Ejari expires ${formatDate(ejari.expiryDate)}, but visa renewal requires Ejari valid for at least 3 months`,
          currentValidity: formatDate(ejari.expiryDate),
          requiredValidity: formatDate(requiredEjariValidity.toISOString().split('T')[0])
        });

        criticalAlerts.push({
          severity,
          title: '🚨 CRITICAL: Ejari Validity Insufficient',
          description: `Your Ejari expires on ${formatDate(ejari.expiryDate)} (${ejariExpiryDays} days left). UAE visa renewal requires Ejari to be valid for at least 3 months from now. You need to renew your Ejari IMMEDIATELY.`,
          affectedDocuments: ['ejari', 'uae_visa'],
          actionRequired: 'Renew Ejari immediately',
          deadline: formatDate(ejari.expiryDate),
          daysUntilDeadline: ejariExpiryDays
        });
      } else {
        dependencies.push({
          parent: 'uae_visa',
          requires: 'ejari',
          status: 'ok',
          reason: 'Ejari validity sufficient for visa renewal',
          currentValidity: formatDate(ejari.expiryDate),
          requiredValidity: formatDate(requiredEjariValidity.toISOString().split('T')[0])
        });
      }
    } else {
      dependencies.push({
        parent: 'uae_visa',
        requires: 'ejari',
        status: 'failing',
        reason: 'No Ejari document found',
        currentValidity: 'Not found',
        requiredValidity: 'Required'
      });

      criticalAlerts.push({
        severity: 'critical',
        title: '🚨 CRITICAL: Ejari Document Missing',
        description: 'No Ejari document found. UAE visa renewal requires a valid Ejari contract.',
        affectedDocuments: ['ejari'],
        actionRequired: 'Upload your Ejari document',
        deadline: 'Before visa renewal',
        daysUntilDeadline: visaExpiryDays
      });
    }

    // 4. EMIRATES ID LINKED TO VISA
    if (emiratesId) {
      const emiratesIdExpiryDays = getDaysUntilExpiry(emiratesId.expiryDate);
      
      if (emiratesIdExpiryDays <= 0) {
        dependencies.push({
          parent: 'emirates_id',
          requires: 'uae_visa',
          status: 'failing',
          reason: 'Emirates ID has expired',
          currentValidity: formatDate(emiratesId.expiryDate),
          requiredValidity: 'Active (linked to visa)'
        });

        criticalAlerts.push({
          severity: 'critical',
          title: '🚨 CRITICAL: Emirates ID EXPIRED',
          description: `Your Emirates ID expired on ${formatDate(emiratesId.expiryDate)}. Emirates ID is linked to your visa validity and must be renewed.`,
          affectedDocuments: ['emirates_id'],
          actionRequired: 'Renew Emirates ID immediately',
          deadline: 'Immediately',
          daysUntilDeadline: 0
        });
      } else if (emiratesIdExpiryDays <= 90) {
        dependencies.push({
          parent: 'emirates_id',
          requires: 'uae_visa',
          status: 'warning',
          reason: 'Emirates ID expires soon',
          currentValidity: formatDate(emiratesId.expiryDate),
          requiredValidity: 'Active (linked to visa)'
        });

        criticalAlerts.push({
          severity: 'warning',
          title: '⚠️ WARNING: Emirates ID Expiring Soon',
          description: `Your Emirates ID expires on ${formatDate(emiratesId.expiryDate)} (${emiratesIdExpiryDays} days). Renew it to maintain your legal status.`,
          affectedDocuments: ['emirates_id'],
          actionRequired: 'Renew Emirates ID',
          deadline: formatDate(emiratesId.expiryDate),
          daysUntilDeadline: emiratesIdExpiryDays
        });
      } else {
        dependencies.push({
          parent: 'emirates_id',
          requires: 'uae_visa',
          status: 'ok',
          reason: 'Emirates ID is active',
          currentValidity: formatDate(emiratesId.expiryDate),
          requiredValidity: 'Active (linked to visa)'
        });
      }
    }
  }

  // Calculate health score based on critical issues
  const criticalCount = criticalAlerts.filter(alert => alert.severity === 'critical').length;
  const warningCount = criticalAlerts.filter(alert => alert.severity === 'warning').length;
  
  let healthScore = 100;
  healthScore -= criticalCount * 30; // Each critical issue reduces score by 30
  healthScore -= warningCount * 10;  // Each warning reduces score by 10
  healthScore = Math.max(0, healthScore); // Don't go below 0

  // Debug logging
  console.log('Health Score Calculation:', {
    criticalCount,
    warningCount,
    healthScore,
    criticalAlerts: criticalAlerts.map(a => ({ severity: a.severity, title: a.title }))
  });

  return {
    healthScore,
    criticalAlerts,
    dependencies
  };
}
