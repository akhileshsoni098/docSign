import { Document, Types } from "mongoose";

export interface IBroker {
  name: string;
  email: string;
  password: string;
  role?: "Broker";
}

export interface IResBroker extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role?: "Broker";
}
