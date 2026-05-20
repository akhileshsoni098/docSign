import {
  defineEventHandler,
  getRouterParam,
  readMultipartFormData,
  type MultiPartData,
} from "h3";
import { signPolicyService } from "~~/server/services/publicSignedPolicyCustomer/signedPolicyByCustomer.service";

import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const token = getRouterParam(event, "token") || "";

    const formData = await readMultipartFormData(event);

    const files: Record<string, MultiPartData[]> = {};

    for (const item of formData || []) {
      if (!item.name) {
        continue;
      }

      if (item.filename) {
        if (!files[item.name]) {
          files[item.name] = [];
        }

        files[item.name]?.push(item);
      }
    }

    const signedFile = files?.signedFile?.[0];

    if (!signedFile) {
      return handleErrorCatch(400, "Signed file is required");
    }

    return await signPolicyService(token, signedFile);
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
