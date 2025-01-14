import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button, SearchBar } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";

import { useApi } from "../app/ApiContext";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { Spacing } from "@/constants/Spacing";
import { Fonts } from "@/constants/Fonts";
import DonationCard from "./DonationCard";

export default function Donations() {
  const { currentUser, shelterData } = useApi();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [donationTypes, setDonationTypes] = useState([
    { label: "Monetary", value: "monetary" },
    { label: "Physical", value: "physical" },
  ]);

  return (
    <View>
      <View style={Spacing.mainContainer}>
        <SearchBar
          placeholder="Search Donations..."
          platform="ios"
          onChangeText={() => {}}
          value=""
          containerStyle={Spacing.searchBarContainer}
          inputContainerStyle={Spacing.searchBarInputContainer}
          searchIcon={{
            name: "search",
            type: "ionicon",
            size: 24,
            color: Colors.light.icon,
          }}
        />

        {currentUser.user_type === "Team Member" ? (
          <View style={styles.reviewDonationsContainer}>
            <HeaderTitle style={Spacing.widgetContainerText}>
              To Be Reviewed
            </HeaderTitle>
            <Button
              title="Review Donations"
              buttonStyle={Buttons.primarySolid}
              onPress={() => {}}
              style={styles.reviewButton}
            />
          </View>
        ) : (
          currentUser.user_type === "Donor" && (
            <View>
              <Button
                title="Add Donation"
                buttonStyle={Buttons.blackSolid}
                onPress={() => {}}
              />
            </View>
          )
        )}

        <View></View>
      </View>

      <View
        style={[
          Spacing.roundedContainer,
          { backgroundColor: Colors.light.icon },
        ]}
      >
        <View style={styles.flex}>
            <HeaderTitle style={styles.donationsList}>Donations List</HeaderTitle>
            <Button
                icon={
                    <Icon
                        name="filter"
                        type="ionicon"
                        size={20}
                        color="white"
                    />
                }
                buttonStyle={Buttons.primarySolid}
                onPress={() => {}}
            />
        </View>

        {/* <View style={styles.filtersContainer}>
          <View style={styles.filter}>
            <HeaderTitle>Type</HeaderTitle>
            <DropDownPicker
              open={open}
              value={value}
              items={donationTypes}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setDonationTypes}
            />
          </View>

          <View style={styles.filter}>
            <HeaderTitle>Status</HeaderTitle>
            <DropDownPicker
                open={open}
                value={value}
                items={donationTypes}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setDonationTypes}
                />
            </View>
        </View> */}

        <DonationCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewDonationsContainer: {
    backgroundColor: "black",
    height: "auto",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  reviewButton: {
    width: "auto",
    alignSelf: "center",
    textAlign: "center",
    marginBottom: 20,
  },
  donationsList: {
    color: "black",
    fontSize: 25,
  },
  filtersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10
  },
  filter: {
    width: "45%",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }
});
