import { useEffect, useState } from "react";
import { fetchGuestUserFromDB } from "@/utils/guestUser";

export type User = { user_id: string; username: string };

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let user_id = localStorage.getItem("guest_user_id");
    let username = localStorage.getItem("guest_user_name");
    if (user_id && username) {
      fetchGuestUserFromDB(user_id).then((data) => {
        if (data) setUser({ user_id, username: data.name });
        else setUser(null); // Not found in DB, force prompt
      });
    }
  }, []);

  function setUsername(name: string) {
    let user_id = localStorage.getItem("guest_user_id");
    if (!user_id) return;
    localStorage.setItem("guest_user_name", name);
    setUser({ user_id, username: name });
  }

  return { user, setUsername };
}
