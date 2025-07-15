import { BoardProvider } from "./context/BoardContext";
import { Board } from "./components/Board";

function App() {
  return (
    <div className="w-full">
      <BoardProvider>
        <Board />
      </BoardProvider>
    </div>
  );
}

export default App;
