import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  Switch
} from "react-native";

import { useApi } from "../app/ApiContext";
import { Colors } from "../constants/Colors";
import { HeaderTitle } from "@react-navigation/elements";
import { Button } from "react-native-elements";
import { Buttons } from "@/constants/Buttons";
import { Fonts } from "@/constants/Fonts";

interface AddTeamMemberProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTeamMember({ isOpen, onClose }: AddTeamMemberProps) {
  const { createUser, shelterData } = useApi();
  const [newMember, setnewMember] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_role: "Viewer",
    user_type: "TEAM_MEMBER",
    shelter_id: shelterData.id,
    donations: [],
    id: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAddMember = () => {
    console.log("New Member Data: ", newMember);
    createUser(newMember);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <HeaderTitle style={Fonts.sectionTitle}>Add Team Member</HeaderTitle>
          <Button
            onPress={onClose}
            type="clear"
            icon={{
              name: "close",
                type: "ionicon",
                size: 35,
                color: Colors.light.icon,
            }}
            />
            </View>
          <ScrollView contentContainerStyle={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={newMember.first_name}
              onChangeText={(text) =>
                setnewMember({ ...newMember, first_name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={newMember.last_name}
              onChangeText={(text) =>
                setnewMember({ ...newMember, last_name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newMember.email}
              onChangeText={(text) =>
                setnewMember({ ...newMember, email: text })
              }
            />
            <Text style={{ fontWeight: "bold", fontSize: 16}}>Role</Text>
            <View style={styles.switchContainer}>
              <Text>{isAdmin ? "Admin" : "Viewer"}</Text>
              <Switch
                value={isAdmin}
                onValueChange={(value) => {
                  setIsAdmin(value);
                  setnewMember({ ...newMember, user_role: value ? "Admin" : "Viewer" });
                }}
                trackColor={{ true: Colors.light.tint }} // Set track colors
              />
            </View>

            <Button
              title="Submit"
              buttonStyle={[Buttons.primarySolid, { justifyContent: "center" }]}
              onPress={handleAddMember}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: 100,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 15,
  },
});
