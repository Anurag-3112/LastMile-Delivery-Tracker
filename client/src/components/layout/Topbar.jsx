import {
    FiMenu,
    FiSearch,
    FiBell,
    FiChevronDown,
} from "react-icons/fi";

const getRoleLabel = (
    role
) => {
    switch (role) {
        case "ADMIN":
            return "Administrator";

        case "DELIVERY_AGENT":
            return "Delivery Agent";

        case "CUSTOMER":
        default:
            return "Customer";
    }
};

const Topbar = ({
    user,
    role,
    onMenuClick,
}) => {
    const name =
        user?.name ||
        user?.fullName ||
        "User";

    const initials =
        name
            .split(" ")
            .map(
                (part) =>
                    part[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button
                    className="mobile-menu-button"
                    onClick={
                        onMenuClick
                    }
                    aria-label="Open navigation"
                >
                    <FiMenu
                        size={20}
                    />
                </button>

                <div className="topbar-search">
                    <FiSearch
                        size={17}
                    />

                    <input
                        type="search"
                        placeholder="Search shipments..."
                    />
                </div>
            </div>

            <div className="topbar-right">
                <button
                    className="notification-button"
                    aria-label="Notifications"
                >
                    <FiBell
                        size={19}
                    />

                    <span className="notification-dot" />
                </button>

                <div className="topbar-divider" />

                <button className="user-menu">
                    <div className="user-avatar">
                        {initials}
                    </div>

                    <div className="user-info">
                        <span className="user-name">
                            {name}
                        </span>

                        <span className="user-role">
                            {getRoleLabel(
                                role
                            )}
                        </span>
                    </div>

                    <FiChevronDown
                        size={16}
                        className="user-chevron"
                    />
                </button>
            </div>
        </header>
    );
};

export default Topbar;