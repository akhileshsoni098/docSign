import { defineEventHandler, getRouterParam } from "h3";
import { getSingleAssignmentService } from "~~/server/services/policyAssignmentService/policyAssignment.service";
import type { IResBroker } from "~~/server/types/brokerProfileTypes";

import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const broker = event.context.broker as IResBroker;

    const id = getRouterParam(event, "id") || "";

    return await getSingleAssignmentService(id, broker._id.toString());
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
