export const mockDocuments = [
  {
    id: '1',
    type: 'passport',
    number: 'N1234567',
    holderName: 'John Smith',
    issueDate: '2020-03-15',
    expiryDate: '2025-03-15', // 5 months from now
    issuingAuthority: 'US Department of State',
    status: 'warning'
  },
  {
    id: '2',
    type: 'uae_visa',
    number: 'UAE789654',
    holderName: 'John Smith',
    issueDate: '2023-12-01',
    expiryDate: '2025-12-01', // 13 months from now
    issuingAuthority: 'UAE Immigration',
    status: 'valid'
  },
  {
    id: '3',
    type: 'emirates_id',
    number: 'EID123456789',
    holderName: 'John Smith',
    issueDate: '2023-12-15',
    expiryDate: '2025-12-15',
    issuingAuthority: 'Federal Authority for Identity',
    status: 'valid'
  },
  {
    id: '4',
    type: 'ejari',
    number: 'EJ2024-4567',
    holderName: 'John Smith',
    issueDate: '2024-11-01',
    expiryDate: '2025-11-01', // 12 months from now
    issuingAuthority: 'Dubai Land Department',
    status: 'valid'
  },
  {
    id: '5',
    type: 'health_insurance',
    number: 'HI-UAE-9876',
    holderName: 'John Smith',
    issueDate: '2024-01-01',
    expiryDate: '2025-01-01', // Already expired!
    issuingAuthority: 'Dubai Insurance Company',
    status: 'expired'
  }
];

export type Document = typeof mockDocuments[0];
