import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import AppText from "../../../components/AppText";
import RecentActivity from "../../../components/RecentActivity";
import ReminderCard from "../../../components/ReminderCard";
import VehicleOverview from "../../../components/VehicleOverview";
import { fetchHomeDashboard } from "../../../services/homeDashboard";

const NAME_GRADIENT = ["#0CA88D", "#2779B6", "#6D2ED0"];

const QUICK_ACTIONS = [
  {
    id: "expense",
    label: "Add Expense",
    icon: require("../../../../assets/images/Fuel_Pump.png"),
    color: "#DCD5FF",
  },
  {
    id: "vehicle",
    label: "Add Vehicle",
    icon: require("../../../../assets/images/Garage_Icon.png"),
    color: "#E7EEFF",
  },
  {
    id: "service",
    label: "Log Service",
    icon: require("../../../../assets/images/Repair_Gear.png"),
    color: "#C4F2E9",
  },
  {
    id: "odometer",
    label: "Update Km",
    color: "#FFF0C2",
  },
];

const MENU_MAX_WIDTH = 290;
const MENU_PADDING = 12;
const MENU_BORDER = 1;
const TILE_GAP = 10;
const SCREEN_EDGE_GAP = 20;

// Dark layer behind the menu. Lighter: lower the last number. Darker: raise it.
const DIM_COLOR = "rgba(10, 12, 28, 0.32)";

const hexToRgb = (hex) =>
  [1, 3, 5].map((start) =>
    parseInt(hex.slice(start, start + 2), 16),
  );

const NAME_GRADIENT_RGB = NAME_GRADIENT.map(hexToRgb);

const gradientColorAt = (position) => {
  const scaled =
    Math.min(Math.max(position, 0), 1) *
    (NAME_GRADIENT_RGB.length - 1);

  const index = Math.min(
    Math.floor(scaled),
    NAME_GRADIENT_RGB.length - 2,
  );

  const mix = scaled - index;
  const from = NAME_GRADIENT_RGB[index];
  const to = NAME_GRADIENT_RGB[index + 1];

  const [red, green, blue] = from.map((value, i) =>
    Math.round(value + (to[i] - value) * mix),
  );

  return `rgb(${red}, ${green}, ${blue})`;
};

const GradientText = ({ text }) => {
  const isLatin = /^[\u0000-\u024F\u1E00-\u1EFF\u2000-\u206F]+$/.test(
    text,
  );

  if (!isLatin) {
    return (
      <AppText
        style={[
          styles.greetingName,
          { color: NAME_GRADIENT[1] },
        ]}
      >
        {text}
      </AppText>
    );
  }

  const characters = Array.from(text);
  const lastIndex = Math.max(characters.length - 1, 1);

  return characters.map((character, index) => (
    <AppText
      key={`${index}-${character}`}
      style={[
        styles.greetingName,
        {
          color: gradientColorAt(index / lastIndex),
        },
      ]}
    >
      {character}
    </AppText>
  ));
};

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [dashboardError, setDashboardError] = useState(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const { width: screenWidth } = useWindowDimensions();

  const menuWidth = Math.min(
    MENU_MAX_WIDTH,
    screenWidth - SCREEN_EDGE_GAP * 2,
  );

  const tileWidth = Math.floor(
    (
      menuWidth -
      MENU_PADDING * 2 -
      MENU_BORDER * 2 -
      TILE_GAP
    ) / 2,
  );

  const userName = "Nithilesh";
  const firstName = userName.trim().split(/\s+/)[0] ?? "";

  const formattedDate = new Date()
    .toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
    })
    .replace(",", "");

  const handleQuickAction = (actionId) => {
    setIsActionMenuOpen(false);

    if (actionId === "expense") {
      router.push("/onboarding/add-fuel");
    }

    // Add navigation for vehicle, service, and odometer here.
  };

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;

      fetchHomeDashboard()
        .then((data) => {
          if (isCurrent) {
            setDashboard(data);
            setDashboardError(null);
          }
        })
        .catch((error) => {
          if (isCurrent) {
            setDashboardError(error);
          }
        });

      return () => {
        isCurrent = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* Dashboard content */}
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.greetingSection}>
            <LinearGradient
              colors={["#E6E0FF", "#D9F8EC", "#FFFFFF"]}
              locations={[0, 0.55, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />

            <LinearGradient
              colors={["rgba(255,255,255,0)", "#FFFFFF"]}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.bottomFade}
              pointerEvents="none"
            />

            <View style={styles.greetingHeader}>
              <AppText style={styles.dateText}>
                {formattedDate}
              </AppText>

              <AppText
                style={styles.greetingText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {firstName ? (
                  <>
                    Hello,{" "}
                    <GradientText text={`${firstName}!`} />
                  </>
                ) : (
                  "Hello!"
                )}
              </AppText>
            </View>
          </View>

          <View style={styles.vehicleSection}>
            <VehicleOverview />

            {dashboardError ? (
              <AppText style={styles.dataMessage}>
                Couldn’t load reminders and activity. Please try
                again later.
              </AppText>
            ) : dashboard ? (
              <>
                <ReminderCard reminder={dashboard.reminder} />
                <RecentActivity
                  activities={dashboard.activities}
                />
              </>
            ) : (
              <AppText style={styles.dataMessage}>
                Loading dashboard...
              </AppText>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Floating plus button */}
      {dashboard && !dashboardError && !isActionMenuOpen ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open quick actions"
          onPress={() => setIsActionMenuOpen(true)}
          style={styles.addButton}
          hitSlop={8}
        >
          <LinearGradient
            colors={NAME_GRADIENT}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.addButtonGradient}
          >
            <View
              style={styles.plusIcon}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden
            >
              <View style={styles.plusBarHorizontal} />
              <View style={styles.plusBarVertical} />
            </View>
          </LinearGradient>
        </Pressable>
      ) : null}

      {/* Quick action menu overlay */}
      {isActionMenuOpen ? (
        <View
          style={styles.actionOverlay}
          pointerEvents="box-none"
        >
          {/* Dark backdrop (tap to close) */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close quick actions"
            onPress={() => setIsActionMenuOpen(false)}
            style={[
              StyleSheet.absoluteFill,
              styles.backdrop,
            ]}
          />

          {/* Quick action menu */}
          <View
            style={[
              styles.actionMenu,
              { width: menuWidth },
            ]}
            accessibilityViewIsModal
          >
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                onPress={() => handleQuickAction(action.id)}
                style={[
                  styles.actionItem,
                  {
                    width: tileWidth,
                    backgroundColor: action.color,
                  },
                ]}
              >
                <View style={styles.actionIconChip}>
                  {action.icon ? (
                    <Image
                      source={action.icon}
                      style={styles.actionIcon}
                    />
                  ) : (
                    <AppText style={styles.odometerIconText}>
                      km
                    </AppText>
                  )}
                </View>

                <AppText style={styles.actionLabel}>
                  {action.label}
                </AppText>
              </Pressable>
            ))}
          </View>

          {/* Close button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close quick actions"
            onPress={() => setIsActionMenuOpen(false)}
            style={[
              styles.addButton,
              styles.closeButton,
            ]}
            hitSlop={8}
          >
            <LinearGradient
              colors={NAME_GRADIENT}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.addButtonGradient}
            >
              <View
                style={styles.closeIcon}
                importantForAccessibility="no-hide-descendants"
                accessibilityElementsHidden
              >
                <View
                  style={[
                    styles.closeBar,
                    styles.closeBarForward,
                  ]}
                />
                <View
                  style={[
                    styles.closeBar,
                    styles.closeBarBackward,
                  ]}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },

  // Floating action buttons
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 5,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    zIndex: 3,
  },

  addButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
  },

  // Full-screen overlay
  actionOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    elevation: 10,
  },

  backdrop: {
    backgroundColor: DIM_COLOR,
  },

  // Quick-action menu above the backdrop
  actionMenu: {
    position: "absolute",
    right: 20,
    bottom: 88,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: TILE_GAP,
    padding: MENU_PADDING,
    borderWidth: MENU_BORDER,
    borderColor: "#A6B9F4",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    elevation: 12,
    shadowColor: "#5A6380",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    zIndex: 2,
  },

  actionItem: {
    height: 104,
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 20,
  },

  actionIconChip: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },

  actionIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  odometerIconText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: "#D49516",
  },

  actionLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#202020",
  },

  closeButton: {
    zIndex: 3,
  },

  // Close icon
  closeIcon: {
    width: 20,
    height: 20,
  },

  closeBar: {
    position: "absolute",
    left: -1,
    top: 8.5,
    width: 22,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF",
  },

  closeBarForward: {
    transform: [{ rotate: "45deg" }],
  },

  closeBarBackward: {
    transform: [{ rotate: "-45deg" }],
  },

  // Plus icon
  plusIcon: {
    width: 20,
    height: 20,
  },

  plusBarHorizontal: {
    position: "absolute",
    left: 0,
    top: 8.5,
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF",
  },

  plusBarVertical: {
    position: "absolute",
    left: 8.5,
    top: 0,
    width: 3,
    height: 20,
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF",
  },

  // Greeting section
  greetingSection: {
    marginHorizontal: -16,
    marginTop: -18,
    paddingHorizontal: 16,
    paddingTop: 18,
    overflow: "visible",
  },

  greetingHeader: {
    paddingTop: 10,
    paddingBottom: 20,
  },

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 45,
  },

  dateText: {
    marginBottom: 8,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
    color: "#9A9EAA",
  },

  greetingText: {
    fontSize: 36,
    lineHeight: 48,
    fontWeight: "600",
    letterSpacing: -1.5,
    color: "#242424",
  },

  greetingName: {
    fontWeight: "700",
  },

  dataMessage: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 20,
    color: "#777777",
  },
});