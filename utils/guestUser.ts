import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

export async function registerGuestUser(name: string): Promise<{ user_id: string; username: string }> {
  // Check localStorage first
  let user_id: string | null = localStorage.getItem("guest_user_id");
  const username = localStorage.getItem("guest_user_name");

  if (user_id && username) {
    // Optionally verify with DB here
    return { user_id, username };
  }

  user_id = uuidv4();
  await supabase.from("guest_users").insert([
    { id: user_id, name }
  ]);
  localStorage.setItem("guest_user_id", user_id);
  localStorage.setItem("guest_user_name", name);
  return { user_id, username: name };
}

export async function fetchGuestUserFromDB(user_id: string) {
  const { data } = await supabase
    .from("guest_users")
    .select("*")
    .eq("id", user_id)
    .maybeSingle();
  return data;
}
