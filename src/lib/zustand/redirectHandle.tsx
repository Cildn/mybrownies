"use client";
import { useQuery } from "@apollo/client";
import { GET_SITE_CONFIG } from "../graphql/queries/siteConfig";
import { useRouter } from "next/navigation"; // For client-side navigation in Next.js 13+
import { useConfigStore } from "./useConfigStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation"; // For getting the current pathname in Next.js 13+

const RedirectHandler = () => {
  const { data, loading, error } = useQuery(GET_SITE_CONFIG); // Get site config using Apollo
  const router = useRouter();
  const pathname = usePathname(); // Use this to get the current pathname
  const setMaintenanceMode = useConfigStore((state) => state.setMaintenanceMode);
  const setLiveMode = useConfigStore((state) => state.setLiveMode);

  // Ensure this runs only on the client side
  useEffect(() => {
    if (data && !loading && pathname !== null) { // Check if pathname is not null
      const { maintenanceMode, liveMode } = data.siteConfig;
      setMaintenanceMode(maintenanceMode);
      setLiveMode(liveMode);

      // Exclude /admin and /signin from redirection logic
      const isExcludedPath = pathname.startsWith("/admin") || pathname.startsWith("/signin");

      // If the path is not excluded (i.e., not /admin or /signin), apply the redirect logic
      if (!isExcludedPath) {
        if (!liveMode) {
          router.push("/down"); // Redirect to the down page if the site is not live
        } else if (maintenanceMode) {
          router.push("/maintenance"); // Redirect to maintenance page if maintenance mode is on
        }
      }
    }
  }, [data, loading, pathname, router, setMaintenanceMode, setLiveMode]);

  // Show loading state while fetching config
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    console.error(error);
    return <div>Error loading site config</div>;
  }

  return null; // Return nothing as this component will handle the redirects
};

export default RedirectHandler;
