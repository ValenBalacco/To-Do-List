import { Navigate, Route, Routes } from "react-router-dom";
import { BacklogScreen } from "../components/screens/BacklogScreen";
import { SprintScreen } from "../components/screens/SprintScreen";
import { Header } from "../components/ui/Header";

export const AppRouter = () => {
	return (
		<div
			className="d-flex flex-column bg-light"
			style={{ height: "100vh" }}
		>
			<Header />

			<Routes>
				<Route
					path="/"
					element={<Navigate to="Backlog" />}
				/>
				<Route
					path="*"
					element={<Navigate to="Backlog" />}
				/>
				<Route
					path="/Backlog"
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
