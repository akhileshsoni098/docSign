import mongoose, { Model } from "mongoose";
import type { ICustomer } from "~~/server/types/customer.types";

const customerSchema = new mongoose.Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Broker",
      required: true,
    },
  },
  { timestamps: true }
);

const CustomerModel =
  mongoose.model<ICustomer>("Customer", customerSchema);

export default CustomerModel;