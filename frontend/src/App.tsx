import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Text,
  Flex,
  Card,
  Button,
  Badge,
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
    const onVote = (data: any) => setItems(data.shows);
    socket.on("vote", onVote);
    return () => {
      socket.off("vote", onVote);
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

  const totalVotes = items.reduce((sum, item) => sum + item.votes, 0);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container size="1">
        <Flex direction="column" gap="2" align="center" mb="5">
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
