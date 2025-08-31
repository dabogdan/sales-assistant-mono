// /*global chrome*/

import { Link, Outlet, useLocation } from "react-router";
import { BackIcon, SettingsIcon } from "@/icons";
import commonStyles from "@/commonStyles.module.css";
import styles from "./layoutStyles.module.css";
import logo from "/logo.png";
// import { useEffect } from "react";
// import { useStorage } from "@/hooks";

const getTitle = (pathname) => {
  switch (pathname) {
    case "/":
      return "Home";
    case "/settings":
      return "Settings";
    default:
      return "Unknown";
  }
};

// const getCurrentTabId = async () => {
//   const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
//   return tabs[0].id;
// };

// const sidePanelSetOptions = async ({ tabId, enabled }) => {
//   await chrome.sidePanel.setOptions({ path: "index.html", tabId, enabled });
// };

export function Layout() {
  // const [isSidePanelOpen] = useStorage("isSidePanelOpen");
  // const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const { pathname } = useLocation();
  const shouldShowBackButton = pathname !== "/";

  // useEffect(() => {
  //   chrome.runtime.connect({ name: "sidePanelToggle" });
  // }, []);

  // const handleOpenInSidePanel = async () => {
  //   const currentTab = await getCurrentTabId();
  //   await sidePanelSetOptions({ tabId: currentTab, enabled: true });
  //   await chrome.sidePanel.open({ tabId: currentTab });

  //   window.close();
  // };

  // const handleOpenInPopup = async () => {
  //   const currentTab = await getCurrentTabId();
  //   await sidePanelSetOptions({ tabId: currentTab, enabled: false });
  //   chrome.action.setPopup({ popup: "index.html" });
  //   setIsSidePanelOpen(false);
  //   window.close();
  // };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          {shouldShowBackButton ? (
            <Link to="/">
              <BackIcon className={commonStyles.icon} />
            </Link>
          ) : (
            <img src={logo} alt="Logo" width={36} height={36} />
          )}
          <div className={styles.title}>{getTitle(pathname)}</div>
          <Link to="/settings">
            <SettingsIcon className={commonStyles.icon} />
          </Link>
        </div>
        {/* {!isSidePanelOpen && (
          <div onClick={handleOpenInSidePanel} className={styles.link}>
            Open in side panel
          </div>
        )} */}
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
