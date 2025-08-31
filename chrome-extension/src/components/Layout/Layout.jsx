import { Link, Outlet, useLocation } from "react-router";
import { BackIcon, SettingsIcon } from "@/icons";
import commonStyles from "@/commonStyles.module.css";
import styles from "./layoutStyles.module.css";
import logo from "/logo.png";

export function Layout() {
  const { pathname } = useLocation();
  const shouldShowBackButton = pathname !== "/";

  const getTitle = () => {
    switch (pathname) {
      case "/":
        return "Home";
      case "/settings":
        return "Settings";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        {shouldShowBackButton ? (
          <Link to="/">
            <BackIcon className={commonStyles.icon} />
          </Link>
        ) : (
          <img src={logo} alt="Logo" width={24} height={24} />
        )}
        <div className={styles.title}>{getTitle()}</div>
        <Link to="/settings">
          <SettingsIcon className={commonStyles.icon} />
        </Link>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
