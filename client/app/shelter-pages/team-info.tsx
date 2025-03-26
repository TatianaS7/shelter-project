import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Stack } from "expo-router";
import { useApi } from "../ApiContext";
import { Icon, SearchBar, Button } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Buttons } from "@/constants/Buttons";
import AddTeamMember from "@/components/AddTeamMemberForm";
import EmployeeCard from "@/components/EmployeeCard";

export default function TeamInfoScreen() {
  const { shelterData } = useApi();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenNewMember = () => {
    setOpenModal(true);
  };

  const handleCloseNewMember = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Team Members",
          headerStyle: {
            backgroundColor: Colors.light.tint,
          },
          headerTintColor: Colors.light.background,
        }}
      />
      <View style={Spacing.mainContainer}>
        <SearchBar
          placeholder="Search for a team member"
          platform="ios"
          containerStyle={[Spacing.searchBarContainer, { marginBottom: 20 }]}
          inputContainerStyle={Spacing.searchBarInputContainer}
          searchIcon={{
            name: "search",
            type: "ionicon",
            size: 24,
            color: Colors.light.icon,
          }}
        />
        <Button
          title="Member"
          buttonStyle={[Buttons.primarySolid, styles.addMemberBtn]}
          icon={
            <Icon
              name="add"
              type="ionicon"
              size={25}
              color={Colors.light.background}
            />
          }
          onPress={() => {
            setOpenModal(true);
          }}
        />
        <View
          style={[
            styles.row,
            { justifyContent: "space-between", marginBottom: 10 },
          ]}
        >
          <Text style={styles.teamCount}>
            Result(s): {shelterData.staff.length}
          </Text>
          <Button
            icon={<Icon name="filter" type="ionicon" size={25} color="black" />}
            buttonStyle={{ backgroundColor: "none" }}
          />
        </View>

        {openModal && (
          <AddTeamMember isOpen={openModal} onClose={handleCloseNewMember} />
        )}

        <EmployeeCard />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  addMemberBtn: {
    justifyContent: "center",
    alignContent: "center",
    width: 150,
    alignSelf: "center",
  },
  mainContainer: {
    margin: 20,
  },
  teamCount: {
    fontSize: 17,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
