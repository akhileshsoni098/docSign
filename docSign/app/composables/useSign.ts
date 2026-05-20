// composables/useSign.ts
// Public routes — no auth token needed
export const useSign = () => {
  const config = useRuntimeConfig();
  const BASE = config.public.appUrl;

  // GET /api/public/sign/:token
  async function getSigningDetail(token: string) {
    const res = await fetch(`${BASE}/api/public/sign/${token}`);
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.message || "Invalid or expired signing link");
    return data;
  }

  // POST /api/public/sign/:token  (form-data with signedFile)
  async function submitSignedFile(token: string, file: File) {
    const fd = new FormData();
    fd.append("signedFile", file);

    const res = await fetch(`${BASE}/api/public/sign/${token}`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.message || "Failed to submit signed document");
    return data;
  }

  return { getSigningDetail, submitSignedFile };
};
