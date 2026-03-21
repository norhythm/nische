import { GoogleAnalytics as GA } from "@next/third-parties/google";

type GoogleAnalyticsProps = {
  gaId: string;
};

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return <GA gaId={gaId} />;
}
