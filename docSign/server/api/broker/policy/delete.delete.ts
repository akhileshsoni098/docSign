import { deletePolicyService } from "~~/server/services/policy/policy.service";
import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id as string;
    return await deletePolicyService(id);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err ? Number((err as Error & { statusCode?: number }).statusCode) : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});