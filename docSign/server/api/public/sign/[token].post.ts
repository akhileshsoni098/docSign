import { defineEventHandler, getRouterParam, readMultipartFormData, createError } from "h3";
import { signPolicyService } from "../../../services/publicSignedPolicyCustomer/signedPolicyByCustomer.service";
import { handleErrorCatch } from "../../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const token = getRouterParam(event, "token") || "";

    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No file uploaded",
      });
    }

    const fileField = formData.find((item) => item.name === "signedFile");

    if (!fileField || !fileField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: "Signed file is required",
      });
    }

    const file = {
      data: fileField.data,
      type: fileField.type || "application/pdf",
      filename: fileField.filename || "signed-document.pdf",
    };

    return await signPolicyService(token, file);
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
