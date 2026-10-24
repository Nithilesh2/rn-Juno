import { Pressable, StyleSheet, View } from "react-native"
import AppText from "./AppText"

const CATEGORY_COLORS = {
  fuel: "#8871E9",
  service: "#F28B5C",
  other: "#36B99A",
}

const formatActivityDate = (dateValue) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ""

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })
}

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)

const RecentActivity = ({ activities = [], onViewAll }) => (
  <View style={styles.container}>
    <View style={styles.heading}>
      <AppText style={styles.title}>Recent Activity</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="View all activity"
        disabled={!onViewAll}
        onPress={onViewAll}
        hitSlop={8}
      >
        <AppText style={styles.viewAll}>View All</AppText>
      </Pressable>
    </View>

    {activities.length === 0 ? (
      <AppText style={styles.emptyText}>No recent activity</AppText>
    ) : (
      activities.map((activity) => {
        const initial = activity.title?.trim().charAt(0).toUpperCase() ?? "?"
        const color =
          CATEGORY_COLORS[activity.category] ?? CATEGORY_COLORS.other

        return (
          <View key={activity.id} style={styles.activity}>
            <View style={[styles.avatar, { backgroundColor: color }]}>
              <AppText style={styles.initial}>{initial}</AppText>
            </View>
            <View style={styles.activityText}>
              <AppText numberOfLines={1} style={styles.activityTitle}>
                {activity.title}
              </AppText>
              <AppText numberOfLines={1} style={styles.subtitle}>
                {activity.vehicleName} •{" "}
                {formatActivityDate(activity.createdAt)}
              </AppText>
            </View>
            <AppText style={styles.amount}>
              {formatAmount(activity.amount)}
            </AppText>
          </View>
        )
      })
    )}

  </View>
)

export default RecentActivity

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
    color: "#111111",
  },
  viewAll: {
    fontSize: 14,
    lineHeight: 18,
    color: "#7C2DE0",
    textDecorationLine: "underline",
  },
  emptyText: {
    paddingVertical: 10,
    fontSize: 12,
    lineHeight: 18,
    color: "#777777",
  },
  activity: {
    minHeight: 42,
    flexDirection: "row",
    // alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45,
  },
  initial: {
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
  },
  activityText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 8,
  },
  activityTitle: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    color: "#141414",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 15,
    color: "#777777",
  },
  amount: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#151515",
    marginTop: 10,
  },
})
