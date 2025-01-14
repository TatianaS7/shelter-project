import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { SearchBar } from "react-native-elements";

import ShelterCard from "./ShelterCard";
import { useApi } from '../app/ApiContext'
import { Colors } from "../constants/Colors"
import { Spacing } from "@/constants/Spacing";
 

export default function Browse() {
    const { allShelters } = useApi();
    const [search, setSearch] = useState();
    const [filteredshelters, setFilteredShelters] = useState(allShelters);

    const filterShelters = (query: any) => {
        const lowercaseQuery = query.toLowerCase();
        const filltered = allShelters.filter(shelter =>
            shelter.shelter_name.toLowerCase().includes(lowercaseQuery) ||
            shelter.address.toLowerCase().includes(lowercaseQuery)
        );
        setFilteredShelters(filltered)
    };
    
      const updateSearch = (search: any) => {
        setSearch(search);
        filterShelters(search);
      };
    
    return (
        <>
            <SearchBar 
                placeholder="Search Shelters..."
                platform="ios"
                onChangeText={updateSearch}
                value={search}
                containerStyle={Spacing.searchBarContainer}
                inputContainerStyle={Spacing.searchBarInputContainer}
                searchIcon={{ name: "search", type: 'ionicon', size: 24, color: Colors.light.icon}}
            />

            <View style={styles.buttoncontainer}>
                <Button title="List View"></Button>
                <Button title="Map View"></Button>
            </View>

            <ShelterCard shelters={filteredshelters}/>
        </>
    )
}


const styles = StyleSheet.create({
    buttoncontainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    }
  });
  
