export interface Broker {
  _id: string
  name: string
  email: string
  role: string
}

export interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  brokerId?: string
}

export interface Policy {
  _id: string
  title: string
  premium: number
  coverage: string
  duration: string
  brokerId: string
  documentUrl?: string
  documentPublicId?: string
}

export interface Assignment {
  _id: string
  brokerId: string
  customerId: Customer | string
  policyId: Policy | string
  status: 'pending' | 'signed' | 'expired'
  signingToken: string
  signedPdfUrl?: string
  signedFilePublicId?: string
  createdAt: string
  updatedAt: string
}