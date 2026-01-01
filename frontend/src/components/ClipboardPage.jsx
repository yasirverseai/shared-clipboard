import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { clipboardAPI } from "../services/api";

const ClipboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCardContent, setNewCardContent] = useState("");
  const [userName, setUserName] = useState("");
  const [editingCard, setEditingCard] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch clipboard and cards
  const fetchClipboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const data = await clipboardAPI.getClipboard(id);
      setCards(data.cards || []);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(
          "Clipboard not found. It may have been deleted or the link is invalid.",
        );
      } else {
        setError("Failed to load clipboard. Please check your connection.");
      }
      console.error(err);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Fetch clipboard and cards on mount
  useEffect(() => {
    if (id) {
      fetchClipboard();
    }

    // Get or generate user name
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      const randomName = `User${Math.floor(Math.random() * 1000)}`;
      setUserName(randomName);
      localStorage.setItem("userName", randomName);
    }
  }, [id]);

  // Handle refresh
  const handleRefresh = () => {
    fetchClipboard(true);
  };

  // Create new card
  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newCardContent.trim()) return;

    try {
      const newCard = await clipboardAPI.createCard(
        id,
        newCardContent,
        userName,
      );
      setCards([...cards, newCard]);
      setNewCardContent("");
    } catch (err) {
      console.error("Failed to create card:", err);
      alert("Failed to create card. Please try again.");
    }
  };

  // Handle keyboard shortcut (Ctrl+Enter)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (newCardContent.trim()) {
        handleCreateCard(e);
      }
    }
  };

  // Update card
  const handleUpdateCard = async (cardId) => {
    if (!editContent.trim()) return;

    try {
      const updatedCard = await clipboardAPI.updateCard(cardId, editContent);
      setCards(cards.map((card) => (card.id === cardId ? updatedCard : card)));
      setEditingCard(null);
      setEditContent("");
    } catch (err) {
      console.error("Failed to update card:", err);
      alert("Failed to update card. Please try again.");
    }
  };

  // Show delete confirmation modal
  const confirmDeleteCard = (cardId) => {
    setCardToDelete(cardId);
    setShowDeleteModal(true);
  };

  // Delete card
  const handleDeleteCard = async () => {
    if (!cardToDelete) return;

    try {
      await clipboardAPI.deleteCard(cardToDelete);
      setCards(cards.filter((card) => card.id !== cardToDelete));
      setShowDeleteModal(false);
      setCardToDelete(null);
    } catch (err) {
      console.error("Failed to delete card:", err);
      alert("Failed to delete card. Please try again.");
    }
  };

  // Copy card content
  const handleCopyCard = async (content, cardId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedCardId(cardId);
      setTimeout(() => setCopiedCardId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Copy share link
  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Start editing card
  const startEditingCard = (card) => {
    setEditingCard(card.id);
    setEditContent(card.content);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-spin">
            refresh
          </span>
          <p className="text-gray-600 dark:text-gray-400">
            Loading clipboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1a2632] rounded-xl shadow-lg p-8 text-center">
          <span className="material-symbols-outlined text-red-500 text-5xl mb-4">
            error
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Delete Note
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this note? The content will be
              permanently removed.
            </p>
            <div className="flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCardToDelete(null);
                }}
                className="px-3 py-2 sm:px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCard}
                className="px-3 py-2 sm:px-4 text-sm font-medium text-white bg-red-600 active:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#e5e7eb] dark:border-[#2a3441] bg-white dark:bg-[#1a232e] px-4 py-3 sm:px-6 sm:py-4 lg:px-10 h-14 sm:h-16 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="size-7 sm:size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg active:bg-primary/20 transition-colors"
            >
              <span className="material-symbols-outlined">
                content_paste_go
              </span>
            </Link>
            <h2 className="text-base sm:text-xl font-bold leading-tight tracking-tight">
              Shared Clipboard
            </h2>
            <span className="hidden sm:flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full ml-4">
              <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined text-sm text-gray-500">
                person
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 text-sm font-medium text-gray-600 dark:text-gray-300 active:text-primary dark:active:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                home
              </span>
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1200px] mx-auto p-3 sm:p-6 lg:p-8">
          {/* Share Link Section */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Share this clipboard
            </label>
            <div className="flex items-center gap-0 w-full rounded-lg shadow-sm">
              <div className="bg-white dark:bg-[#1e2936] border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 flex-1 min-w-0">
                <span className="material-symbols-outlined text-gray-400 text-xl">
                  link
                </span>
                <input
                  className="bg-transparent border-none p-0 text-xs sm:text-sm w-full text-gray-700 dark:text-gray-200 focus:ring-0 focus:outline-none truncate font-mono"
                  readOnly
                  type="text"
                  value={window.location.href}
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-primary active:bg-blue-600 text-white font-bold text-xs sm:text-sm px-3 py-2 sm:px-6 sm:py-2.5 rounded-r-lg border border-primary transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg">
                  {copiedLink ? "check" : "content_copy"}
                </span>
                <span className="hidden sm:inline">
                  {copiedLink ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          </div>

          {/* New Card Form */}
          <div className="mb-6 sm:mb-8">
            <form
              onSubmit={handleCreateCard}
              className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4"
            >
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Add a new note
              </label>
              <div className="relative">
                <textarea
                  value={newCardContent}
                  onChange={(e) => setNewCardContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full resize-none rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-[#111a22] border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-0 focus:outline-none px-3 py-2 sm:px-4 sm:py-2.5 pb-12 sm:pb-14 placeholder:text-gray-400 text-sm transition-all min-h-[100px] max-h-[300px] sm:max-h-[400px] overflow-y-auto"
                  placeholder="Type or paste your content here... (Ctrl+Enter to add)"
                  rows="4"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#cbd5e1 transparent",
                  }}
                />
                <button
                  type="submit"
                  disabled={!newCardContent.trim()}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-primary active:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    add
                  </span>
                  <span className="hidden sm:inline">Add Note</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </form>
          </div>

          {/* Cards Grid */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Notes ({cards.length})
              </h3>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1e2936] border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh cards"
              >
                <span
                  className={`material-symbols-outlined text-lg ${refreshing ? "animate-spin" : ""}`}
                >
                  refresh
                </span>
                <span className="hidden sm:inline">
                  {refreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-5xl sm:text-6xl mb-4">
                  note_add
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No notes yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Add your first note using the form above!
                </p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="group bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 active:shadow-md transition-all break-inside-avoid mb-3 sm:mb-4"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <div className="size-7 sm:size-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-xs sm:text-sm">
                            person
                          </span>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {card.user_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(card.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyCard(card.content, card.id)}
                          className="p-1 sm:p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
                          title="Copy content"
                        >
                          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                            {copiedCardId === card.id
                              ? "check"
                              : "content_copy"}
                          </span>
                        </button>
                        <button
                          onClick={() => startEditingCard(card)}
                          className="p-1 sm:p-1.5 rounded-lg active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => confirmDeleteCard(card.id)}
                          className="p-1 sm:p-1.5 rounded-lg active:bg-red-50 dark:active:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-red-500 text-base sm:text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    {editingCard === card.id ? (
                      <div className="space-y-1.5 sm:space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full resize-none rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-[#111a22] border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-0 focus:outline-none px-3 py-2 text-xs sm:text-sm transition-all min-h-[80px] sm:min-h-[100px] max-h-[200px] sm:max-h-[300px] overflow-y-auto"
                          autoFocus
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#cbd5e1 transparent",
                          }}
                        />
                        <div className="flex gap-1.5 sm:gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingCard(null);
                              setEditContent("");
                            }}
                            className="px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateCard(card.id)}
                            className="px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm font-medium text-white bg-primary active:bg-blue-600 rounded-lg transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <p className="text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {card.content}
                        </p>
                        <div className="absolute bottom-0 right-0 opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-600">
                            {card.content.length} chars
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ClipboardPage;
