/**
 * @typedef {Object} PolicyInputs
 * @property {string} companyName
 * @property {string} productName
 * @property {string} websiteUrl
 * @property {string} contactEmail
 * @property {string} effectiveDate
 * @property {string} jurisdiction
 * @property {string[]} dataCollected
 * @property {string[]} dataUseCases
 * @property {string[]} dataSharing
 * @property {string[]} userRights
 * @property {string[]} cookiesUsed
 * @property {string[]} securityPractices
 * @property {string} accountDeletionProcess
 * @property {string} refundPolicy
 * @property {string[]} complianceStandards
 * @property {string} supportEmail
 */

/**
 * @typedef {Object} PolicyRequest
 * @property {PolicyInputs} inputs
 * @property {string[]} documents
 */

/**
 * @typedef {Object} PolicyDocument
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef {Object} PolicyResponse
 * @property {string} generatedAt
 * @property {string} companyName
 * @property {Record<string, PolicyDocument>} documents
 * @property {string} combinedMarkdown
 */

const DEFAULT_DOCS = ['privacy', 'terms', 'cookies'];

const REQUIRED_FIELDS = ['companyName', 'productName', 'websiteUrl', 'contactEmail', 'effectiveDate'];

const normalizeInputs = (inputs) => ({
  companyName: inputs.companyName?.trim() ?? '',
  productName: inputs.productName?.trim() ?? '',
  websiteUrl: inputs.websiteUrl?.trim() ?? '',
  contactEmail: inputs.contactEmail?.trim() ?? '',
  effectiveDate: inputs.effectiveDate?.trim() ?? '',
  jurisdiction: inputs.jurisdiction?.trim() || 'United States',
  dataCollected: Array.isArray(inputs.dataCollected) ? inputs.dataCollected : [],
  dataUseCases: Array.isArray(inputs.dataUseCases) ? inputs.dataUseCases : [],
  dataSharing: Array.isArray(inputs.dataSharing) ? inputs.dataSharing : [],
  userRights: Array.isArray(inputs.userRights) ? inputs.userRights : [],
  cookiesUsed: Array.isArray(inputs.cookiesUsed) ? inputs.cookiesUsed : [],
  securityPractices: Array.isArray(inputs.securityPractices) ? inputs.securityPractices : [],
  accountDeletionProcess: inputs.accountDeletionProcess?.trim() || 'Contact support to request deletion.',
  refundPolicy: inputs.refundPolicy?.trim() || 'All sales are final unless required by law.',
  complianceStandards: Array.isArray(inputs.complianceStandards) ? inputs.complianceStandards : [],
  supportEmail: inputs.supportEmail?.trim() || inputs.contactEmail?.trim() || ''
});

const assertRequired = (inputs) => {
  const missing = REQUIRED_FIELDS.filter((field) => !inputs[field]);
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  return '';
};

const listItems = (items, fallback) => {
  if (!items || items.length === 0) {
    return `- ${fallback}`;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

const buildPrivacyPolicy = (inputs) => {
  const summary = `${inputs.companyName} ("${inputs.companyName}") operates ${inputs.productName} ("Service"). This Privacy Policy explains how we collect, use, and share data when you use ${inputs.websiteUrl}.`;
  const dataCollected = listItems(inputs.dataCollected, 'Basic account and usage data.');
  const dataUseCases = listItems(inputs.dataUseCases, 'Provide and improve the Service.');
  const dataSharing = listItems(inputs.dataSharing, 'We do not sell personal information.');
  const userRights = listItems(inputs.userRights, 'Request access, correction, or deletion of your data.');
  const security = listItems(inputs.securityPractices, 'We use reasonable administrative, technical, and physical safeguards.');
  const compliance = listItems(inputs.complianceStandards, 'We follow applicable privacy laws in our jurisdiction.');

  return [
    '# Privacy Policy',
    '',
    `**Effective Date:** ${inputs.effectiveDate}`,
    '',
    summary,
    '',
    '## Information We Collect',
    dataCollected,
    '',
    '## How We Use Information',
    dataUseCases,
    '',
    '## How We Share Information',
    dataSharing,
    '',
    '## Your Rights',
    userRights,
    '',
    '## Data Security',
    security,
    '',
    '## Data Retention & Deletion',
    `We retain data as long as needed to provide the Service. ${inputs.accountDeletionProcess}`,
    '',
    '## Compliance',
    compliance,
    '',
    '## Contact Us',
    `Questions? Email us at ${inputs.contactEmail}.`,
    ''
  ].join('\n');
};

const buildTermsOfService = (inputs) => {
  return [
    '# Terms of Service',
    '',
    `**Effective Date:** ${inputs.effectiveDate}`,
    '',
    `These Terms of Service ("Terms") govern access to ${inputs.productName} ("Service") operated by ${inputs.companyName}. By using ${inputs.websiteUrl}, you agree to these Terms.`,
    '',
    '## Use of the Service',
    '- You must follow all applicable laws.',
    '- You are responsible for activity on your account.',
    '- We may suspend access for misuse or security concerns.',
    '',
    '## Accounts',
    '- You are responsible for maintaining the confidentiality of your credentials.',
    `- Account deletion: ${inputs.accountDeletionProcess}`,
    '',
    '## Payments & Refunds',
    `- ${inputs.refundPolicy}`,
    '',
    '## Intellectual Property',
    `- ${inputs.companyName} retains all rights to the Service content and trademarks.`,
    '',
    '## Disclaimers',
    '- The Service is provided "as is" without warranties of any kind.',
    '',
    '## Limitation of Liability',
    `- ${inputs.companyName} is not liable for indirect or consequential damages to the fullest extent permitted by law.`,
    '',
    '## Governing Law',
    `- These Terms are governed by the laws of ${inputs.jurisdiction}.`,
    '',
    '## Contact',
    `For support, email ${inputs.supportEmail}.`,
    ''
  ].join('\n');
};

const buildCookiePolicy = (inputs) => {
  const cookies = listItems(inputs.cookiesUsed, 'Essential cookies required to operate the Service.');

  return [
    '# Cookie Policy',
    '',
    `**Effective Date:** ${inputs.effectiveDate}`,
    '',
    `${inputs.productName} uses cookies and similar technologies on ${inputs.websiteUrl}.`,
    '',
    '## Cookies We Use',
    cookies,
    '',
    '## Managing Cookies',
    'You can manage cookies in your browser settings. Disabling cookies may impact Service functionality.',
    '',
    '## Contact',
    `Questions? Email ${inputs.contactEmail}.`,
    ''
  ].join('\n');
};

const buildDocuments = (inputs, documents) => {
  const results = {};

  if (documents.includes('privacy')) {
    results.privacy = {
      title: 'Privacy Policy',
      body: buildPrivacyPolicy(inputs)
    };
  }

  if (documents.includes('terms')) {
    results.terms = {
      title: 'Terms of Service',
      body: buildTermsOfService(inputs)
    };
  }

  if (documents.includes('cookies')) {
    results.cookies = {
      title: 'Cookie Policy',
      body: buildCookiePolicy(inputs)
    };
  }

  return results;
};

const combineMarkdown = (documents) => {
  return Object.values(documents)
    .map((doc) => doc.body.trim())
    .join('\n\n---\n\n');
};

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body.' })
    };
  }

  const request = /** @type {PolicyRequest} */ (payload || {});
  const inputs = normalizeInputs(request.inputs || {});
  const missingMessage = assertRequired(inputs);

  if (missingMessage) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: missingMessage })
    };
  }

  const selectedDocs = Array.isArray(request.documents) && request.documents.length > 0
    ? request.documents
    : DEFAULT_DOCS;

  const documents = buildDocuments(inputs, selectedDocs);
  const combinedMarkdown = combineMarkdown(documents);

  const response = /** @type {PolicyResponse} */ ({
    generatedAt: new Date().toISOString(),
    companyName: inputs.companyName,
    documents,
    combinedMarkdown
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response)
  };
}
