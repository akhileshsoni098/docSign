import mongoose, { Model } from "mongoose";
import type { IPolicy } from "~~/server/types/policy.types";

const policySchema = new mongoose.Schema<IPolicy>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    premium: {
      type: Number,
      required: true,
      min: 0,
    },
    coverage: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      required: true,
    },
    documentUrl: {
      type: String,
    },
    documentPublicId: {
      type: String,
    },
  },
  { timestamps: true },
);

const PolicyModel = mongoose.model<IPolicy>("Policy", policySchema);

export default PolicyModel;
