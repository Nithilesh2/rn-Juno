import { Image, Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";

const formatDate = (dateValue) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ""

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })
}

const formatTime = (dateValue) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ""

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const ReminderCard = ({ reminder, onSnooze, onComplete }) => {
  if (!reminder) return null

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.pill}>
          <AppText style={styles.pillText}>
            {formatDate(reminder.scheduledAt)}
          </AppText>
        </View>
        <View style={styles.pill}>
          <Image
            source={require("../../assets/images/RecentActivityIcon.svg")}
            style={styles.timeIcon}
            contentFit="contain"
          />
          <AppText style={styles.pillText}>
            {formatTime(reminder.scheduledAt)}
          </AppText>
        </View>
      </View>

      <View style={styles.reminderContent}>
        <View style={styles.bellContainer}>
          <Image
            source={require("../../assets/images/Bell.png")}
            style={styles.bell}
            resizeMode="contain"
          />
        </View>
        <View style={styles.reminderText}>
          <AppText numberOfLines={1} style={styles.title}>
            {reminder.title}
          </AppText>
          <AppText numberOfLines={1} style={styles.subtitle}>
            {reminder.vehicleName}
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remind me later"
          disabled={!onSnooze}
          onPress={() => onSnooze?.(reminder)}
          style={styles.action}
        >
          <Image
            source={require("../../assets/images/RemainderIcon.svg")}
            style={styles.reminderIcon}
            contentFit="contain"
          />
          <AppText style={styles.actionText}>Remind Me Later</AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mark reminder as done"
          disabled={!onComplete}
          onPress={() => onComplete?.(reminder)}
          style={styles.action1}
        >
          <Image
            source={require("../../assets/images/TickIcon.svg")}
            style={styles.doneIcon}
            contentFit="contain"
          />
          <AppText style={styles.actionText}>Done</AppText>
        </Pressable>
      </View>
    </View>
  )
}

export default ReminderCard

const styles = StyleSheet.create({
  card: {
    marginTop: 15,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: "#F4D889",
    borderRadius: 14,
    backgroundColor: "#FFF7DE",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pill: {
    width: 115,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#FFECB1",
    flexDirection: "row",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "500",
    color: "#272727",
  },
  timeIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  reminderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 9,
    paddingHorizontal: 5,
  },
  bellContainer: {
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 60,
    backgroundColor: "#FFE9A0",
  },
  bell: {
    width: 25,
    height: 25,
  },
  reminderText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
    color: "#111111",
  },
  subtitle: {
    marginTop: 1,
    fontSize: 14,
    lineHeight: 26,
    color: "#222222",
    fontWeight: "500",
  },
  actions: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#F2D98F",
    gap: 10,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  action1: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingLeft: 30,
  },
  reminderIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  doneIcon: {
    width: 16,
    height: 13,
    marginRight: 10,
  },
  actionText: {
    fontSize: 14,
    lineHeight: 16,
    color: "#222222",
    fontWeight: "500",
  },
})
