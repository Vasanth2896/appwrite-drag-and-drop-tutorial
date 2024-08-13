import NotesProvider from "./context/NoteContext";
import NotesPage from "./pages/NotesPage";

function App() {
  return (
    <div id="App">
      <NotesProvider>
        <NotesPage />
      </NotesProvider>
    </div>
  );
}

export default App;
