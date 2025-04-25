"use client";
import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Settings, Save, RotateCw } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SITE_CONFIG } from "@/lib/graphql/queries/siteConfig";
import { UPDATE_SITE_CONFIG } from "@/lib/graphql/mutations/siteConfig";

interface SiteConfig {
  id: string;
  maintenanceMode: boolean;
  liveMode: boolean;
  heroVideo: string;
  monthlyTarget: number;
}

interface QueryResponse {
  siteConfig: SiteConfig;
}

const WebConfigPage = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [liveMode, setLiveMode] = useState(true);
  const [heroVideo, setHeroVideo] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState(0);

  const { data, loading, error } = useQuery<QueryResponse>(GET_SITE_CONFIG);
  const [updateSiteConfig] = useMutation(UPDATE_SITE_CONFIG);

  useEffect(() => {
    if (data) {
      setMaintenanceMode(data.siteConfig.maintenanceMode);
      setLiveMode(data.siteConfig.liveMode);
      setHeroVideo(data.siteConfig.heroVideo);
      setMonthlyTarget(data.siteConfig.monthlyTarget);
    }
  }, [data]);

  const saveSettings = async () => {
    try {
      await updateSiteConfig({
        variables: {
          maintenanceMode,
          liveMode,
          heroVideo,
          monthlyTarget,
        },
        context: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // assuming you store the token in localStorage
          },
        },
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings. Please try again.");
    }
  };
  

  // Reset to initial settings
  const resetSettings = () => {
    if (data) {
      setMaintenanceMode(data.siteConfig.maintenanceMode);
      setLiveMode(data.siteConfig.liveMode);
      setHeroVideo(data.siteConfig.heroVideo);
      setMonthlyTarget(data.siteConfig.monthlyTarget);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Settings className="w-6 h-6 text-blue-600" />
        Web Configuration
      </h2>

      {/* State Management Section */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">State Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Maintenance Mode</span>
            <Switch
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
              className={`${
                maintenanceMode ? "bg-red-500" : "bg-gray-300"
              } relative inline-flex items-center h-6 rounded-full w-12 transition`}
            >
              <span className="sr-only">Enable Maintenance Mode</span>
              <span
                className={`${
                  maintenanceMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span>Live Mode</span>
            <Switch
              checked={liveMode}
              onChange={setLiveMode}
              className={`${
                liveMode ? "bg-green-500" : "bg-gray-300"
              } relative inline-flex items-center h-6 rounded-full w-12 transition`}
            >
              <span className="sr-only">Enable Live Mode</span>
              <span
                className={`${
                  liveMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>
        </div>
      </div>

      {/* Hero Video URL */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Hero Video</h3>
        <div className="flex items-center justify-between">
          <span>Hero Video URL</span>
          <input
            type="text"
            value={heroVideo}
            onChange={(e) => setHeroVideo(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Monthly Sales Target */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Monthly Sales Target</h3>
        <div className="flex items-center justify-between">
          <span>Target</span>
          <input
            type="number"
            value={monthlyTarget}
            onChange={(e) => setMonthlyTarget(parseFloat(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={resetSettings}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <RotateCw className="w-5 h-5" />
          Reset
        </button>
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-5 h-5" />
          Save
        </button>
      </div>
    </div>
  );
};

export default WebConfigPage;
