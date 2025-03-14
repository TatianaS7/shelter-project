import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useApi } from "../ApiContext";
import { Icon, SearchBar, Button, Divider } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Buttons } from "@/constants/Buttons";
import { HeaderTitle } from "@react-navigation/elements";

export default function TeamInfoScreen() {
  const { shelterData, updateShelterData } = useApi();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Team Members",
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
        <View style={[styles.row, { justifyContent: "space-between", marginBottom: 10 }]}>
          <Text style={styles.teamCount}>
            Result(s): {shelterData.staff.length}
          </Text>
          <Button
            icon={<Icon name="filter" type="ionicon" size={25} color="black" />}
            buttonStyle={{ backgroundColor: "none" }}
          />
        </View>
        
        <ScrollView>
        {shelterData.staff.map((staffMember, index) => (
          <View key={index} style={[styles.employeeCard, styles.row]}>
            <Icon name="person" color={Colors.light.icon} size={50} />

            <View style={styles.employeeInfo}>
              <View style={styles.row}>
                <Text style={styles.employeeName}>
                  {staffMember.first_name} {staffMember.last_name}
                </Text>
                {staffMember.user_role === "Admin" ? (
                  <Text
                    style={[
                      styles.userRole,
                      { backgroundColor: Colors.light.tint },
                    ]}
                  >
                    {staffMember.user_role}
                  </Text>
                ) : (
                  <Text
                    style={[styles.userRole, { backgroundColor: "lightgreen" }]}
                  >
                    {staffMember.user_role}
                  </Text>
                )}
              </View>
              {/* <Text>{staffMember.email}</Text> */}
            </View>

            <View style={styles.chevronContainer}>
              <Button
                icon={
                  <Icon
                    name="chevron-right"
                    color={Colors.light.icon}
                    size={30}
                  />
                }
                type="clear"
              />
            </View>
          </View>
        ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    margin: 20,
  },
  teamCount: {
    fontSize: 17,
    fontWeight: "bold",
  },
  employeeCard: {
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  employeeInfo: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 16,
    padding: 4,
    borderRadius: 5,
    color: "white",
    fontWeight: "bold",
  },
  chevronContainer: {
    justifyContent: "flex-end",
  },
});
