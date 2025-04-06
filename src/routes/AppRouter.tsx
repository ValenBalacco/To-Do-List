import { Route, Routes } from "react-router";
import { BacklogScreen } from "../Components/Screens/BacklogScreen/BacklogScreen";
import { SprintScreen } from "../Components/Screens/SprintScreen/SprintScreen";
import { Header } from "../Components/ui/Header/Header";

export const AppRouter = () => {
	return (
		<div className="bg-light min-vh-100">
			<Header />
			
				<Routes>
					<Route
						path="/"
						element={<BacklogScreen />}
					/>
					<Route
						path="/sprint"
						element={<SprintScreen />}
					/>
				</Routes>
			
		</div>
	);
};
