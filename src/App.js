import { Route, Routes } from "react-router-dom"
import "./App.css"
import { Authorized } from "./components/views/Authorized"
import { Login } from "./components/auth/Login"
import { Register } from "./components/auth/Register"
import { ApplicationViews } from "./components/views/ApplicationViews"
import { NavBar } from "./components/nav/NavBar"


export const App = () => {
	return <Routes>
		<Route path="/login" element={<Login />} />
		<Route path="/register" element={<Register />} />

		<Route path="*" element={
			<Authorized>
				<>
					<NavBar />
					<ApplicationViews />
				</>
			</Authorized>

		} />
	</Routes>
}

