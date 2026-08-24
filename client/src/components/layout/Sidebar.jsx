import {
    NavLink,
} from "react-router-dom";
import "../../App.css";

import {
    FiGrid,
    FiPackage,
    FiPlusCircle,
    FiMap,
    FiUsers,
    FiMapPin,
    FiDollarSign,
    FiSettings,
    FiHelpCircle,
    FiLogOut,
    FiTruck,
} from "react-icons/fi";

const customerNavigation = [
    {
        section: "MAIN",
        items: [
            {
                label: "Dashboard",
                path: "/customer",
                icon: FiGrid,
            },
            {
                label: "Orders",
                path: "/customer/orders",
                icon: FiPackage,
            },
            {
                label: "Create Order",
                path: "/customer/orders/new",
                icon: FiPlusCircle,
            },
        ],
    },
    {
        section: "ACCOUNT",
        items: [
            {
                label: "Settings",
                path: "/customer/settings",
                icon: FiSettings,
            },
        ],
    },
];

const agentNavigation = [
    {
        section: "OPERATIONS",
        items: [
            {
                label: "Dashboard",
                path: "/agent",
                icon: FiGrid,
            },
            {
                label: "Assigned Orders",
                path: "/agent/orders",
                icon: FiPackage,
            },
        ],
    },
    {
        section: "ACCOUNT",
        items: [
            {
                label: "Settings",
                path: "/agent/settings",
                icon: FiSettings,
            },
        ],
    },
];

const adminNavigation = [
    {
        section: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/admin",
                icon: FiGrid,
            },
            {
                label: "Orders",
                path: "/admin/orders",
                icon: FiPackage,
            },
            {
                label: "Agents",
                path: "/admin/agents",
                icon: FiUsers,
            },
        ],
    },
    {
        section: "CONFIGURATION",
        items: [
            {
                label: "Zones",
                path: "/admin/zones",
                icon: FiMapPin,
            },
            {
                label: "Areas",
                path: "/admin/areas",
                icon: FiMap,
            },
            {
                label: "Rate Cards",
                path: "/admin/rate-cards",
                icon: FiDollarSign,
            },
        ],
    },
    {
        section: "ACCOUNT",
        items: [
            {
                label: "Settings",
                path: "/admin/settings",
                icon: FiSettings,
            },
        ],
    },
];

const getNavigation = (
    role
) => {
    switch (role) {
        case "ADMIN":
            return adminNavigation;

        case "DELIVERY_AGENT":
            return agentNavigation;

        case "CUSTOMER":
        default:
            return customerNavigation;
    }
};

const Sidebar = ({
    role,
    onLogout,
    mobileOpen,
    onClose,
}) => {
    const navigation =
        getNavigation(role);

    return (
        <>
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}

            <aside
                className={`sidebar ${mobileOpen
                    ? "sidebar-mobile-open"
                    : ""
                    }`}
            >
                <div className="sidebar-brand">
                    <div className="brand-mark">
                        <FiTruck />
                    </div>

                    <div>
                        <div className="brand-name">
                            LastMile
                        </div>

                        <div className="brand-subtitle">
                            Logistics Platform
                        </div>
                    </div>

                    <button
                        className="mobile-sidebar-close"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        ×
                    </button>
                </div>

                <nav className="sidebar-navigation">
                    {navigation.map(
                        (group) => (
                            <div
                                className="nav-group"
                                key={
                                    group.section
                                }
                            >
                                <div className="nav-section-label">
                                    {
                                        group.section
                                    }
                                </div>

                                {group.items.map(
                                    (item) => {
                                        const Icon =
                                            item.icon;

                                        return (
                                            <NavLink
                                                key={
                                                    item.path
                                                }
                                                to={
                                                    item.path
                                                }
                                                end={
                                                    item.path ===
                                                    "/customer" ||
                                                    item.path ===
                                                    "/agent" ||
                                                    item.path ===
                                                    "/admin"
                                                }
                                                onClick={
                                                    onClose
                                                }
                                                className={({
                                                    isActive,
                                                }) =>
                                                    `sidebar-link ${isActive
                                                        ? "sidebar-link-active"
                                                        : ""
                                                    }`
                                                }
                                            >
                                                <Icon
                                                    size={
                                                        18
                                                    }
                                                />

                                                <span>
                                                    {
                                                        item.label
                                                    }
                                                </span>
                                            </NavLink>
                                        );
                                    }
                                )}
                            </div>
                        )
                    )}
                </nav>

                <div className="sidebar-bottom">
                    <NavLink
                        to="/help"
                        className="sidebar-link"
                        onClick={onClose}
                    >
                        <FiHelpCircle
                            size={18}
                        />

                        <span>
                            Help & Support
                        </span>
                    </NavLink>

                    <button
                        className="sidebar-link sidebar-logout"
                        onClick={
                            onLogout
                        }
                    >
                        <FiLogOut
                            size={18}
                        />

                        <span>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;