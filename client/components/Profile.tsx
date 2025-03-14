import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";

import { useApi } from "../app/ApiContext";
import { Colors } from "../constants/Colors";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button } from "react-native-elements";
import { Buttons } from "@/constants/Buttons";
import { Spacing } from "@/constants/Spacing";
import { router } from "expo-router";

export default function Profile() {
  const { currentUser } = useApi();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.detailsContainer}>
        <Icon name="person" color="black" size={95} />
        <HeaderTitle style={styles.userName}>
          {currentUser.first_name} {currentUser.last_name}
        </HeaderTitle>
        <Text style={styles.userEmail}>{currentUser.email}</Text>

        <Text style={styles.userType}>{currentUser.user_type}</Text>
        {currentUser.user_role && (
          <Text style={styles.userRole}>{currentUser.user_role}</Text>
        )}
      </View>

      <View
        style={{
          ...Spacing.roundedContainer,
          backgroundColor: Colors.light.background,
          height: '66%'
        }}
      >
        <HeaderTitle>General</HeaderTitle>
        <ScrollView style={styles.settingsContainer}>
          <Button
            title="Edit Profile"
            titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
            type="outline"
            icon={<Icon name="edit" color={Colors.light.icon} />}
            buttonStyle={[Buttons.primaryOutline, styles.button]}
            onPress={() => router.push("/profile-pages/edit-profile")}
          ></Button>
          <Button
            title="Change Password"
            titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
            type="outline"
            icon={<Icon name="lock" color={Colors.light.icon} />}
            buttonStyle={[Buttons.primaryOutline, styles.button]}
          ></Button>
          <Button
            title="Notifications"
            titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
            type="outline"
            icon={<Icon name="notifications" color={Colors.light.icon} />}
            buttonStyle={[Buttons.primaryOutline, styles.button]}
          ></Button>
          <Button
            title="Privacy"
            titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
            type="outline"
            icon={<Icon name="shield" color={Colors.light.icon} />}
            buttonStyle={[Buttons.primaryOutline, styles.button]}
          ></Button>
          <Button
            title="Settings"
            titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
            type="outline"
            icon={<Icon name="settings" color={Colors.light.icon} />}
            buttonStyle={[Buttons.primaryOutline, styles.button]}
          ></Button>
          {currentUser.user_type === "Donor" && (
            <>
              <Button
                title="Payment Methods"
                titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
                type="outline"
                icon={<Icon name="payment" color={Colors.light.icon} />}
                buttonStyle={[Buttons.primaryOutline, styles.button]}
              ></Button>

              <Button
                title="Saved Shelters"
                titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
                type="outline"
                icon={<Icon name="bookmark" color={Colors.light.icon} />}
                buttonStyle={[Buttons.primaryOutline, styles.button]}
              ></Button>

              <Button
                title="Tax Information"
                titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
                type="outline"
                icon={<Icon name="receipt" color={Colors.light.icon} />}
                buttonStyle={[Buttons.primaryOutline, styles.button]}
              ></Button>
            </>
          )}
        </ScrollView>

        <View style={styles.signOutContainer}>
          <Button
            title="Sign Out"
            titleStyle={{ color: "white", fontWeight: 500 }}
            type="solid"
            buttonStyle={{
              backgroundColor: "red",
              height: 50,
            }}
          ></Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.light.tint
  },
  userName: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  userType: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  userRole: {
    fontSize: 17,
    textAlign: "center",
    color: "black",
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
  detailsContainer: {
    height: "auto",
    padding: 15,
    backgroundColor: Colors.light.tint,
  },
  button: {
    display: "flex",
    borderColor: Colors.light.tint,
    borderWidth: 1,
    height: 50,
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  settingsContainer: {
    height: '5%',
    // backgroundColor: Colors.light.tint,
  },
  signOutContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    justifyContent: "center",
    margin: 20
    },
});
