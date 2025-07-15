import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Redirect() {
  const { shortcode } = useParams();

  useEffect(() => {
    const urls = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
    const idx = urls.findIndex(u => u.shortcode === shortcode);
    if (idx !== -1) {
      urls[idx].clicks.push({
        timestamp: new Date().toISOString(),
        source: document.referrer || "Direct",
        location: "Unknown" 
      });
      localStorage.setItem("shortenedUrls", JSON.stringify(urls));
      window.location.href = urls[idx].longUrl;
    } else {
      window.location.href = "/";
    }
  }, [shortcode]);

  return <div>Redirecting...</div>;
}