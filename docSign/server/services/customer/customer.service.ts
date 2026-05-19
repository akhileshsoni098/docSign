import CustomerModel from "~~/server/model/customer.model";
import type {
  ICreateCustomer,
  IUpdateCustomer,
} from "~~/server/types/customer.types";

export const createCustomerService = async (body: ICreateCustomer) => {
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
  });

  return {
    success: true,
    message: "Customer created successfully",
    customer,
  };
};

export const getCustomersService = async () => {
  const customers = await CustomerModel.find().sort({ createdAt: -1 });

  return {
    success: true,
    customers,
  };
};

export const getCustomerByIdService = async (id: string) => {
  const customer = await CustomerModel.findById(id);

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  return {
    success: true,
    customer,
  };
};

export const updateCustomerService = async (
  id: string,
  body: IUpdateCustomer
) => {
  const customer = await CustomerModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  return {
    success: true,
    message: "Customer updated successfully",
    customer,
  };
};

export const deleteCustomerService = async (id: string) => {
  const customer = await CustomerModel.findByIdAndDelete(id);

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: "Customer not found",
    });
  }

  return {
    success: true,
    message: "Customer deleted successfully",
  };
};