import {
  defineEventHandler,
  getRouterParam,
  sendRedirect,
} from "h3";

import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

import {
  startSigningService,
} from
"~~/server/services/policyAssignmentService/startSigning.service";

export default defineEventHandler(
  async (event) => {

    const token =
      getRouterParam(
        event,
        "token"
      ) || "";

    const assignment = await PolicyAssignmentModel.findOne({ signingToken: token });

    if (assignment?.status === "signed") {
      const config = useRuntimeConfig();
      const url = assignment.signedPdfUrl
        ? `${config.public.appUrl}/sign/${token}?status=completed&url=${encodeURIComponent(assignment.signedPdfUrl)}`
        : `${config.public.appUrl}/sign/${token}?status=completed`;
      return sendRedirect(event, url);
    }

    const result =
      await startSigningService(
        token
      );

    return sendRedirect(
      event,
      result.signingUrl
    );
  }
);
