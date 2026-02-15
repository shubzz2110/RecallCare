import { setTitle } from "@/lib/set-title";
import { useEffect } from "react";

export default function Patients() {
  useEffect(() => {
    setTitle("Patients");
  }, []);
  return <div>Patients</div>;
}
