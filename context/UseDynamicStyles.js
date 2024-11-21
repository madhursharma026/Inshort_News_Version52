import { useTheme } from "./ThemeContext";

const UseDynamicStyles = () => {
  const { isDarkMode } = useTheme();

  // Define color values for both themes
  const textColors = {
    light: "#000000",
    dark: "#FFFFFF",
  };

  const backgroundColors = {
    light: "#f1f1f1",
    dark: "#282C35",
  };

  const footerColors = {
    light: {
      text: "#FFFFFF",
      background: "#282C35",
    },
    dark: {
      text: "#000000",
      background: "#f1f1f1",
    },
  };

  const topQuarterCircleColor = isDarkMode
    ? "rgb(100 116 139)"
    : "rgb(243 232 255)";

  return {
    textColor: { color: isDarkMode ? textColors.dark : textColors.light },
    backgroundColor: {
      backgroundColor: isDarkMode
        ? backgroundColors.dark
        : backgroundColors.light,
    },
    footerTextColor: {
      color: footerColors[isDarkMode ? "dark" : "light"].text,
    },
    footerBackgroundColor: {
      backgroundColor: footerColors[isDarkMode ? "dark" : "light"].background,
    },
    topQuaterCircle: { backgroundColor: topQuarterCircleColor },
  };
};

export default UseDynamicStyles;
