import { Types } from "mongoose";
import type { ObjectId } from "mongoose";
import PolicyModel from "~~/server/model/policy.model";
import type {
  ICreatePolicy,
  IUpdatePolicy,
} from "~~/server/types/policy.types";
import {
  deleteSingleFile,
  uploadSingleFile,
} from "~~/server/utils/uploadToCloudinary";

interface IMultipartFile {
  data: Buffer;
  type?: string;
  filename?: string;
}

interface IPolicyFiles {
  document?: IMultipartFile[];
}

export const createPolicyService = async (
  body: ICreatePolicy,
  brokerId: string | Types.ObjectId,
  files: IPolicyFiles,
) => {
  const { title, premium, coverage, duration } = body;

  const pdfFile = files?.document?.[0];

  if (!pdfFile) {
    throw createError({
      statusCode: 400,
      statusMessage: "Policy PDF is required",
    });
  }

  if (pdfFile.type !== "application/pdf") {
    throw createError({
      statusCode: 400,
      statusMessage: "Only PDF files are allowed",
    });
  }

  const uploadResult = await uploadSingleFile(pdfFile, "policy_pdfs", "auto");

  if (!uploadResult.status || !uploadResult.data) {
    throw createError({
      statusCode: 400,
      statusMessage: uploadResult.message,
    });
  }

  const policy = await PolicyModel.create({
    title,
    premium,
    coverage,
    duration,
    brokerId,
    documentUrl: uploadResult.data.url,
    documentPublicId: uploadResult.data.filename,
  });

  return {
    success: true,
    message: "Policy created successfully",
    policy,
  };
};

export const getPoliciesService = async (brokerId: string) => {
  const policies = await PolicyModel.find({ brokerId }).sort({
    createdAt: -1,
  });

  return {
    success: true,
    policies,
  };
};

export const getPolicyByIdService = async (id: string) => {
  const policy = await PolicyModel.findById(id);

  if (!policy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Policy not found",
    });
  }

  return {
    success: true,
    policy,
  };
};

export const updatePolicyService = async (
  id: string,
  body: IUpdatePolicy,
  brokerId: string | ObjectId,
  files?: IPolicyFiles,
) => {
  const policy = await PolicyModel.findById(id);

  if (!policy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Policy not found",
    });
  }

  if (policy.brokerId.toString() !== brokerId.toString()) {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorize Access",
    });
  }

  let documentUrl = policy.documentUrl;
  let documentPublicId = policy.documentPublicId;

  const pdfFile = files?.document?.[0];

  if (pdfFile) {
    if (pdfFile.type !== "application/pdf") {
      throw createError({
        statusCode: 400,
        statusMessage: "Only PDF files are allowed",
      });
    }

    const uploadResult = await uploadSingleFile(pdfFile, "policy_pdfs", "auto");

    if (!uploadResult.status || !uploadResult.data) {
      throw createError({
        statusCode: 400,
        statusMessage: uploadResult.message,
      });
    }

    documentUrl = uploadResult.data.url;
    documentPublicId = uploadResult.data.filename;

    if (policy.documentPublicId) {
      await deleteSingleFile({
        filename: policy.documentPublicId,
        resourceType: "raw",
      });
    }
  }

  const updatedPolicy = await PolicyModel.findByIdAndUpdate(
    id,
    {
      ...body,
      documentUrl,
      documentPublicId,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );

  return {
    success: true,
    message: "Policy updated successfully",
    policy: updatedPolicy,
  };
};

export const deletePolicyService = async (
  id: string,
  brokerId: string | ObjectId,
) => {
  const policy = await PolicyModel.findById({ _id: id, brokerId: brokerId });

  if (!policy) {
    throw createError({
      statusCode: 404,
      statusMessage: "Policy not found",
    });
  }

  if (policy.documentPublicId) {
    await deleteSingleFile({
      filename: policy.documentPublicId,
      resourceType: "raw",
    });
  }

  await PolicyModel.findByIdAndDelete(id);

  return {
    success: true,
    message: "Policy deleted successfully",
  };
};
