import { useState } from "react"
import { router } from "expo-router"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native"
import AppText from "../../components/AppText"
import { addFuelActivity } from "../../services/homeDashboard"

const VEHICLES = ["Honda Activa", "Bajaj Pulsar 125", "Swift Dzire"]

const AddFuel = () => {
  const [vehicleName, setVehicleName] = useState(VEHICLES[0])
  const [amount, setAmount] = useState("")
  const [liters, setLiters] = useState("")
  const [odometer, setOdometer] = useState("")
  const [error, setError] = useState("")

  const saveFuelEntry = () => {
    const parsedAmount = Number(amount)
    const parsedLiters = liters ? Number(liters) : undefined
    const parsedOdometer = odometer ? Number(odometer) : undefined

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a fuel cost greater than zero.")
      return
    }

    if (liters && (!Number.isFinite(parsedLiters) || parsedLiters <= 0)) {
      setError("Enter a valid fuel quantity.")
      return
    }

    if (
      odometer &&
      (!Number.isFinite(parsedOdometer) || parsedOdometer < 0)
    ) {
      setError("Enter a valid odometer reading.")
      return
    }

    addFuelActivity({
      amount: parsedAmount,
      vehicleName,
      liters: parsedLiters,
      odometer: parsedOdometer,
    })
    router.back()
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={10}
          onPress={() => router.back()}
        >
          <AppText style={styles.back}>‹</AppText>
        </Pressable>
        <AppText style={styles.title}>Add fuel entry</AppText>
        <View style={styles.headerSpacer} />
      </View>

      <AppText style={styles.label}>Vehicle</AppText>
      <View style={styles.vehicleList}>
        {VEHICLES.map((vehicle) => {
          const isSelected = vehicle === vehicleName

          return (
            <Pressable
              key={vehicle}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setVehicleName(vehicle)}
              style={[
                styles.vehicleOption,
                isSelected && styles.vehicleOptionSelected,
              ]}
            >
              <AppText
                style={[
                  styles.vehicleOptionText,
                  isSelected && styles.vehicleOptionTextSelected,
                ]}
              >
                {vehicle}
              </AppText>
            </Pressable>
          )
        })}
      </View>

      <AppText style={styles.label}>Fuel cost</AppText>
      <View style={styles.inputWrapper}>
        <AppText style={styles.currency}>₹</AppText>
        <TextInput
          accessibilityLabel="Fuel cost in rupees"
          keyboardType="decimal-pad"
          onChangeText={(value) => {
            setAmount(value)
            setError("")
          }}
          placeholder="0"
          placeholderTextColor="#999999"
          style={styles.amountInput}
          value={amount}
        />
      </View>

      <AppText style={styles.label}>Quantity (optional)</AppText>
      <View style={styles.inputWrapper}>
        <TextInput
          accessibilityLabel="Fuel quantity in liters"
          keyboardType="decimal-pad"
          onChangeText={(value) => {
            setLiters(value)
            setError("")
          }}
          placeholder="0.0"
          placeholderTextColor="#999999"
          style={styles.input}
          value={liters}
        />
        <AppText style={styles.unit}>L</AppText>
      </View>

      <AppText style={styles.label}>Odometer (optional)</AppText>
      <View style={styles.inputWrapper}>
        <TextInput
          accessibilityLabel="Odometer reading in kilometers"
          keyboardType="number-pad"
          onChangeText={(value) => {
            setOdometer(value)
            setError("")
          }}
          placeholder="0"
          placeholderTextColor="#999999"
          style={styles.input}
          value={odometer}
        />
        <AppText style={styles.unit}>km</AppText>
      </View>

      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <Pressable
        accessibilityRole="button"
        onPress={saveFuelEntry}
        style={styles.saveButton}
      >
        <AppText style={styles.saveButtonText}>Save fuel entry</AppText>
      </Pressable>
    </ScrollView>
  )
}

export default AddFuel

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  back: {
    width: 32,
    fontSize: 36,
    lineHeight: 40,
    color: "#252525",
  },
  title: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "600",
    color: "#171717",
  },
  headerSpacer: {
    width: 32,
  },
  label: {
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#292929",
  },
  vehicleList: {
    gap: 8,
    marginBottom: 24,
  },
  vehicleOption: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
  },
  vehicleOptionSelected: {
    borderColor: "#0CA88D",
    backgroundColor: "#E8F8F4",
  },
  vehicleOptionText: {
    fontSize: 14,
    color: "#555555",
  },
  vehicleOptionTextSelected: {
    fontWeight: "600",
    color: "#087A67",
  },
  inputWrapper: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
  },
  currency: {
    marginRight: 8,
    fontSize: 18,
    color: "#555555",
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    color: "#171717",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#171717",
  },
  unit: {
    marginLeft: 8,
    fontSize: 14,
    color: "#777777",
  },
  error: {
    marginBottom: 14,
    fontSize: 13,
    color: "#B42318",
  },
  saveButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#0CA88D",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})
