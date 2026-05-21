import type { ObjectId } from "mongoose";
import { getPoliciesService } from "~~/server/services/policy/policy.service";
import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {

  const brokerId = event.context.broker._id.toString() 
  

    if (!brokerId) {
      return {
        success: false,
        message: "brokerId is required",
      };
    }

    return await getPoliciesService(brokerId);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const statusCode =
        "statusCode" in err ? Number((err as Error & { statusCode?: number }).statusCode) : 500;
      return handleErrorCatch(statusCode, err.message);
    }

    return handleErrorCatch(500, "Internal Server Error");
  }
});