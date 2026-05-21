import { createError } from "h3";

import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

import {
  createDocusignSigningSession,
  getDocusignAccessToken,
} from "~~/server/utils/docusign";

export const startSigningService = async (token: string) => {
  const assignment = await PolicyAssignmentModel.findOne({
    signingToken: token,
  })
    .populate("policyId")
    .populate("customerId");

  if (!assignment) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid signing link",
    });
  }

  if (assignment.status === "signed") {
    throw createError({
      statusCode: 400,
      statusMessage: "Policy already signed",
    });
  }

  const config = useRuntimeConfig();

  const customer = assignment.customerId as unknown as {
    name: string;
    email: string;
  };

  const policy = assignment.policyId as unknown as {
    documentUrl: string;
  };

  const accessToken = await getDocusignAccessToken();

  const session = await createDocusignSigningSession({
    accessToken,

    accountId: config.docusignAccountId,

    basePath: config.docusignBasePath,

    signerName: customer.name,

    signerEmail: customer.email,

    signingToken: token,

    documentUrl: policy.documentUrl,

    returnUrl: `${config.public.appUrl}/api/public/signed/${token}`,
  });

  assignment.docusignEnvelopeId = session.envelopeId;

  assignment.docusignStatus = "sent";

  await assignment.save();

  return {
    success: true,

    signingUrl: session.signingUrl,
  };
};
