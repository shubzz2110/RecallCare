import { setTitle } from "@/lib/set-title";
import { useEffect } from "react";

export default function Settings() {
  useEffect(() => {
    setTitle("Settings");
  }, []);
  return <div>Settings</div>;
}
