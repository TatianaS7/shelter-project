import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import { useApi } from "../app/ApiContext";
import { Colors } from "../constants/Colors";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button } from "react-native-elements";
import { Spacing } from "@/constants/Spacing";
import { Buttons } from "@/constants/Buttons";
import { router } from "expo-router";

export default function Shelter() {
  const { shelterData } = useApi();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.shelterDataContainer}>
        <Icon name="home" color={Colors.light.icon} size={65} />
        <HeaderTitle style={styles.shelterName} numberOfLines={2}>
          {shelterData.shelter_name}
        </HeaderTitle>
        {/* <Text style={styles.shelterAddress}>{shelterData.address}</Text>
        <Text style={styles.shelterAddress}>
          {shelterData.city}, {shelterData.state} {shelterData.zip_code}
        </Text>
        <Text style={styles.shelterAddress}>{shelterData.phone}</Text> */}
      </View>

      <View style={[Spacing.roundedContainer, styles.contentContainer]}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.containers}>
            <HeaderTitle style={{ color: "white" }}>General</HeaderTitle>
            <Button
              title="Shelter Information"
              titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
              icon={<Icon name="info" color="white" />}
              buttonStyle={Buttons.primarySolid}
              onPress={() => router.push("/shelter-pages/shelter-info")}
            ></Button>
            <Button
              title="Team Members"
              titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
              type="outline"
              icon={<Icon name="people" color="white" />}
              buttonStyle={Buttons.primarySolid}
              onPress={() => router.push("/shelter-pages/team-info")}
            ></Button>
          </View>
          <View style={styles.containers}>
            <HeaderTitle style={{ color: "white" }}>Reports</HeaderTitle>
            <Button
              title="Generate a Report"
              titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
              icon={<Icon name="article" color="white" />}
              buttonStyle={Buttons.primarySolid}
              onPress={() => router.push("/shelter-pages/generate-report")}
              type="solid"
            />
            <Button
              title="Report History"
              titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
              icon={<Icon name="history" color="white" />}
              buttonStyle={Buttons.primarySolid}
              type="solid"
            />
          </View>

          <Divider />

          <View style={styles.containers}>
            <HeaderTitle style={{ color: "white" }}>Resources</HeaderTitle>
            <Button
              title="Manage Resources"
              titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
              icon={<Icon name="reorder" color="white" />}
              buttonStyle={Buttons.primarySolid}
              type="solid"
            />
          </View>

          <Divider />

          <View style={styles.containers}>
            <HeaderTitle style={{ color: "white" }}>Funding</HeaderTitle>
            <Button
              title="Manage Funding"
              titleStyle={{ ...Buttons.buttonText, fontWeight: "500" }}
              icon={<Icon name="savings" color="white" />}
              buttonStyle={Buttons.primarySolid}
              type="solid"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white"
  },
  shelterDataContainer: {
    height: "auto",
    padding: 45,
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "black",
    height: "70%",
    paddingTop: 20,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  shelterName: {
    fontSize: 25,
    color: "black",
    fontWeight: "600",
    marginBottom: 15,
  },
  shelterAddress: {
    fontSize: 17,
    color: "black",
    fontWeight: "600",
  },
  containers: {
    marginTop: 20,
    gap: 10,
  },
});
