const daysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

const todayAtTen = () => {
  const date = new Date()
  date.setHours(10, 0, 0, 0)
  return date.toISOString()
}

const addedActivities = []

export const fetchHomeDashboard = async () => {
  return {
    reminder: {
      id: "reminder-engine-oil",
      title: "Engine Oil Change",
      vehicleName: "Honda Activa 5G",
      scheduledAt: todayAtTen(),
    },
    activities: [
      ...addedActivities,
      {
        id: "activity-petrol-fill-up",
        title: "Fuel Fill-up",
        vehicleName: "Honda Activa 5G",
        createdAt: daysAgo(1),
        amount: 350,
        category: "fuel",
      },
      {
        id: "activity-general-service",
        title: "General Service",
        vehicleName: "Swift Dzire",
        createdAt: daysAgo(7),
        amount: 4200,
        category: "service",
      },
      {
        id: "activity-pulsar-petrol",
        title: "Petrol Fill-up",
        vehicleName: "Bajaj Pulsar 125",
        createdAt: daysAgo(12),
        amount: 600,
        category: "fuel",
      },
    ],
  }
}

export const addFuelActivity = ({ amount, vehicleName, liters, odometer }) => {
  const activity = {
    id: `activity-fuel-${Date.now()}`,
    title: "Petrol Fill-up",
    vehicleName,
    createdAt: new Date().toISOString(),
    amount,
    category: "fuel",
    liters,
    odometer,
  }

  addedActivities.unshift(activity)
  return activity
}
