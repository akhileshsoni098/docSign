import { createError } from "h3";

import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

export const getPolicyBySigningTokenService = async (token: string) => {
  const assignment = await PolicyAssignmentModel.findOne({
    signingToken: token,
  })
    .populate("policyId")
    .populate("customerId")
    .populate("brokerId", "name , email ");

  if (!assignment) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid signing link",
    });
  }

  return {
    success: true,
    assignment,
  };
};
