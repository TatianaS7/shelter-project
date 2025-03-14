import React, { useState } from "react";
import { Stack } from "expo-router";
import {
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useApi } from "../ApiContext";
import { Icon, Button } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";

export default function ShelterInfoScreen() {
  const { shelterData, updateShelterData } = useApi();

  // Set up state variables for each editable field
  const [shelterName, setShelterName] = useState(shelterData.shelter_name);
  const [address, setAddress] = useState(shelterData.address);
  const [city, setCity] = useState(shelterData.city);
  const [state, setState] = useState(shelterData.state);
  const [zipCode, setZipCode] = useState(shelterData.zip_code);
  const [phone, setPhone] = useState(shelterData.phone);
  const [email, setEmail] = useState(shelterData.primary_email);

  // Manage status with a boolean for the switch (e.g., true for Active, false for Inactive)
  const [isActive, setIsActive] = useState(shelterData.status === "Active");

  const [currentOccupancy, setCurrentOccupancy] = useState(
    shelterData.current_occupancy
  );
  const [capacity, setCapacity] = useState(shelterData.capacity);

  // State to manage whether the fields are in edit mode or not
  const [isEditing, setIsEditing] = useState(false);

  // Simulate an update function (e.g., sending data to an API)
  const handleUpdate = () => {
    setIsEditing(true); // Enable editing mode when the user clicks "Update Information"
  };

  const handleSaveChanges = () => {
    // Create the updated shelter data object
    const updatedShelterData = {
      shelter_name: shelterName,
      address,
      city,
      state,
      zip_code: zipCode,
      phone,
      primary_email: email,
      status: isActive ? "Active" : "Inactive",
      current_occupancy: currentOccupancy, // Ensure this is parsed to an integer
      capacity, // Ensure this is parsed to an integer
      current_funding: shelterData.current_funding,
      funding_needs: shelterData.funding_needs,
      resource_needs: shelterData.resource_needs,
      donations: shelterData.donations,
      staff: shelterData.staff,
    };

    // Call updateShelterData function with the updated data
    console.log("Saving shelter data...", updatedShelterData);
    updateShelterData(updatedShelterData);

    // Exit editing mode after saving
    setIsEditing(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Shelter Information",
          headerRight: () => (
            <Icon
              name="edit"
              size={24}
              color={Colors.light.icon}
              onPress={handleUpdate}
              style={styles.icon}
            />
          ),
        }}
      />
      <View style={styles.container}>
        {/* ScrollView for the form content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              {/* Shelter Name */}
              <Text style={styles.label}>Shelter Name</Text>
              <TextInput
                style={styles.input}
                value={shelterName}
                onChangeText={setShelterName}
                placeholder="Shelter Name"
                editable={isEditing}
              />

              {/* Address Fields in a Row (Address, City, State, Zip Code) */}
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                editable={isEditing}
              />
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                editable={isEditing}
              />
              <View style={styles.addressRow}>
                <Text style={styles.label}>State</Text>
                <Text style={styles.label}>ZIP Code</Text>
                </View>
              <View style={styles.addressRow}>
                <TextInput
                  style={styles.addressInput}
                  value={state}
                  onChangeText={setState}
                  placeholder="State"
                  editable={isEditing}
                />
                <TextInput
                  style={styles.addressInput}
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="Zip Code"
                  editable={isEditing}
                  keyboardType="numeric"
                />
              </View>

              {/* Phone */}
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone"
                editable={isEditing}
              />

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                editable={isEditing}
              />

              {/* Status (Active/Inactive) */}
              <Text style={styles.label}>Status</Text>
              <View style={styles.switchContainer}>
                <Text>{isActive ? "Active" : "Inactive"}</Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  disabled={!isEditing} // Disable switch when not in editing mode
                  trackColor={{true: Colors.light.tint }} // Set track colors
                />
              </View>

              <View style={styles.flexRow}>
                {/* Current Occupancy */}
                <Text style={styles.label}>Current Occupancy</Text>
                <Text style={styles.label}>Capacity</Text>
              </View>
              <View style={styles.flexRow}>
                <TextInput
                  style={styles.numberInput}
                  value={currentOccupancy.toString()}
                  onChangeText={(text) =>
                    setCurrentOccupancy(parseInt(text) || 0)
                  }
                  placeholder="Current Occupancy"
                  keyboardType="numeric"
                  editable={isEditing}
                />

                {/* Capacity */}
                <TextInput
                  style={styles.numberInput}
                  value={capacity.toString()}
                  onChangeText={(text) => setCapacity(parseInt(text) || 0)}
                  placeholder="Capacity"
                  keyboardType="numeric"
                  editable={isEditing}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Save Changes and Cancel Buttons */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button
              title="Save Changes"
              buttonStyle={[Buttons.primarySolid, styles.button]}
              onPress={handleSaveChanges}
            />
            <Button
              title="Cancel"
              buttonStyle={[Buttons.blackSolid, styles.button]}
              onPress={() => setIsEditing(false)}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Ensure that content fills available space
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding to ensure scroll works well with the keyboard
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 15,
  },
  addressRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  addressInput: {
    width: "45%",
    height: 40,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 10,
    fontSize: 18,
},
numberInput: {
    width: "45%",
    height: 40,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    borderRadius: 10,
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 45, // Padding to ensure the button is not too close to the edge
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    height: 45, // Ensure buttons have equal height
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
