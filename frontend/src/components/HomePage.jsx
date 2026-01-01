import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clipboardAPI } from "../services/api";

const HomePage = () => {
  const [joinId, setJoinId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateNew = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await clipboardAPI.createClipboard();
      navigate(`/${data.id}`);
    } catch (err) {
      setError("Failed to create clipboard. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinExisting = (e) => {
    e.preventDefault();
    if (!joinId.trim()) {
      setError("Please enter a clipboard ID or URL");
      return;
    }

    // Extract ID from URL if full URL is provided
    let clipboardId = joinId.trim();

    // Handle full URL (e.g., http://localhost:3000/abc-123)
    if (clipboardId.includes("/")) {
      const parts = clipboardId.split("/");
      clipboardId = parts[parts.length - 1];
    }

    if (clipboardId) {
      navigate(`/${clipboardId}`);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* TopNavBar */}
      <header className="w-full border-b border-solid border-[#f0f2f4] dark:border-[#2a3441] bg-white dark:bg-[#111a22] px-3 py-2.5 sm:px-4 sm:py-3 md:px-10 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 text-[#111418] dark:text-white">
            <div className="size-7 sm:size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined !text-[24px] sm:!text-[32px]">
                content_paste_go
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
              Shared Clipboard
            </h2>
          </div>
          <button className="flex min-w-[70px] sm:min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 sm:h-10 px-3 sm:px-4 bg-primary/10 text-primary active:bg-primary/20 transition-colors text-xs sm:text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">How it works</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-start py-6 sm:py-10 px-3 sm:px-4 md:px-10">
        <div className="w-full max-w-[960px] flex flex-col items-center gap-8 sm:gap-12">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center gap-4 sm:gap-6 max-w-3xl animate-fade-in">
            <div className="flex flex-col gap-2 sm:gap-3">
              <h1 className="text-[#111418] dark:text-white text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                Collaborative Clipboard for Everyone
              </h1>
              <p className="text-[#617589] dark:text-[#9ca3af] text-sm sm:text-lg font-medium leading-normal max-w-xl mx-auto">
                Paste text here, access it anywhere. No login required. Simple,
                secure, and instant.
              </p>
            </div>
          </div>

          {/* Primary Action Card */}
          <div className="w-full max-w-lg bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                {error}
              </div>
            )}

            {/* Create New */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <button
                onClick={handleCreateNew}
                disabled={loading}
                className="w-full cursor-pointer items-center justify-center rounded-lg h-12 sm:h-14 px-4 sm:px-6 bg-primary active:bg-blue-600 transition-colors text-white flex gap-2 sm:gap-3 text-base sm:text-lg font-bold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      refresh
                    </span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      auto_fix_high
                    </span>
                    <span>Generate New Clipboard</span>
                  </>
                )}
              </button>
              <p className="text-center text-sm text-[#617589] dark:text-[#9ca3af]">
                Creates a unique, secret URL instantly
              </p>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#e5e7eb] dark:border-[#374151]"></div>
              <span className="flex-shrink-0 mx-4 text-[#617589] dark:text-[#9ca3af] text-sm font-medium">
                OR
              </span>
              <div className="flex-grow border-t border-[#e5e7eb] dark:border-[#374151]"></div>
            </div>

            {/* Join Existing */}
            <form onSubmit={handleJoinExisting} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-[#111418] dark:text-white font-bold text-base">
                  Join an existing clipboard
                </span>
                <div className="flex w-full items-stretch rounded-lg h-12 shadow-sm">
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => {
                      setJoinId(e.target.value);
                      setError("");
                    }}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-[#111418] dark:text-white bg-[#f0f2f4] dark:bg-[#111a22] border border-r-0 border-[#d1d5db] dark:border-[#374151] focus:border-primary focus:ring-0 focus:outline-none px-3 sm:px-4 placeholder:text-[#9ca3af] text-sm sm:text-base font-normal leading-normal transition-all"
                    placeholder="Enter clipboard ID or URL..."
                  />
                  <button
                    type="submit"
                    className="flex min-w-[60px] sm:min-w-[80px] cursor-pointer items-center justify-center rounded-r-lg px-3 sm:px-5 bg-[#111418] dark:bg-[#374151] active:bg-black dark:active:bg-[#4b5563] text-white text-sm sm:text-base font-bold transition-colors"
                  >
                    <span>Go</span>
                  </button>
                </div>
              </label>
            </form>
          </div>

          {/* Features Grid */}
          <div className="w-full pt-6 sm:pt-8">
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="text-center">
                <h2 className="text-[#111418] dark:text-white text-xl sm:text-2xl font-bold leading-tight">
                  Key Features
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Feature 1 */}
                <div className="flex flex-col gap-3 sm:gap-4 rounded-xl border border-[#dbe0e6] dark:border-[#2a3441] bg-white dark:bg-[#1a2632] p-4 sm:p-6 active:shadow-md transition-shadow">
                  <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      bolt
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <h3 className="text-[#111418] dark:text-white text-base sm:text-lg font-bold leading-tight">
                      Share Instantly
                    </h3>
                    <p className="text-[#617589] dark:text-[#9ca3af] text-xs sm:text-sm font-normal leading-normal">
                      Changes are saved automatically. Share your unique link
                      with anyone.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col gap-3 sm:gap-4 rounded-xl border border-[#dbe0e6] dark:border-[#2a3441] bg-white dark:bg-[#1a2632] p-4 sm:p-6 active:shadow-md transition-shadow">
                  <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      no_accounts
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <h3 className="text-[#111418] dark:text-white text-base sm:text-lg font-bold leading-tight">
                      No Account Needed
                    </h3>
                    <p className="text-[#617589] dark:text-[#9ca3af] text-xs sm:text-sm font-normal leading-normal">
                      Start sharing immediately without signing up or providing
                      email.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col gap-3 sm:gap-4 rounded-xl border border-[#dbe0e6] dark:border-[#2a3441] bg-white dark:bg-[#1a2632] p-4 sm:p-6 active:shadow-md transition-shadow">
                  <div className="size-10 sm:size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[28px]">
                      link
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <h3 className="text-[#111418] dark:text-white text-base sm:text-lg font-bold leading-tight">
                      Share via Unique Link
                    </h3>
                    <p className="text-[#617589] dark:text-[#9ca3af] text-xs sm:text-sm font-normal leading-normal">
                      Generate a secure URL for your data. Only people with the
                      link can access it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#f0f2f4] dark:border-[#2a3441] py-6 sm:py-8 mt-auto bg-white dark:bg-[#111a22]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[#617589] dark:text-[#9ca3af] text-xs sm:text-sm">
            © 2024 Shared Clipboard. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              className="text-[#617589] dark:text-[#9ca3af] active:text-primary text-xs sm:text-sm font-medium transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-[#617589] dark:text-[#9ca3af] active:text-primary text-xs sm:text-sm font-medium transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
