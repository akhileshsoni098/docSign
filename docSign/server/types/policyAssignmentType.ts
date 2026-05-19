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
  signedFileUrl?: string;
  signedFilePublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}