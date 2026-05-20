import { createError } from "h3";

import PolicyAssignmentModel from
"~~/server/model/policyAssignment.model";

import {
  uploadSingleFile,
} from
"~~/server/utils/uploadToCloudinary";

export const signPolicyService =
  async (
    token: string,
    file: {
      data: Buffer;
      type?: string;
      filename?: string;
    }
  ) => {
    const assignment =
      await PolicyAssignmentModel.findOne({
        signingToken: token,
      });

    if (!assignment) {
      throw createError({
        statusCode: 404,
        statusMessage:
          "Invalid signing link",
      });
    }

    if (
      assignment.status === "signed"
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Policy already signed",
      });
    }

    const uploadResult =
      await uploadSingleFile(
        file,
        "signed_policies",
        "raw"
      );

    if (
      !uploadResult.status ||
      !uploadResult.data
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          uploadResult.message,
      });
    }

    assignment.status = "signed";

    assignment.signedAt =
      new Date();

    assignment.signedFileUrl =
      uploadResult.data.url;

    assignment.signedFilePublicId =
      uploadResult.data.filename;

    await assignment.save();

    return {
      success: true,
      message:
        "Policy signed successfully",
      assignment,
    };
  };