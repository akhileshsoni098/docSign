// server/utils/docusign.ts
interface DocusignConfig {
  accessToken: string;
  accountId: string;
  basePath: string;
}

interface CreateSigningSessionInput extends DocusignConfig {
  signerName: string;
  signerEmail: string;
  signingToken: string;
  documentUrl: string;
  returnUrl: string;
}

interface CreateSigningSessionResult {
  envelopeId: string;
  signingUrl: string;
}

async function fetchPdfAsBase64(documentUrl: string): Promise<string> {
  const response = await fetch(documentUrl);

  if (!response.ok) {
    throw new Error("Failed to download policy PDF");
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer.toString("base64");
}

export async function createDocusignSigningSession(
  input: CreateSigningSessionInput,
): Promise<CreateSigningSessionResult> {
  const documentBase64 = await fetchPdfAsBase64(input.documentUrl);

  const envelopePayload = {
    emailSubject: "Please sign your policy",
    documents: [
      {
        documentBase64,
        name: "Policy PDF",
        fileExtension: "pdf",
        documentId: "1",
      },
    ],
    recipients: {
      signers: [
        {
          email: input.signerEmail,
          name: input.signerName,
          recipientId: "1",
          routingOrder: "1",
          clientUserId: input.signingToken,
        },
      ],
    },
    status: "sent",
  };

  const envelopeRes = await fetch(
    `${input.basePath}/v2.1/accounts/${input.accountId}/envelopes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envelopePayload),
    },
  );

  if (!envelopeRes.ok) {
    const text = await envelopeRes.text();
    throw new Error(`DocuSign envelope creation failed: ${text}`);
  }

  const envelopeData: { envelopeId: string } = await envelopeRes.json();

  const viewPayload = {
    returnUrl: input.returnUrl,
    authenticationMethod: "none",
    email: input.signerEmail,
    userName: input.signerName,
    clientUserId: input.signingToken,
  };

  const viewRes = await fetch(
    `${input.basePath}/v2.1/accounts/${input.accountId}/envelopes/${envelopeData.envelopeId}/views/recipient`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(viewPayload),
    },
  );

  if (!viewRes.ok) {
    const text = await viewRes.text();
    throw new Error(`DocuSign recipient view failed: ${text}`);
  }

  const viewData: { url: string } = await viewRes.json();

  return {
    envelopeId: envelopeData.envelopeId,
    signingUrl: viewData.url,
  };
}

export async function downloadCompletedEnvelopePdf(
  input: DocusignConfig & { envelopeId: string },
): Promise<Buffer> {
  const response = await fetch(
    `${input.basePath}/v2.1/accounts/${input.accountId}/envelopes/${input.envelopeId}/documents/combined`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to download signed PDF: ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

import docusign from "docusign-esign";

import fs from "fs";
import path from "path";

export const getDocusignAccessToken = async () => {
  const config = useRuntimeConfig();

  let privateKey: string | Buffer;

  try {
    privateKey = fs.readFileSync(path.resolve("server/certs/private.key"));
  } catch {
    privateKey = config.docusignPrivateKey.replace(/\\n/g, "\n");
  }

  const apiClient = new docusign.ApiClient();

  apiClient.setOAuthBasePath(config.docusignAuthServer);

  const results = await apiClient.requestJWTUserToken(
    config.docusignIntegrationKey,
    config.docusignUserId,
    "signature impersonation",
    privateKey,
    3600,
  );

  return results.body.access_token;
};
