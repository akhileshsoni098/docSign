import { Types } from "mongoose";

export interface IPolicy {
  _id?: string;
  title: string;
  premium: number;
  coverage: string;
  duration: string;
  brokerId: Types.ObjectId;
  documentUrl?: string;
  documentPublicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreatePolicy {
  title: string;
  premium: number;
  coverage: string;
  duration: string;
  brokerId: string;
  documentUrl?: string;
  documentPublicId?: string;
}

export interface IUpdatePolicy {
  title?: string;
  premium?: number;
  coverage?: string;
  duration?: string;
  documentUrl?: string;
  documentPublicId?: string;
}