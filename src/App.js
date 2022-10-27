
import Chatbot from "./components/Chatbot"
import Info from "./components/Info"
import GeneralState from "./contex/generalState";

function App() {
  return (
    <GeneralState>
    <div className="h-screen flex">
      <Info></Info>
      <Chatbot></Chatbot>
    </div>
    </GeneralState>
  );
}

export default App;
