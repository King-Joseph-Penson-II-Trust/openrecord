import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import BlocklistManager from "./components/BlocklistManager"
import RecordCreation from "./components/RecordCreation"
import RecordList from "./components/RecordList"
import RecordSearch from "./components/RecordSearch"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
	localStorage.clear()
	return <Navigate to="/login" />
}

function RegisterAndLogout() {
	localStorage.clear()
	return <Register />
}
  

function App() {
	return (

		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				
				<Route path="/login" element={<Login />}/>
        		<Route path="/logout" element={<Logout />}/>
				<Route path="/register" element={<RegisterAndLogout />}/>
				<Route path="/blocklist" element={<BlocklistManager />} />
				<Route path="*" element={<NotFound />}></Route>
				<Route
					path="/create"
					element={
						<ProtectedRoute>
							<RecordCreation />
						</ProtectedRoute>
					}
				/>
				
			</Routes>
		</BrowserRouter>

	)

}  

export default App