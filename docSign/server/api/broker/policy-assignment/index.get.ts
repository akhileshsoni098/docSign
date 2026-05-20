import {
  defineEventHandler,
  getQuery,
} from "h3";
import { getAssignedPoliciesService } from "~~/server/services/policyAssignmentService/policyAssignment.service";
import { IResBroker } from "~~/server/types/brokerProfileTypes";



import {
  handleErrorCatch,
} from
"~~/server/utils/errorHandler";

export default defineEventHandler(
  async (event) => {
    try {
      const broker =
        event.context
          .broker as IResBroker;

      const query =
        getQuery(event);

      const page =
        Number(query.page) || 1;

      const limit =
        Number(query.limit) || 10;

      return await getAssignedPoliciesService(
        broker._id.toString(),
        page,
        limit
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
                ).statusCode
              )
            : 500;

        return handleErrorCatch(
          statusCode,
          err.message
        );
      }

      return handleErrorCatch(
        500,
        "Internal Server Error"
      );
    }
  }
);