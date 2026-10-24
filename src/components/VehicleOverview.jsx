import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import AppText from "./AppText";

const vehicles = [
  {
    id: "scooter",
    name: "Honda Activa",
    image: require("../../assets/images/scooty.png"),
    monthlySpend: "₹ 3,200",
    lastMonth: "₹ 3,800",
    change: "↓ 16%",
    fuel: "₹ 2,300",
    other: "₹ 900",
  },
  {
    id: "bike",
    name: "Bajaj Pulsar 125",
    image: require("../../assets/images/bike.png"),
    monthlySpend: "₹ 8,450",
    lastMonth: "₹ 9,600",
    change: "↓ 12%",
    fuel: "₹ 5,800",
    other: "₹ 2,650",
  },
  {
    id: "car",
    name: "Swift Dzire",
    image: require("../../assets/images/car.png"),
    monthlySpend: "₹ 12,400",
    lastMonth: "₹ 14,200",
    change: "↓ 13%",
    fuel: "₹ 8,900",
    other: "₹ 3,500",
  },
]

const FLARE = 16
const BORDER = "#A6B9F4"
const INACTIVE_BG = "#E7EDFC"

const Flare = ({ side, hasNeighbour }) =>
  hasNeighbour ? (
    <View
      pointerEvents="none"
      style={[
        styles.flare,
        side === "left" ? styles.flareLeft : styles.flareRight,
      ]}
    >
      <View
        style={[
          styles.flareCircle,
          side === "left" ? styles.flareCircleLeft : styles.flareCircleRight,
        ]}
      />
    </View>
  ) : null

const Home = () => {
  const { width: screenWidth } = useWindowDimensions()

  const visibleTabCount = Math.max(1, Math.min(vehicles.length, 3))
  const tabWidth = Math.max(0, screenWidth - 32) / visibleTabCount

  const scrollRef = useRef(null)
  const tabLayouts = useRef({})

  const [selectedVehicleId, setSelectedVehicleId] = useState(
    vehicles[0]?.id ?? null,
  )

  const [imageScales] = useState(() =>
    Object.fromEntries(
      vehicles.map((vehicle, index) => [
        vehicle.id,
        new Animated.Value(index === 0 ? 1.4 : 1),
      ]),
    ),
  )

  const effectiveSelectedVehicleId = vehicles.some(
    (vehicle) => vehicle.id === selectedVehicleId,
  )
    ? selectedVehicleId
    : (vehicles[0]?.id ?? null)
  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === effectiveSelectedVehicleId) ??
    null

  const scrollToVehicle = (id) => {
    requestAnimationFrame(() => {
      const layout = tabLayouts.current[id]

      if (layout && scrollRef.current) {
        scrollRef.current.scrollTo({
          x: Math.max(0, layout.x + layout.width / 2 - screenWidth / 2 + 16),
          animated: true,
        })
      }
    })
  }

  const selectVehicle = (id) => {
    if (id === effectiveSelectedVehicleId) return

    const currentScale = imageScales[selectedVehicle?.id]
    const nextScale = imageScales[id]

    const animations = []

    if (currentScale) {
      animations.push(
        Animated.spring(currentScale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 4,
        }),
      )
    }

    if (nextScale) {
      animations.push(
        Animated.spring(nextScale, {
          toValue: 1.4,
          useNativeDriver: true,
          speed: 20,
          bounciness: 4,
        }),
      )
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start()
    }

    setSelectedVehicleId(id)
    scrollToVehicle(id)
  }

  const handleTabLayout = (id, event) => {
    tabLayouts.current[id] = event.nativeEvent.layout
  }

  return selectedVehicle ? (
    <>
      <ScrollView
        ref={scrollRef}
        horizontal
        scrollEnabled={vehicles.length > 3}
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
        keyboardShouldPersistTaps="handled"
      >
        {vehicles.map((vehicle, index) => {
          const isSelected = vehicle.id === selectedVehicle.id
          const imageScale = imageScales[vehicle.id]

          if (isSelected) {
            return (
              <View
                key={vehicle.id}
                onLayout={(event) => handleTabLayout(vehicle.id, event)}
                style={[styles.selectedGroup, { width: tabWidth }]}
              >
                <Flare side="left" hasNeighbour={index > 0} />

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: true }}
                  accessibilityLabel={`${vehicle.name} expenses, selected`}
                  onPress={() => selectVehicle(vehicle.id)}
                  style={[styles.tabSelected, { width: tabWidth }]}
                >
                  <Animated.Image
                    source={vehicle.image}
                    style={[
                      styles.tabImageSelected,
                      imageScale && {
                        transform: [{ scale: imageScale }],
                      },
                    ]}
                    resizeMode="contain"
                  />
                </Pressable>

                <Flare
                  side="right"
                  hasNeighbour={index < vehicles.length - 1}
                />
              </View>
            )
          }

          return (
            <Pressable
              key={vehicle.id}
              onLayout={(event) => handleTabLayout(vehicle.id, event)}
              accessibilityRole="button"
              accessibilityState={{ selected: false }}
              accessibilityLabel={`Show ${vehicle.name} expenses`}
              onPress={() => selectVehicle(vehicle.id)}
              style={[styles.tab, { width: tabWidth }]}
            >
              <Animated.Image
                source={vehicle.image}
                style={[
                  styles.tabImage,
                  imageScale && {
                    transform: [{ scale: imageScale }],
                  },
                ]}
                resizeMode="contain"
              />

              <AppText numberOfLines={1} style={styles.tabName}>
                {vehicle.name.length > 9
                  ? `${vehicle.name.slice(0, 9)}...`
                  : vehicle.name}
              </AppText>
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={styles.summaryCard}>
        <AppText style={styles.vehicleTitle}>{selectedVehicle.name}</AppText>

        <View style={styles.spendRow}>
          <AppText style={styles.monthlySpend}>
            {selectedVehicle.monthlySpend}
          </AppText>

          <View style={styles.changeBadge}>
            <AppText style={styles.changeText}>
              {selectedVehicle.change}
            </AppText>
          </View>
        </View>

        <AppText style={styles.comparison}>
          vs last month ({selectedVehicle.lastMonth})
        </AppText>

        <View style={styles.divider} />

        <View style={styles.breakdown}>
          <View style={styles.breakdownItem}>
            <View style={[styles.categoryIcon, styles.fuelIconBackground]}>
              <Image
                source={require("../../assets/images/Fuel_Pump.png")}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.categoryText}>
              <AppText style={styles.categoryTitle}>Fuel</AppText>

              <AppText style={styles.categoryAmount}>
                {selectedVehicle.fuel}
              </AppText>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <View style={[styles.categoryIcon, styles.otherIconBackground]}>
              <Image
                source={require("../../assets/images/Repair_Gear.png")}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.categoryText}>
              <AppText style={styles.categoryTitle}>Others</AppText>

              <AppText style={styles.categoryAmount}>
                {selectedVehicle.other}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </>
  ) : null
}

export default Home

const styles = StyleSheet.create({
  /* Vehicle tabs */
  tabsScroll: {
    flexGrow: 0,
    zIndex: 1,
    overflow: "visible",
  },

  tabsContent: {
    alignItems: "flex-end",
  },

  tab: {
    height: 88,
    marginBottom: 1,
    paddingHorizontal: 4,
    paddingBottom: 6,
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: INACTIVE_BG,
  },

  tabImage: {
    width: 52,
    height: 50,
  },

  tabName: {
    maxWidth: "100%",
    marginTop: 1,
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    fontWeight: "600",
  },

  selectedGroup: {
    position: "relative",
    height: 88,
    flexDirection: "row",
    alignItems: "flex-end",
    zIndex: 2,
  },

  tabSelected: {
    height: 88,
    paddingHorizontal: 2,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    overflow: "visible",
  },

  tabImageSelected: {
    width: 54,
    height: 58,
  },
  flare: {
    position: "absolute",
    bottom: 0,
    width: FLARE,
    height: FLARE,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  flareLeft: {
    left: -FLARE + 1,
  },

  flareRight: {
    right: -FLARE + 1,
  },

  flareCircle: {
    position: "absolute",
    top: -FLARE,
    width: FLARE * 2,
    height: FLARE * 2,
    borderRadius: FLARE,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: INACTIVE_BG,
  },

  flareCircleLeft: {
    left: -FLARE,
  },

  flareCircleRight: {
    left: 0,
  },

  summaryCard: {
    marginTop: -1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopEndRadius: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  vehicleTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "500",
    color: "#111111",
    position: "relative",
    zIndex: 100,
  },

  spendRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  monthlySpend: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "700",
    color: "#242B0B",
    letterSpacing: -1.4,
  },

  changeBadge: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: "#00BD80",
  },

  changeText: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  comparison: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 26,
    color: "#626262",
  },

  divider: {
    height: 1,
    marginTop: 20,
    marginBottom: 18,
    backgroundColor: "#D4C8FF",
  },

  breakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },

  breakdownItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  categoryIcon: {
    width: 56,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },

  fuelIconBackground: {
    backgroundColor: "#D8D0FF",
  },

  otherIconBackground: {
    backgroundColor: "#BDF3E7",
  },

  categoryImage: {
    width: 42,
    height: 42,
  },

  categoryText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },

  categoryTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: "#111111",
  },

  categoryAmount: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 28,
    color: "#626262",
  },
})
