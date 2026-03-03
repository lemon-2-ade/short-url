"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(`${process.env.NEXT_PUBLIC_API_URL}/${data.id}`);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const reset = () => {
    setUrl("");
    setShortUrl("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              URL Shortener
            </h1>
            <p className="text-lg text-gray-600">
              Make your long URLs short and shareable
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            {!shortUrl ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Enter URL to shorten
                  </label>
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your-long-url-here"
                    className="w-full text-gray-700 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !url}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Shortening...
                    </span>
                  ) : (
                    "Shorten URL"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    URL shortened successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Here is your shortened URL:
                  </p>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-green-800 font-mono text-sm break-all">
                        {shortUrl}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    Shorten Another
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition-colors"
                  >
                    Visit Link
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Rate limited to 20 URLs per day per IP address</p>
          </div>
        </div>
      </div>
    </div>
  );
}
