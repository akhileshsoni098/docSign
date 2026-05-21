import { defineEventHandler, readBody } from "h3";
import { createPolicyAssignmentService } from "~~/server/services/policyAssignmentService/policyAssignment.service";
import type { IResBroker } from "~~/server/types/brokerProfileTypes";

import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const broker = event.context.broker as IResBroker;

    const body = await readBody<{
      customerId: string;
      policyId: string;
    }>(event);

    return await createPolicyAssignmentService({
      brokerId: broker._id.toString(),

      customerId: body.customerId,

      policyId: body.policyId,
    });
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
