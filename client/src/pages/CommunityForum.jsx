import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  MessageSquare,
  RefreshCw,
  PlusCircle,
  Newspaper,
  Send,
  MessageCircle,
  Lock,
} from "lucide-react";
import {
  Card,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Collapse,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import PaymentPlanModal from "../../components/paymentPlanModal";

import { timeElapsed } from "../../utils";
import { setLogout } from "../state";

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [currentForum, setCurrentForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [error, setError] = useState(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [replies, setReplies] = useState({});
  const [newReplies, setNewReplies] = useState({});
  const [expandedThreads, setExpandedThreads] = useState({});
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileTab, setMobileTab] = useState(0);
  const isPremium = useSelector((state) => state.user?.is_premium);

  useEffect(() => {
    fetchForums();
    fetchNewsArticles();
  }, []);

  useEffect(() => {
    if (currentForum) fetchThreads(currentForum.id);
  }, [currentForum]);

  const fetchForums = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/api/v1/community/forums/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 401) {
        return dispatch(setLogout());
      }
      const data = await response.json();
      setForums(data);
      if (!currentForum && data.length > 0) setCurrentForum(data[0]);
    } catch (err) {
      setError("Failed to load forums.");
    }
  };

  const fetchThreads = async (forumId) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          `/api/v1/community/forums/${forumId}/threads/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 401) return dispatch(setLogout());
      const data = await response.json();

      // Fetch replies for each thread
      const threadsWithReplies = await Promise.all(
        data.map(async (thread) => {
          const repliesResponse = await fetch(
            import.meta.env.VITE_API_URL +
              `/api/v1/community/forums/threads/${thread.id}/replies/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (repliesResponse.status === 401) return dispatch(setLogout());
          const threadReplies = await repliesResponse.json();
          return { ...thread, replies: threadReplies };
        })
      );

      setThreads(threadsWithReplies);
    } catch (err) {
      setError("Failed to load threads.");
    }
  };

  const fetchNewsArticles = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/api/v1/community/news/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 401) return dispatch(setLogout());
      const data = await response.json();
      setNewsArticles(data);
    } catch (err) {
      setError("Failed to load news articles.");
    }
  };

  const postReply = async (threadId) => {
    if (!newReplies[threadId]?.trim()) return;
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          `/api/v1/community/forums/threads/${threadId}/replies/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newReplies[threadId] }),
        }
      );
      if (response.status === 401) return dispatch(setLogout());

      if (!response.ok) throw new Error("Failed to post reply.");

      // Fetch updated replies after posting
      const repliesResponse = await fetch(
        import.meta.env.VITE_API_URL +
          `/api/v1/community/forums/threads/${threadId}/replies/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedReplies = await repliesResponse.json();
      if (updatedReplies.status === 401) return dispatch(setLogout());

      // Update the thread's replies
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === threadId
            ? { ...thread, replies: updatedReplies }
            : thread
        )
      );

      // Clear the new reply input
      setNewReplies((prevReplies) => ({ ...prevReplies, [threadId]: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  {
    isCreatingThread && createThread();
  }
  const createThread = async () => {
    if (!newThread.title.trim() || !newThread.content.trim()) return;
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          `/api/v1/community/forums/${currentForum.id}/threads/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newThread),
        }
      );
      if (response.status === 401) return dispatch(setLogout());
      if (!response.ok) throw new Error("Failed to create thread.");
      setNewThread({ title: "", content: "" });
      setIsCreatingThread(false);
      fetchThreads(currentForum.id);
    } catch (err) {
      setError("Failed to create thread.");
    }
  };

  const toggleThreadReplies = (threadId) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [threadId]: !prev[threadId],
    }));
  };

  const handleMobileTabChange = (event, newValue) => {
    setMobileTab(newValue);
  };

  const CreateThreadDialog = () => (
    <Dialog
      open={isCreatingThread}
      onClose={() => setIsCreatingThread(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Thread in {currentForum?.title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Thread Title"
          fullWidth
          variant="outlined"
          value={newThread.title}
          onChange={(e) =>
            setNewThread((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          error={!newThread.title.trim()}
          helperText={!newThread.title.trim() ? "Title is required" : ""}
        />
        <TextField
          margin="dense"
          label="Thread Content"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newThread.content}
          onChange={(e) =>
            setNewThread((prev) => ({ ...prev, content: e.target.value }))
          }
          required
          error={!newThread.content.trim()}
          helperText={!newThread.content.trim() ? "Content is required" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreatingThread(false)} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={createThread}
          color="primary"
          variant="contained"
          disabled={!newThread.title.trim() || !newThread.content.trim()}
        >
          Create Thread
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            width: "100%",
            marginBottom: 2,
          }}
        >
          <Tabs
            value={mobileTab}
            onChange={handleMobileTabChange}
            variant="fullWidth"
            centered
          >
            <Tab icon={<MessageSquare />} label="Forums" />
            <Tab icon={<Newspaper />} label="News" />
          </Tabs>
        </Box>

        {isPremium && isCreatingThread && <CreateThreadDialog />}

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div
            className={`space-y-4 lg:col-span-1 overflow-y-auto max-h-screen ${
              mobileTab === 0 || "hidden lg:block"
            }`}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">Forums</Typography>
                <Button variant="text" onClick={fetchForums}>
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-2">
                {forums.map((forum) => (
                  <Button
                    key={forum.id}
                    fullWidth
                    variant={
                      forum.id === currentForum?.id ? "contained" : "default"
                    }
                    onClick={() => setCurrentForum(forum)}
                  >
                    {forum.title}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          <div
            className={`lg:col-span-3 space-y-4 lg:overflow-y-auto lg:h-screen ${
              mobileTab === 0 || "hidden lg:block"
            }`}
          >
            {currentForum && (
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h5">
                    {currentForum.title} Threads
                  </Typography>
                  {isPremium ? (
                    <Button
                      variant="default"
                      onClick={() => setIsCreatingThread(true)}
                      className="bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
                    >
                      <PlusCircle className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">New Thread</span>
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                      <Lock className="h-5 w-5 text-yellow-600" />
                      <Typography className="text-sm text-yellow-700">
                        Upgrade to Premium to Create Threads
                      </Typography>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {threads.length === 0 ? (
                    <Typography className="text-center text-gray-500 italic">
                      No threads yet.{" "}
                      {isPremium
                        ? "Be the first to post!"
                        : "Premium users can start a thread."}
                    </Typography>
                  ) : (
                    threads.map((thread) => (
                      <Card
                        key={thread.id}
                        className="p-4 hover:shadow-md space-y-4"
                      >
                        <div className="bg-gray-100 p-2 pb-4 rounded-sm">
                          <Typography
                            variant="subtitle1"
                            className="flex items-center gap-2"
                          >
                            <h1 className="font-bold text-black">
                              {thread.title}
                            </h1>
                            <span className="text-xs text-gray-500">
                              {timeElapsed(thread.created_at)}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{ marginTop: "8px" }}
                          >
                            {thread.content}
                          </Typography>
                        </div>

                        <div>
                          <Button
                            variant="text"
                            startIcon={<MessageCircle />}
                            onClick={() => toggleThreadReplies(thread.id)}
                          >
                            {thread.replies?.length || 0} Replies
                          </Button>

                          <Collapse in={expandedThreads[thread.id]}>
                            <div className="space-y-2 bg-gray-100 p-3 rounded-lg max-h-[500px] overflow-y-auto">
                              {thread.replies?.length === 0 ? (
                                <Typography
                                  variant="body2"
                                  className="text-gray-500 text-center italic"
                                >
                                  No replies yet
                                </Typography>
                              ) : (
                                thread.replies?.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="bg-white p-2 rounded-md shadow-sm"
                                  >
                                    <Typography
                                      variant="body2"
                                      className="text-gray-800"
                                    >
                                      <span className="font-bold">
                                        {reply.written_by}
                                      </span>
                                      <span>
                                        {reply?.written_by ===
                                          currentUser.username && "(You)"}
                                      </span>
                                      : {reply.content}
                                    </Typography>
                                    <span className="text-xs text-gray-500">
                                      {format(
                                        new Date(reply.created_at),
                                        "dd MMM yyyy • HH:mm"
                                      )}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                            {isPremium ? (
                              <div className="flex items-center gap-2 mt-4">
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Write a reply..."
                                  value={newReplies[thread.id] || ""}
                                  onChange={(e) =>
                                    setNewReplies((prev) => ({
                                      ...prev,
                                      [thread.id]: e.target.value,
                                    }))
                                  }
                                />
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => postReply(thread.id)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white"
                                  startIcon={<Send />}
                                >
                                  Send
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-md p-2 mt-4">
                                <Lock className="h-5 w-5 text-yellow-600" />
                                <Typography className="text-sm text-yellow-700">
                                  Upgrade to Premium to Reply
                                </Typography>
                              </div>
                            )}
                          </Collapse>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>

          <div
            className={`
              lg:col-span-2 
              space-y-4 
              lg:overflow-y-auto 
              lg:h-screen 
              ${mobileTab === 1 || "hidden lg:block"}
            `}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">Latest News</Typography>
                <Button variant="text" onClick={fetchNewsArticles}>
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                {newsArticles.map((article) => (
                  <Card key={article.id} className="p-4 hover:shadow-md">
                    <Typography variant="subtitle2">
                      <h1 className="font-bold">{article.title}</h1>
                      <span className="text-xs text-gray-500">
                        {format(
                          new Date(article.published_at),
                          "dd MMM yyyy • HH:mm"
                        )}
                      </span>
                    </Typography>
                    <img
                      src={article.image_url}
                      className="object-contain my-4"
                    />
                    <Typography variant="body2">
                      <h2 className="text-gray-600 mt-4">
                        {article.description}
                      </h2>
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => window.open(article.url, "_blank")}
                    >
                      Read More
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForumPage;
