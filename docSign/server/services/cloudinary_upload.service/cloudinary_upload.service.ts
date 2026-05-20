import { uploadSingleFile } from "~~/server/utils/uploadToCloudinary";

export const uploadPdfPolicyService = async (
  files: any
) => {
  const avatar = files?.avatar?.[0];

  let uploadedImage = null;

  if (avatar) {
    const uploadResult = await uploadSingleFile(
      avatar,
      "users"
    );

    if (!uploadResult.status) {
      return {
        status: false,
        message: uploadResult.message,
      };
    }

    uploadedImage = uploadResult.data;
  }

  return {
    status: true,
    message: "User created",
    data: uploadedImage,
  };
};


// =========== delete Single =======


