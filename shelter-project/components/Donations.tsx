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
  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  // const [donationTypes, setDonationTypes] = useState([
  //   { label: "Monetary", value: "monetary" },
  //   { label: "Physical", value: "physical" },
  // ]);

  const pendingDonations = shelterData.donations.filter(
    (donation) => donation.status === "Pending"
  );

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  }

  return (
    <View>
      <View style={Spacing.mainContainer}>
        {/* <SearchBar
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
        /> */}

        {currentUser.user_type === "Team Member" ? (
          <View style={styles.reviewDonationsContainer}>
            <HeaderTitle style={Spacing.widgetContainerText}>
              To Be Reviewed
            </HeaderTitle>
            {pendingDonations.length > 0 ? (
              <>
              <View style={[styles.flex, {paddingLeft: 15, alignItems: "baseline", gap: 10}]}>
                <HeaderTitle style={styles.pendingCount}>{pendingDonations.length.toString()}</HeaderTitle>
                <Text style={{ color: 'white'}}>Pending</Text>
              </View>
              <Button
                title="Manage"
                titleStyle={Buttons.boldText}
                buttonStyle={Buttons.primarySolid}
                onPress={() => {}}
                style={styles.reviewButton}
              />
            </>
            ) : (
              <Text style={Spacing.widgetContainerText}>No Donations To Review</Text>
            )}
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
          { backgroundColor: Colors.light.icon,
            height: '65%'
           },
        ]}
      >
        <View style={[styles.flex, {justifyContent: "space-between"}]}>
            <View>
              <HeaderTitle style={styles.donationsList}>Donations List</HeaderTitle>
              <Text style={{fontWeight: '500'}}>Count: {shelterData.donations.length}</Text>
            </View>
            
            <View style={[styles.flex, {justifyContent: "space-between"}]}>
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
            <Button
              icon={
                <Icon
                  name="search"
                  type="ionicon"
                  size={20}
                  color="white"
                />
              }
              buttonStyle={Buttons.primarySolid}
              onPress={toggleSearchBar}
            />
            </View>
        </View>
        
        {searchVisible && (
        <SearchBar
          placeholder="Search Donations..."
          platform="ios"
          onChangeText={setSearchQuery}
          value={searchQuery}
          containerStyle={Spacing.searchBarContainer}
          inputContainerStyle={Spacing.searchBarInputContainer}
          searchIcon={{
            name: "search",
            type: "ionicon",
            size: 24,
            color: Colors.light.icon,
          }}
        />
        )}


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
    boxShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
  },
  pendingCount: {
    color: "white",
    fontSize: 45,
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
  }
});
