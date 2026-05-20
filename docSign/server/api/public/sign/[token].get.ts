/* import { defineEventHandler, getRouterParam } from "h3";
import { getPolicyBySigningTokenService } from "~~/server/services/publicSignedPolicyCustomer/fetchSigningPolicy.service";

import { handleErrorCatch } from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const token = getRouterParam(event, "token") || "";

    return await getPolicyBySigningTokenService(token);
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
 */

import {
  defineEventHandler,
  getRouterParam,
  sendRedirect,
} from "h3";

import {
  startSigningService,
} from
"~~/server/services/policyAssignmentService/startSigning.service";

export default defineEventHandler(
  async (event) => {

    const token =
      getRouterParam(
        event,
        "token"
      ) || "";

    const result =
      await startSigningService(
        token
      );

    return sendRedirect(
      event,
      result.signingUrl
    );
  }
);