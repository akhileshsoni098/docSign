import { brokerLoginService } from "~~/server/services/user/user.service";
import {
  handleError,
  handleErrorCatch,
} from "~~/server/utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {

    const body = await readBody(event);

    const { email, password } = body;

    //============ validation ============

    if (!email || !password) {
      return handleError(
        event,
        400,
        "Provide login credentials"
      );
    }

    //============ login service ============

    const brokerLogin =
      await brokerLoginService(
        email,
        password
      );

    return brokerLogin;

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