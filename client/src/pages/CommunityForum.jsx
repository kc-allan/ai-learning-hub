import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Trash2,
  RefreshCw,
  PlusCircle,
  ChevronDown,
  Send,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  Input,
  TextField,
  Alert,
  DialogTitle,
  DialogActions,
  DialogContent,
  Dialog,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import Header from "../../components/header";

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [currentForum, setCurrentForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [newReply, setNewReply] = useState({ content: "" });
  const [openThreads, setOpenThreads] = useState({});
  const [isNewThreadOpen, setIsNewThreadOpen] = useState(false);
  const token = useSelector((state) => state.token);

  const handleOpen = () => setIsNewThreadOpen(true);
  const handleClose = () => setIsNewThreadOpen(false);

  useEffect(() => {
    fetchForums();
  }, []);

  useEffect(() => {
    if (currentForum) {
      fetchThreads(currentForum.id);
    }
  }, [currentForum]);

  // Add new useEffect to fetch replies for all threads when they're loaded
  useEffect(() => {
    if (threads.length > 0) {
      threads.forEach(thread => {
        fetchReplies(thread.id);
      });
    }
  }, [threads]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/community/forums/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setForums(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load forums");
      setLoading(false);
    }
  };

  const fetchThreads = async (forumId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/community/forums/${forumId}/threads/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setThreads(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load threads");
      setLoading(false);
    }
  };

  const fetchReplies = async (threadId) => {
    try {
      const response = await fetch(
        `/api/v1/community/forums/threads/${threadId}/replies/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setReplies(prev => ({ ...prev, [threadId]: data }));
      // Don't automatically set openThreads here
    } catch (err) {
      setError("Failed to load replies");
    }
  };

  const toggleThread = (threadId) => {
    setOpenThreads(prev => ({
      ...prev,
      [threadId]: !prev[threadId]
    }));
  };

  const createThread = async () => {
    try {
      const response = await fetch(
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
      if (!response.ok) throw new Error("Failed to create thread");
      fetchThreads(currentForum.id);
      setNewThread({ title: "", content: "" });
      setIsNewThreadOpen(false);
    } catch (err) {
      setError("Failed to create thread");
    }
  };

  const createReply = async (threadId) => {
    if (!newReply.content.trim()) return;
    try {
      const response = await fetch(
        `/api/v1/community/forums/threads/${threadId}/replies/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newReply),
        }
      );
      if (!response.ok) throw new Error("Failed to create reply");
      await fetchReplies(threadId);
      setNewReply({ content: "" });
    } catch (err) {
      setError("Failed to create reply");
    }
  };

  const deleteReply = async (replyId, threadId) => {
    try {
      await fetch(`/api/v1/community/threads/replies/${replyId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });
      await fetchReplies(threadId);
    } catch (err) {
      setError("Failed to delete reply");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <Typography>{error}</Typography>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="space-y-1">
                <Typography className="flex justify-between items-center">
                  Forums
                  <Button
                    variant="ghost"
                    size="icon"
                    className={loading ? "animate-spin" : ""}
                    onClick={fetchForums}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </Typography>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {forums.map((forum) => (
                    <Button
                      key={forum.id}
                      variant={
                        currentForum?.id === forum.id ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setCurrentForum(forum)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {forum.title}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3 space-y-6">
            {currentForum && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{currentForum.title}</h2>
                  <div id="dialog-trigger">
                    <Button variant="contained" onClick={handleOpen}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Thread
                    </Button>
                  </div>
                  <Dialog
                    open={isNewThreadOpen}
                    onOpenChange={setIsNewThreadOpen}
                  >
                    <DialogContent>
                      <Typography>
                        <DialogTitle>Create New Thread</DialogTitle>
                        <Typography>
                          Start a new discussion in {currentForum.title}
                        </Typography>
                      </Typography>
                      <div className="space-y-4 py-4">
                        <Input
                          placeholder="Thread Title"
                          value={newThread.title}
                          onChange={(e) =>
                            setNewThread({
                              ...newThread,
                              title: e.target.value,
                            })
                          }
                        />
                        <TextField
                          placeholder="Thread Content"
                          value={newThread.content}
                          onChange={(e) =>
                            setNewThread({
                              ...newThread,
                              content: e.target.value,
                            })
                          }
                          rows={5}
                        />
                      </div>
                      <DialogActions>
                        <Button
                          variant="outline"
                          onClick={() => setIsNewThreadOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={createThread}
                          disabled={!newThread.title || !newThread.content}
                        >
                          Create Thread
                        </Button>
                      </DialogActions>
                    </DialogContent>
                  </Dialog>
                </div>

                {threads.map((thread) => (
                  <Card key={thread.id}>
                    <CardHeader>
                      <Typography>{thread.title}</Typography>
                      <p className="text-sm text-muted-foreground">
                        Posted {formatDate(thread.created_at)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{thread.content}</p>
                    </CardContent>
                    <CardActions className="flex flex-col items-stretch">
                      <Accordion
                        open={openThreads[thread.id]}
                        onOpenChange={() => toggleThread(thread.id)}
                      >
                        <AccordionSummary id="collapsible-trigger">
                          <Button
                            variant="ghost"
                            className="w-full justify-between"
                          >
                            {replies[thread.id]?.length || 0} Replies
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                openThreads[thread.id]
                                  ? "transform rotate-180"
                                  : ""
                              }`}
                            />
                          </Button>
                        </AccordionSummary>
                        <AccordionDetails className="space-y-4 pt-4">
                          {replies[thread.id]?.map((reply) => (
                            <div
                              key={reply.id}
                              className="bg-muted p-4 rounded-lg"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">
                                    {reply.written_by}
                                  </p>
                                  <p>{reply.content}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(reply.created_at)}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    deleteReply(reply.id, thread.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Write a reply..."
                              value={newReply.content}
                              onChange={(e) =>
                                setNewReply({ content: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  createReply(thread.id);
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              onClick={() => createReply(thread.id)}
                              disabled={!newReply.content.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </CardActions>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForumPage;