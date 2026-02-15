import { setTitle } from "@/lib/set-title";
import { useEffect } from "react";

export default function Appointments() {
  useEffect(() => {
    setTitle("Appointments");
  }, []);
  return <div>Appointments</div>;
}
