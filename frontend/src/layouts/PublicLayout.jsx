import { useEffect } from "react";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  useEffect(() => {

    if (window.__PUBLIC_ASSETS_LOADED__) return;
    window.__PUBLIC_ASSETS_LOADED__ = true;

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "/css/style.css?v=" + Date.now();
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src = "/js/public.js?v=" + Date.now();
    script.defer = true;
    document.body.appendChild(script);

  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
