import { useAuthStore } from "~/stores/auth";
import { useApiFetch } from "~/utils/api";

// composables/useAuth.ts
export const useAuth = () => {
  const { apiFetch } = useApiFetch();
  const auth = useAuthStore();
  const router = useRouter();

  // POST /api/public  → Register broker
  async function register(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    const data = await apiFetch("/api/public", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  }

  // POST /api/public/login
  async function login(payload: { email: string; password: string }) {
    const data = await apiFetch<{ token: string; broker?: any; user?: any }>(
      "/api/public/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const broker = data.broker || data.user;
    auth.setAuth(data.token, broker);
    return data;
  }

  // GET /api/profile
  async function getProfile() {
    const data = await apiFetch("/api/profile");
    auth.setBroker(data.broker || data.user || data);
    return data;
  }

  function logout() {
    auth.logout();
    router.push("/login");
  }

  return { register, login, getProfile, logout };
};
