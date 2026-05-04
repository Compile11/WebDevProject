import { useEffect } from "react"

const isDev = import.meta.env.DEV;

export default function AdUnit({ slot }) {
  useEffect(() => {
    if (isDev) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error("Ad error:", e);
    }
  }, []);

  if (isDev) {
    return (
    <div className="my-4 rounded-lg border border-dashed border-gray-600 bg-gray-200 dark:bg-gray-800/40 p-4 text-center text-xs text-gray-800 dark:text-gray-400">
        Ad Placeholder
      </div>
    )
  }

  return (
    <ins
      className="adsbygoogle block my-4"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8940972235480250"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
