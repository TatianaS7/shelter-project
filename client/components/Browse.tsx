import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SearchBar, Button, Icon } from "react-native-elements";

import ShelterCard from "./ShelterCard";
import { useApi } from "../app/ApiContext";
import { Colors } from "../constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { HeaderTitle } from "@react-navigation/elements";
import { Fonts } from "@/constants/Fonts";

export default function Browse() {
  const { allShelters } = useApi();
  const [search, setSearch] = useState();
  const [filteredshelters, setFilteredShelters] = useState(allShelters);

  const filterShelters = (query: any) => {
    const lowercaseQuery = query.toLowerCase();
    const filltered = allShelters.filter(
      (shelter) =>
        shelter.shelter_name.toLowerCase().includes(lowercaseQuery) ||
        shelter.address.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredShelters(filltered);
  };

  const updateSearch = (search: any) => {
    setSearch(search);
    filterShelters(search);
  };

  return (
    <View style={styles.mainContainer}>
      <SearchBar
        placeholder="Search Shelters..."
        platform="ios"
        onChangeText={updateSearch}
        value={search}
        containerStyle={[Spacing.searchBarContainer, {marginLeft: 20, marginRight: 20}]}
        inputContainerStyle={Spacing.searchBarInputContainer}
        searchIcon={{
          name: "search",
          type: "ionicon",
          size: 24,
          color: Colors.light.icon,
        }}
      />

      <View style={styles.buttoncontainer}>
        <Button
          icon={<Icon name="list" color="white" />}
          buttonStyle={styles.viewTypeButton}
        ></Button>
        <Button
          icon={<Icon name="map" color="white" />}
          buttonStyle={styles.viewTypeButton}
        ></Button>
      </View>

      <View style={styles.backgroundContainer}>
        <HeaderTitle style={[Fonts.sectionTitle, styles.sectionTitle]}>
          Shelters
        </HeaderTitle>
        <Text style={{ fontWeight: 500, marginLeft: 20 }}>
          Result(s): {filteredshelters.length}
        </Text>
        <ShelterCard shelters={filteredshelters} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "black",
    paddingTop: 20,
  },
  buttoncontainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 10,
  },
  backgroundContainer: {
    backgroundColor: Colors.light.tint,
    height: "100%",
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
  },
  sectionTitle: {
    marginTop: 20,
  },
  viewTypeButton: {
    backgroundColor: "none",
  },
});
