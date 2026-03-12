import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  Button,
  Badge,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { socket } from "./socket";
import config from "./config";
const apiClient = axios.create({
  baseURL: config.BACKEND_URL,
  headers: { "X-Api-Key": config.API_KEY },
});

interface VoteItem {
  id: number;
  name: string;
  votes: number;
}

function App() {
  const [items, setItems] = useState<VoteItem[]>([]);
  const [connected, setConnected] = useState(false);
  const [newShowName, setNewShowName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const setTheme = (window as any).setTheme;
    if (setTheme) {
      setTheme(newMode ? "dark" : "light");
    }
  };

  // socket setup
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    setConnected(socket.connected);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // listen for updates from backend
  useEffect(() => {
    const updateShows = (data: any) => setItems(data.shows);
    socket.on("vote", updateShows);
    socket.on("new-show", updateShows);
    return () => {
      socket.off("vote", updateShows);
      socket.off("new-show", updateShows);
    };
  }, []);

  // get initial data from backend
  useEffect(() => {
    apiClient.get("/api/shows").then((res) => setItems(res.data));
  }, []);

  const handleVote = (id: number) => {
    apiClient.post("/api/vote", { id }).catch((err) => {
      console.error("Failed to cast vote:", err);
    });
  };

  const handleAddShow = () => {
    const name = newShowName.trim();
    if (!name) {
      return;
    }

    apiClient
      .post("/api/shows", { name })
      .then(() => setNewShowName(""))
      .catch((err) => {
        console.error("Failed to add show:", err);
      });
  };

  const totalVotes = items.reduce((sum, item) => sum + item.votes, 0);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container size="1">
        <Flex direction="column" gap="2" align="center" mb="5">
          <Flex width="100%" justify="between" align="center" mb="3">
            <div />
            <Button
              variant="soft"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </Button>
          </Flex>
          <Heading size="5" align="center">
            Vote your favourite TV Show
          </Heading>
          <Text size="2" color={connected ? "green" : "red"}>
            {connected ? "Connected" : "Disconnected"}
          </Text>
          <Text size="2" color="gray">
            {totalVotes > 0
              ? `${totalVotes} vote${totalVotes !== 1 ? "s" : ""} cast`
              : "No votes yet"}
          </Text>
        </Flex>

        <Flex gap="2" mb="5" width="100%" align="center">
          <TextField.Root
            type="text"
            placeholder="Enter show name..."
            value={newShowName}
            onChange={(event) => setNewShowName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleAddShow();
              }
            }}
            className="h-10 flex-1"
          />
          <Button className="h-10 px-4" onClick={handleAddShow}>
            Add Show
          </Button>
        </Flex>

        <Flex direction="column" gap="3">
          {items.map((item) => (
            <Card key={item.id} variant="surface">
              <Flex align="center" justify="between" gap="4">
                <Flex direction="column" gap="1">
                  <Text weight="medium">{item.name}</Text>
                  {item.votes > 0 && (
                    <Badge variant="soft" color="gray" size="1">
                      {item.votes} vote{item.votes !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </Flex>
                <Button variant="outline" onClick={() => handleVote(item.id)}>
                  Vote
                </Button>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Container>
    </div>
  );
}

export default App;
