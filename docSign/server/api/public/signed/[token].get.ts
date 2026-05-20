/* import { defineEventHandler, createError } from "h3";

import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";

import {
  getDocusignAccessToken,
  downloadCompletedEnvelopePdf,
} from "~~/server/utils/docusign";

import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const token = event.context.params?.token || "";

    const assignment = await PolicyAssignmentModel.findOne({
      signingToken: token,
    });

    if (!assignment) {
      throw createError({
        statusCode: 404,
        statusMessage: "Assignment not found",
      });
    }

    // already processed
    if (assignment.status === "signed" && assignment.signedPdfUrl) {
      return {
        success: true,

        signedPdfUrl: assignment.signedPdfUrl,
      };
    }

    const accessToken = await getDocusignAccessToken();

    const config = useRuntimeConfig();

    const pdfBuffer = await downloadCompletedEnvelopePdf({
      accessToken,

      accountId: config.docusignAccountId,

      basePath: config.docusignBasePath,

      envelopeId: assignment.docusignEnvelopeId!,
    });

    const uploadDir = path.resolve("uploads");

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const fileName = `${assignment._id}.pdf`;

    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, pdfBuffer);

    assignment.status = "signed";

    assignment.signedPdfUrl = `/uploads/${fileName}`;

    assignment.signedAt = new Date();

    await assignment.save();

    return {
      success: true,

      signedPdfUrl: assignment.signedPdfUrl,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err
          ? Number(
              (
                err as Error & {
                  statusCode?: number;
                }
              ).statusCode,
            )
          : 500;

      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});
 */

import { defineEventHandler, createError } from "h3";

import PolicyAssignmentModel from "~~/server/model/policyAssignment.model";
import {
  getDocusignAccessToken,
  downloadCompletedEnvelopePdf,
} from "~~/server/utils/docusign";
import { uploadSingleFile } from "~~/server/utils/uploadToCloudinary";
import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const token = event.context.params?.token || "";

    const assignment = await PolicyAssignmentModel.findOne({
      signingToken: token,
    });

    if (!assignment) {
      throw createError({
        statusCode: 404,
        statusMessage: "Assignment not found",
      });
    }

    if (assignment.status === "signed" && assignment.signedPdfUrl) {
      return {
        success: true,
        signedPdfUrl: assignment.signedPdfUrl,
      };
    }

    if (!assignment.docusignEnvelopeId) {
      throw createError({
        statusCode: 400,
        statusMessage: "DocuSign envelope ID missing",
      });
    }

    const config = useRuntimeConfig();
    const accessToken = await getDocusignAccessToken();

    const pdfBuffer = await downloadCompletedEnvelopePdf({
      accessToken,
      accountId: config.docusignAccountId,
      basePath: config.docusignBasePath,
      envelopeId: assignment.docusignEnvelopeId,
    });
    const uploadResult = await uploadSingleFile(
      {
        data: pdfBuffer,

        filename: `${assignment._id}.pdf`,

        type: "application/pdf",
      },

      "signed-policies",

     "auto",
    );

    if (!uploadResult.status || !uploadResult.data) {
      throw createError({
        statusCode: 500,
        statusMessage: uploadResult.message || "Cloudinary upload failed",
      });
    }


    assignment.status = "signed";
    assignment.docusignStatus = "completed";
    assignment.signedAt = new Date();
    assignment.signedPdfUrl = uploadResult.data.url;
    assignment.signedFilePublicId = uploadResult.data.filename;

    await assignment.save();

    return {
      success: true,
      signedPdfUrl: uploadResult.data.url,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err
          ? Number((err as Error & { statusCode?: number }).statusCode)
          : 500;

      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});
