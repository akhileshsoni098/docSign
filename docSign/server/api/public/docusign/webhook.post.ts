import {
  defineEventHandler,
  readBody,
} from "h3";

import PolicyAssignmentModel from
"~~/server/model/policyAssignment.model";

export default defineEventHandler(
  async (event) => {

    const body =
      await readBody(event);

    const envelopeId =
      body.data
        ?.envelopeId;

    const assignment =
      await PolicyAssignmentModel.findOne(
        {
          docusignEnvelopeId:
            envelopeId,
        }
      );

    if (!assignment) {
      return {
        success: false,
      };
    }

    assignment.status =
      "signed";

    assignment.docusignStatus =
      "completed";

    assignment.signedAt =
      new Date();

    await assignment.save();

    return {
      success: true,
    };
  }
);