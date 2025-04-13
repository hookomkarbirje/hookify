
import { PlayerProvider } from "@/context/PlayerContext";
import Player from "@/components/Player";
import { useEffect } from "react";

const Index = () => {
  // Make sure React is properly initialized before rendering dialogs
  useEffect(() => {
    // This forces React to initialize properly
    document.body.className = document.body.className;
  }, []);

  return (
    <PlayerProvider>
      <Player />
    </PlayerProvider>
  );
};

export default Index;
