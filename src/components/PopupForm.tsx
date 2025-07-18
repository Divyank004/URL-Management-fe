import { useState, useEffect, useRef } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { PopupFormProps } from "../types";

const PopupForm = ({ showPopup, onNewEntry, onClosePopup }: PopupFormProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [newUrl, setNewUrl] = useState<string>("");
  const [urlError, setUrlError] = useState<string | undefined>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
      if (event.key === "Enter") {
        handleSubmitUrl();
      }
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPopup &&
        popupRef.current &&
        event.target instanceof Node &&
        !popupRef.current.contains(event.target)
      ) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const closePopup = () => {
    onClosePopup();
    setNewUrl("");
    setUrlError("");
    setIsValidating(false);
  };

  const handleSubmitUrl = async () => {
    if (!newUrl.trim()) {
      setUrlError("URL is required");
      return;
    }

    setIsValidating(true);
    setUrlError("");

    try {
      const validation = validateUrl(newUrl.trim());

      if (!validation.isValid) {
        setUrlError(validation.error);
        setIsValidating(false);
        return;
      }

      const newEntry = {
        url: validation.url,
        status: "Queued",
      };

      // add to table rows
      onNewEntry(newEntry);
      closePopup();
      console.log("URL added successfully:", validation.url);
    } catch (error) {
      setUrlError("Failed to add URL. Please try again.");
      console.error("Error adding URL:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const validateUrl = (url: string) => {
    try {
      const newUrl = new URL(url);
      if (newUrl.protocol === "http:" || newUrl.protocol === "https:") {
        return { isValid: true, url };
      }
      return { isValid: false, error: "Invalid URL format" };
    } catch (err) {
      console.log("Error", err);
      return { isValid: false, error: "Invalid URL format" };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="shadow-xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl max-w-md w-full border border-white/20 "
        ref={popupRef}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white">Add New URL</h3>
          <button
            onClick={closePopup}
            className="text-gray-400 hover:text-white"
            disabled={isValidating}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL
            </label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setUrlError("");
              }}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                urlError ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isValidating}
            />
            {urlError && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {urlError}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={closePopup}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
              disabled={isValidating}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitUrl}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                "Add URL"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
