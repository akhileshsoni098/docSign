import bcrypt from "bcryptjs";
import BrokerModel from "~~/server/model/broker.model";
import type { IBroker } from "~~/server/types/brokerProfileTypes";
import { generateToken } from "./auth.service";

//================ BROKER REGISTER SERVICE =================

export const brokerRegisterService = async (body: IBroker) => {
  const { name, email, password } = body as IBroker;

  if (!name || !email || !password) {
    return { status: false, messsage: "all fields are required" };
  }

  //============== check existing broker ==============

  const existingBroker = await BrokerModel.findOne({
    email,
  });

  if (existingBroker) {
    throw createError({
      statusCode: 400,
      statusMessage: "Broker already exists",
    });
  }

  //============== hash password ==============

  const hashedPassword = await bcrypt.hash(password, 10);

  //============== create broker ==============

  const broker = await BrokerModel.create({
    name,
    email,
    password: hashedPassword,
  });

  //============== generate token ==============

  const token = generateToken(broker._id.toString());

  return {
    success: true,
    message: "Broker registered successfully",
    token,
    broker:{
      _id:broker._id,
      name:broker.name,
      email:broker.email,
      role:broker.role
    },
  };
};

//================ BROKER LOGIN SERVICE =================

export const brokerLoginService = async (email: string, password: string) => {
  //============== find broker ==============

  const broker = await BrokerModel.findOne({
    email,
  });

  if (!broker) {
    throw createError({
      statusCode: 404,
      statusMessage: "Broker not found",
    });
  }

  //============== compare password ==============

  const isPasswordMatch = await bcrypt.compare(password, broker.password);

  if (!isPasswordMatch) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }

  //============== generate token ==============

  const token = generateToken(broker._id.toString());

  return {
    success: true,
    message: "Broker login successful",
    token,
    broker:{
      _id:broker._id,
      name:broker.name,
      email:broker.email,
      role:broker.role
    },
  };
};
