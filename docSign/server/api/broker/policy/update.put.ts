import { updatePolicyService } from "~~/server/services/policy/policy.service";
import { handleErrorCatch } from "~~/server/utils/errorHandler";
import type { IUpdatePolicy } from "~~/server/types/policy.types";

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id as string;
    const body = (await readBody(event)) as IUpdatePolicy;

    return await updatePolicyService(id, body);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err ? Number((err as Error & { statusCode?: number }).statusCode) : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});