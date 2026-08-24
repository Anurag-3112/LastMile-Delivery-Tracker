import {
    useState,
} from "react";

import {
    Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({
    user,
    role,
    onLogout,
}) => {
    const [
        mobileSidebarOpen,
        setMobileSidebarOpen,
    ] = useState(false);

    return (
        <div className="app">
            <Sidebar
                role={role}
                onLogout={
                    onLogout
                }
                mobileOpen={
                    mobileSidebarOpen
                }
                onClose={() =>
                    setMobileSidebarOpen(
                        false
                    )
                }
            />

            <div className="app-main">
                <Topbar
                    user={user}
                    role={role}
                    onMenuClick={() =>
                        setMobileSidebarOpen(
                            true
                        )
                    }
                />

                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;