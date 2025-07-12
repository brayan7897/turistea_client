import Chatbot from "./components/Chatbot";
import Info from "./components/Info";
import GeneralState from "./contex/generalState";
import MapState from "./contex/mapState";

function App() {
	return (
		<GeneralState>
			<MapState>
				<div className="h-screen w-[100%] flex bg-coloro1 max-[1000px]:flex-col max-[1000px]:items-center">
					<Info></Info>
					<Chatbot></Chatbot>
				</div>
			</MapState>
		</GeneralState>
	);
}

export default App;
