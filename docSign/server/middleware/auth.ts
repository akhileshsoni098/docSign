/* import { defineEventHandler, getHeader, getRequestURL } from "h3";
import BrokerModel from "~~/server/model/broker.model";

import { handleError } from "~~/server/utils/errorHandler";
import { verifyToken } from "../services/user/auth.service";

const PUBLIC_ROUTES = [
  "/api/public",
  "/api/broker/auth/login",
  "/api/broker/auth/register",
  "/api/docusign/test",
  "/api/docusign/create",
];

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    path.startsWith(route)
  );

  if (isPublicRoute) return;

  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleError(event, 401, "Token missing");
  }

  const token = authHeader.split(" ")[1];

if(!token){
      return handleError(event, 401, "Invalid token");
}

  let decoded: { _id: string };

  try {
    decoded = verifyToken(token);
  } catch {
    return handleError(event, 401, "Invalid token");
  }

  const broker = await BrokerModel.findById(decoded._id).select("-password");

  if (!broker) {
    return handleError(event, 401, "Broker not found");
  }

  event.context.broker = broker;
}); */

import BrokerModel from "../model/broker.model";
import { verifyToken } from "../services/user/auth.service";



const PUBLIC_ROUTES = [
  "/api/public",
  "/api/broker/auth/login",
  "/api/broker/auth/register",
  "/api/docusign/test",
  "/api/docusign/create",
];

export default defineEventHandler(
  async (event) => {

    const path =
      getRequestURL(event)
        .pathname;

    const isPublicRoute =
      PUBLIC_ROUTES.some(
        (route) =>
          path.startsWith(route)
      ) ||

      !path.startsWith("/api");

    if (isPublicRoute) {
      return;
    }

    const authHeader =
      getHeader(
        event,
        "authorization"
      );

    if (
      !authHeader ||
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return handleError(
        event,
        401,
        "Token missing"
      );
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return handleError(
        event,
        401,
        "Invalid token"
      );
    }

    let decoded: {
      _id: string;
    };

    try {
      decoded =
        verifyToken(token);
    } catch {
      return handleError(
        event,
        401,
        "Invalid token"
      );
    }

    const broker =
      await BrokerModel
        .findById(decoded._id)
        .select("-password");

    if (!broker) {
      return handleError(
        event,
        401,
        "Broker not found"
      );
    }

    event.context.broker =
      broker;
  }
);
