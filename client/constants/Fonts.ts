import { Colors } from "./Colors";

export const Fonts = {
  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold' as const,
    color: Colors.light.text,
  },
  darkWidgetText: {
    fontSize: 35,
    fontWeight: 'bold' as const,
    color: Colors.light.icon,
  },
  lightWidgetText: {
    fontSize: 30,
    fontWeight: 'bold' as const,
    color: Colors.light.icon,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: 'bold' as const,
    marginLeft: 20,
    marginBottom: 15,
  },
  mutedText: {
    color: "grey" as const,
    fontWeight: '500' as const,
  }
};