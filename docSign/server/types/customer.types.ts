import { Document, Types } from "mongoose";

export interface ICustomer  {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  brokerId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateCustomer {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface IUpdateCustomer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}