import { useAuthStore } from "~/stores/auth";
import { useApiFetch } from "~/utils/api";

export const useAuth = () => {
  const { apiFetch } = useApiFetch();
  const auth = useAuthStore();
  const router = useRouter();

  async function register(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    const data = await apiFetch("/api/public", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data;
  }

  async function login(payload: { email: string; password: string }) {
    const data = await apiFetch<{ token: string; broker?: any; user?: any }>(
      "/api/public/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    const broker = data.broker || data.user;
    auth.setAuth(data.token, broker);
    return data;
  }

  async function getProfile() {
    const data = await apiFetch("/api/broker/profile");
    if (data.broker || data.user || data) {
      auth.setAuth(data.token || auth.token, data.broker || data.user || data);
    }
    return data;
  }

  function logout() {
    auth.logout();
    router.push("/login");
  }

  return { register, login, getProfile, logout };
};
