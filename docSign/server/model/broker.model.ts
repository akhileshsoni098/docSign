import mongoose, { Model } from "mongoose";
import { IBroker } from "../types/brokerProfileTypes";

const brokerProfileSchema = new mongoose.Schema<IBroker>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Broker",
    },
  },
  {
    timestamps: true,
  },
);

const BrokerModel = mongoose.model<IBroker>("Broker", brokerProfileSchema);

export default BrokerModel;
