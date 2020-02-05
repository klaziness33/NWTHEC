/**
 * App Config File
 */
const AppConfig = {
  // start customize //
  usernameJWT: "nch",
  passwordJWT: "P@ssw0rd.nch",
  grantType: "password",
  serviceUrl: "http://localhost:61347/",
  projectUrl: "http://localhost:3000/",
  bannerLogo: require("Assets/img/shell 01.png"),
  cryptoKey: '1AE58EAD81B3C7C5182809A974BCF24D1C0FB69FB4A0D364939C8FA6C0C00D09',
  // end customize //

  appLogo: require("Assets/img/site-logo1.png"), // App Logo
  brandName: "NWTH E-Commerce", // Brand Name
  navCollapsed: false, // Sidebar collapse
  darkMode: false, // Dark Mode
  boxLayout: false, // Box Layout
  rtlLayout: false, // RTL Layout
  miniSidebar: false, // Mini Sidebar
  enableSidebarBackgroundImage: true, // Enable Sidebar Background Image
  sidebarImage: require("Assets/img/sidebar-5.jpg"), // Select sidebar image
  isDarkSidenav: true, // Set true to dark sidebar
  enableThemeOptions: true, // Enable Theme Options
  locale: {
    languageId: "english",
    locale: "en",
    name: "English",
    icon: "en"
  },
  enableUserTour: process.env.NODE_ENV === "production" ? true : false, // Enable / Disable User Tour
  copyRightText: "NaviWorld (Thailand) © 2019", // Copy Right Text
  // light theme colors
  themeColors: {
    primary: "#5D92F4",
    secondary: "#677080",
    success: "#00D014",
    danger: "#FF3739",
    warning: "#FFB70F",
    info: "#00D0BD",
    dark: "#464D69",
    default: "#FAFAFA",
    greyLighten: "#A5A7B2",
    grey: "#677080",
    white: "#FFFFFF",
    purple: "#896BD6",
    yellow: "#D46B08"
  },
  // dark theme colors
  darkThemeColors: {
    darkBgColor: "#424242"
  }
};

export default AppConfig;
