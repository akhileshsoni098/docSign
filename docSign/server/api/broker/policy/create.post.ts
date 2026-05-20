import { defineEventHandler, readMultipartFormData } from "h3";

import { createPolicyService } from "~~/server/services/policy/policy.service";
import { handleError, handleErrorCatch } from "~~/server/utils/errorHandler";
import type { ICreatePolicy } from "~~/server/types/policy.types";
import { IBroker, IResBroker } from "~~/server/types/brokerProfileTypes";
import type { MultiPartData } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);

    const body: Record<string, string> = {};

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
      } else {
        body[item.name] = item.data.toString();
      }
    }

    const broker = event.context.broker as IResBroker;

    return await createPolicyService(
      body as unknown as ICreatePolicy,
      broker._id.toString(),
      files,
    );
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
