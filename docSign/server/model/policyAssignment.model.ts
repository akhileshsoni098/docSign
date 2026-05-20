import mongoose from "mongoose";
import type { IPolicyAssignment } from "../types/policyAssignmentType";

const policyAssignmentSchema = new mongoose.Schema<IPolicyAssignment>(
  {
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "signed"],
      default: "pending",
    },

    signingToken: {
      type: String,
      required: true,
      unique: true,
    },

    // ===== DOCUSIGN =====

    docusignEnvelopeId: {
      type: String,
    },

    docusignStatus: {
      type: String,
      enum: ["created", "sent", "completed"],
      default: "created",
    },

    // ===== SIGNED PDF =====

    signedAt: {
      type: Date,
    },

    signedPdfUrl: {
      type: String,
      default: null,
    },

    signedFilePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

policyAssignmentSchema.index(
  {
    brokerId: 1,
    customerId: 1,
    policyId: 1,
  },
  {
    unique: true,
  },
);

const PolicyAssignmentModel = mongoose.model<IPolicyAssignment>(
  "PolicyAssignment",
  policyAssignmentSchema,
);

export default PolicyAssignmentModel;
