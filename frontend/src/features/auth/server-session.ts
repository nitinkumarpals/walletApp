import { serverApi } from "@/lib/api/server";

/** Returns the current session ({ user }) or null, from the backend /user/me. */
export const getServerSession = async () => {
  const me = await serverApi.me();
  return me ? { user: me.user } : null;
};
