import { Route, Navigate, Routes } from "react-router-dom";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/login";
import ZohoCallback from "./components/callback";
import axios from "axios";
import { useLocalStorage } from "./hooks/useLocalstorage";
import { useEffect } from "react";
import Portals from "./components/portals";
import Projects from "./components/projects";
import ProjectTasks from "./components/tasks";
import { ToastContainer } from "react-toastify";

function App() {
    const [accessToken] = useLocalStorage("access_token", "");
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
    const [profile, setProfile] = useLocalStorage("profile", {});

    const getProfile = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_API}/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (response.data) {
                setIsLoggedIn(true);
                setProfile(response.data);
            }
        } catch (error) {
            console.log("🚀 ~ file: App.tsx:57 ~ getProfile ~ error", error);
        }
    };

    useEffect(() => {
        if (accessToken) {
            getProfile();
        }
    }, [accessToken]);
    return (
        <div className="bg-white App text-slate-500 dark:text-slate-400 dark:bg-slate-900 min-h-[100vh]">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/callback" element={<ZohoCallback />} />
                <Route path="/projects" element={<Portals />} />
                <Route path="/portals/:portalId/projects/:projectId/tasks" element={<ProjectTasks />} />
                <Route path=":portalId/projects" element={<Projects />} />
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
