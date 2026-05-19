import { createPolicyService } from "~~/server/services/policy/policy.service";
import { handleError, handleErrorCatch } from "~~/server/utils/errorHandler";
import type { ICreatePolicy } from "~~/server/types/policy.types";

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as ICreatePolicy;

    if (!body.title || body.premium === undefined || !body.coverage || !body.duration || !body.brokerId) {
      return handleError(event, 400, "Provide policy details");
    }

    return await createPolicyService(body);

    
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err ? Number((err as Error & { statusCode?: number }).statusCode) : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});