import { Backlog } from "./components/screens/backlog/backlog";
import styles from "./App.module.css";
import { useState } from "react";

function App() {
  const [backlogOpen, setOpenBacklog] = useState(false)

  return (
    <div className={styles.containerApp}>
      <button onClick={() => setOpenBacklog(!backlogOpen)}>
        {backlogOpen ? "Close Backlog" : "Open Backlog"}
      </button>
      {backlogOpen && <Backlog />}
    </div>
  );
}

export default App;