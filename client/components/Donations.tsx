import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button, SearchBar } from "react-native-elements";

import { useApi } from "../app/ApiContext";
// import { useUtils } from "@/app/UtilsContext";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { Spacing } from "@/constants/Spacing";
import DonationCard from "./DonationCard";
import FilterModal from "./FilterModal";

export default function Donations() {
  const { currentUser, shelterData, pendingDonations, filteredDonations, activeFilters} = useApi();
  const [openFilter, setOpenFilter] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSearchBar = () => {
    setSearchVisible(!searchVisible);
  }

  const handleOpenFilter = () => {
    setOpenFilter(true);
  }

  const handleCloseFilter = () => {
    setOpenFilter(false);
  }

  const activeFiltersText = Object.values(activeFilters)
  .filter(value => value)
  .join(", ")

  return (
    <View>
      <View style={Spacing.mainContainer}>

        {currentUser.user_type === "Team Member" ? (
          <View style={styles.reviewDonationsContainer}>
            <HeaderTitle style={Spacing.widgetContainerText}>
              Pending Donations
            </HeaderTitle>
            {pendingDonations.length > 0 ? (
              <>
              <View style={[styles.flex, {margin: 15, justifyContent: "space-evenly"}]}>
              <View>
                <HeaderTitle style={styles.pendingCount}>{pendingDonations.length.toString()}</HeaderTitle>
                <Text style={{ color: 'white'}}>Pending</Text>
              </View>
              <Divider style={{ backgroundColor: "white", height: 1, margin: 10 }} />
              <View style={{marginBottom: 15}}>
                <HeaderTitle style={styles.pendingCount}>
                  {`$${pendingDonations
                    .filter((donation) => donation.donation_type === "Monetary")
                    .reduce((total, donation) => total + donation.donation_amount, 0)
                    .toFixed(2)}`}
                </HeaderTitle>
                <Text style={{ color: 'white'}}>Total Amount</Text>
              </View>
              </View>
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
              <HeaderTitle style={styles.donationsList}>Donations Log</HeaderTitle>
              <Text style={{fontWeight: '500'}}>Result(s): {filteredDonations.length}</Text>
              {(activeFilters.donation_type || activeFilters.status) && (
                <Text style={{fontWeight: '500'}}>Filters: {activeFiltersText}</Text>
              )}            
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
                onPress={() => {setOpenFilter(true)}}
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

        {filteredDonations.length === 0 ? (
          <Text style={styles.noDonationsError}>No Donations Found!</Text>
        ) : (
          <DonationCard />
        )}

        {openFilter && (
          <FilterModal isOpen={openFilter} onClose={handleCloseFilter}/>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewDonationsContainer: {
    backgroundColor: "black",
    height: 170,
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
    marginTop: 10,
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
  },
  noDonationsError: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  }
});
