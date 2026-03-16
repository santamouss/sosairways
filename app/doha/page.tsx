"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DohaPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?city=doha");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF8F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-monospace, monospace",
        fontSize: "14px",
        color: "#6b6b6b",
      }}
    >
      Redirecting…
    </div>
  );
}
