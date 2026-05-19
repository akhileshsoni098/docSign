import { brokerRegisterService } from "~~/server/services/user/user.service";
import { IBroker } from "~~/server/types/brokerProfileTypes";
import {
  handleError,
  handleErrorCatch,
} from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {

    const body = await readBody(event) as IBroker;

    //============ validation ============

    if (
      !body.name ||
      !body.email ||
      !body.password
    ) {
      return handleError(
        event,
        400,
        "Provide register credentials"
      );
    }

    //============ register service ============

    const brokerRegister =
      await brokerRegisterService(body);

    return brokerRegister;

  } catch (err: unknown) {

    if (err instanceof Error) {

      const statusCode =
        "statusCode" in err
          ? Number(err.statusCode)
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
});