import { randomUUID } from "node:crypto";
import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

export const createPolicyAssignmentService = async (body: {
  brokerId: string;
  customerId: string;
  policyId: string;
}) => {
  const { brokerId, customerId, policyId } = body;

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
    message: "Policy link generated",
    signLink: `/api/public/sign/${signingToken}`,
    assignment,
  };
};