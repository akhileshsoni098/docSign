import jwt from "jsonwebtoken";

//============= Generate JWT Token =============

export const generateToken = (id: string) => {
  const config = useRuntimeConfig();

  return jwt.sign(
    { _id: id },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );
};

//============= Verify JWT Token =============

export const verifyToken = (token: string) => {
  const config = useRuntimeConfig();

  return jwt.verify(
    token,
    config.jwtSecret as string
  ) as { _id: string };
};