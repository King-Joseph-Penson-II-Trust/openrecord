import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import BlocklistManager from "./components/BlocklistManager"
import RecordList from "./components/RecordList"
import RecordSearch from "./components/RecordSearch"
import ProtectedRoute from "./components/ProtectedRoute"
import 'bootstrap/dist/css/bootstrap.min.css';
import NewRecord from "./pages/NewRecord"
import UploadTemplateForm from "./components/UploadTemplateForm"
import DocumentTemplateList from "./components/DocumentTemplateList"

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
					path="/home"
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
							<NewRecord />
						</ProtectedRoute>
					}
				/>
				<Route path="/" element={<RecordSearch />} />
				<Route path="/uploadtemplate" element={<UploadTemplateForm />} />
				<Route path="/templates" element={<DocumentTemplateList />} />
				<Route
					path="/records"
					element={
						<ProtectedRoute>
							<RecordList />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>

	)

}  

export default App