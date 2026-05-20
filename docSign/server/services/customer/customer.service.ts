import { ObjectId } from "mongoose";
import CustomerModel from "~~/server/model/customer.model";
import type {
  ICreateCustomer,
  IUpdateCustomer,
} from "~~/server/types/customer.types";

export const createCustomerService = async (
  body: ICreateCustomer,
  brokerId: string | ObjectId,
) => {
  const { name, email, phone, address } = body;

  const existingCustomer = await CustomerModel.findOne({ email });

  if (existingCustomer) {
    throw createError({
      statusCode: 400,
      statusMessage: "Customer already exists",
    });
  }

  const customer = await CustomerModel.create({
    name,
    email,
    phone,
    address,
    brokerId: brokerId.toString(),
  });

  return {
    success: true,
    message: "Customer created successfully",
    customer,
  };
};

export const getCustomersService = async (brokerId: string | ObjectId) => {
  const customers = await CustomerModel.find({
    brokerId: brokerId.toString(),
  }).sort({ createdAt: -1 });

  return {
    success: true,
    customers,
  };
};

export const getCustomerByIdService = async (
  id: string,
  brokerId: string | ObjectId,
) => {
  const customer = await CustomerModel.findById(id);

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  if (customer.brokerId.toString() !== brokerId.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorize access",
    });
  }

  return {
    success: true,
    customer,
  };
};

export const updateCustomerService = async (
  id: string,
  body: IUpdateCustomer,
  brokerId: string | ObjectId,
) => {
  const customer = await CustomerModel.findByIdAndUpdate(id, body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  if (customer.brokerId.toString() !== brokerId.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorize access",
    });
  }

  return {
    success: true,
    message: "Customer updated successfully",
    customer,
  };
};

export const deleteCustomerService = async (
  id: string,
  brokerId: string | ObjectId,
) => {
  const customer = await CustomerModel.findOneAndDelete({
    _id: id,
    brokerId: brokerId.toString(),
  });

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  if (customer.brokerId.toString() !== brokerId.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorize access",
    });
  }

  return {
    success: true,
    message: "Customer deleted successfully",
  };
};
