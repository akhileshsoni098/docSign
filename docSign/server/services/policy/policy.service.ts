import PolicyModel from "~~/server/model/policy.model";
import type {
  ICreatePolicy,
  IUpdatePolicy,
} from "~~/server/types/policy.types";

export const createPolicyService = async (body: ICreatePolicy) => {
  const {
    title,
    premium,
    coverage,
    duration,
    brokerId,
    documentUrl,
    documentPublicId,
  } = body;

  const policy = await PolicyModel.create({
    title,
    premium,
    coverage,
    duration,
    brokerId,
    documentUrl,
    documentPublicId,
  });

  return {
    success: true,
    message: "Policy created successfully",
    policy,
  };
};

export const getPoliciesService = async (brokerId: string) => {
  const policies = await PolicyModel.find({ brokerId }).sort({
    createdAt: -1,
  });

  return {
    success: true,
    policies,
  };
};

export const getPolicyByIdService = async (id: string) => {
  const policy = await PolicyModel.findById(id);

  if (!policy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Policy not found",
    });
  }

  return {
    success: true,
    policy,
  };
};

export const updatePolicyService = async (
  id: string,
  body: IUpdatePolicy
) => {
  const policy = await PolicyModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!policy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Policy not found",
    });
  }

  return {
    success: true,
    message: "Policy updated successfully",
    policy,
  };
};

export const deletePolicyService = async (id: string) => {
  const policy = await PolicyModel.findByIdAndDelete(id);

  if (!policy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Policy not found",
    });
  }

  return {
    success: true,
    message: "Policy deleted successfully",
  };
};