import type ThemeConfig from "~/types/theme";
import themeConfig from "~/assets/theme.json";

export default function useTheme() {
  return {
    colors: themeConfig.colors,

    getColor: (colorKey: string): string => themeConfig.colors[colorKey] || "",
    getPrimaryColor: (): string => themeConfig.colors.primary,
    getThemeColor: (): string => themeConfig.colors.primary,

    getCSSVar: (colorKey: string): string => `var(--color-${colorKey})`,

    config: themeConfig as ThemeConfig,
  };
}
