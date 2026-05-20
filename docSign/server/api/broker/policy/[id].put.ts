import {
  defineEventHandler,
  getQuery,
  readMultipartFormData,
  type MultiPartData,
} from "h3";

import { updatePolicyService } from "~~/server/services/policy/policy.service";

import { handleErrorCatch } from "~~/server/utils/errorHandler";

import type { IUpdatePolicy } from "~~/server/types/policy.types";
import { ObjectId } from "mongoose";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params as { id: string };

    const brokerId = event.context.broker._id as string | ObjectId;

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



    return await updatePolicyService(
      id,
      body as unknown as IUpdatePolicy,
      brokerId as string | ObjectId,
      // optional files
      Object.keys(files).length > 0 ? files : undefined,
    );
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
