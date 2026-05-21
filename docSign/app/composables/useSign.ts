export const useSign = () => {
  const config = useRuntimeConfig();
  const BASE = config.public.appUrl;

  async function getAssignment(token: string) {
    const res = await fetch(`${BASE}/api/public/assignment/${token}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Invalid or expired signing link");
    }
    return data;
  }

  async function submitSignedFile(token: string, file: File) {
    const fd = new FormData();
    fd.append("signedFile", file);

    const res = await fetch(`${BASE}/api/public/sign/${token}`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Failed to submit signed document");
    }
    return data;
  }

  return { getAssignment, submitSignedFile };
};
