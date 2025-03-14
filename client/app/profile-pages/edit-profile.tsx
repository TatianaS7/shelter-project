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

export default function EditProfileScreen() {
  const { currentUser } = useApi();

  const [isEditing, setIsEditing] = useState(false);

  // Set up state variables for each editable field
  const [email, setEmail] = useState(currentUser.email);
  const [firstName, setFirstName] = useState(currentUser.first_name);
  const [lastName, setLastName] = useState(currentUser.last_name);

  // Function to handle the edit button press
  const handleUpdate = () => {
    setIsEditing(true);
  };


  const handleSaveChanges = () => {
    // Create the updated user data object
    const updatedUserData = {
    };

    // Call the updateUser function with the updated data
    console.log("Saving user data:", updatedUserData);
    // updateShelterData(updatedShelterData);

    // Exit editing mode after saving
    setIsEditing(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "User Information",
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
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                editable={isEditing}
              />

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                editable={isEditing}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
              />

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
    height: 50,
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
