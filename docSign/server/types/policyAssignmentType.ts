import mongoose from "mongoose";

export type AssignmentStatus = "pending" | "signed";

export interface IPolicyAssignment {
  _id?: string;
  brokerId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  policyId: mongoose.Types.ObjectId;
  status: AssignmentStatus;
  signingToken: string;
  signedAt?: Date;
  signedPdfUrl?: string;
  signedFilePublicId?: string;
  docusignEnvelopeId: string;
  docusignStatus: "created" | "sent" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}
