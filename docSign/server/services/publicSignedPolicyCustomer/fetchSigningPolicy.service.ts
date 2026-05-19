import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

export const getSignedPoliciesByCustomerIdService = async (customerId: string) => {
  const assignments = await PolicyAssignmentModel.find({
    customerId,
    status: "signed",
  })
    .populate("policyId")
    .populate("brokerId")
    .sort({ signedAt: -1 });

  return {
    success: true,
    assignments,
  };
};