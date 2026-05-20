import { randomUUID } from "node:crypto";

import { createError } from "h3";

import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

export const createPolicyAssignmentService = async (body: {
  brokerId: string;
  customerId: string;
  policyId: string;
}) => {
  const { brokerId, customerId, policyId } = body;

  const alreadyAssigned = await PolicyAssignmentModel.findOne({
    brokerId,
    customerId,
    policyId,
  });

  if (alreadyAssigned) {
    throw createError({
      statusCode: 409,
      statusMessage: "Policy already assigned to this customer",
    });
  }

  const signingToken = randomUUID();

  const assignment = await PolicyAssignmentModel.create({
    brokerId,
    customerId,
    policyId,
    signingToken,
    status: "pending",
  });

  return {
    success: true,
    message: "Policy assigned successfully",
    signLink: `/sign-policy/${signingToken}`,
    assignment,
  };
};

// get All

export const getAssignedPoliciesService = async (
  brokerId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [assignments, total] = await Promise.all([
    PolicyAssignmentModel.find({
      brokerId,
    })
      .populate("customerId")
      .populate("policyId")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    PolicyAssignmentModel.countDocuments({
      brokerId,
    }),
  ]);

  return {
    success: true,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },

    assignments,
  };
};

// get Single

export const getSingleAssignmentService = async (
  id: string,
  brokerId: string,
) => {
  const config = useRuntimeConfig();

  const assignment = await PolicyAssignmentModel.findOne({
    _id: id,
    brokerId,
  })
    .populate("customerId")
    .populate("policyId");

  if (!assignment) {
    throw createError({
      statusCode: 404,
      statusMessage: "Assignment not found",
    });
  }

  return {
    success: true,
    assignment,
    link: `${config.public.appUrl}/api/public/sign/${assignment.signingToken}`,
  };
};

// signed policy

export const getSignedPoliciesByCustomerIdService = async (
  customerId: string,
) => {
  const assignments = await PolicyAssignmentModel.find({
    customerId,
    status: "signed",
  })
    .populate("policyId")
    .populate("brokerId")
    .sort({
      signedAt: -1,
    });

  return {
    success: true,
    assignments,
  };
};
