import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button, SearchBar } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker"

import { useApi } from '../app/ApiContext'
import { Colors } from "@/constants/Colors"
import { Buttons } from "@/constants/Buttons";
import { Spacing } from "@/constants/Spacing";
import { Fonts } from "@/constants/Fonts";
 
export default function Donations() {
        const { currentUser, shelterData } = useApi()
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState(null);
        const [donationTypes, setDonationTypes] = useState([
            { label: 'Monetary', value: 'monetary' },
            { label: 'Physical', value: 'physical' }
        ]);
    
    return (
        <View>
        <View style={Spacing.mainContainer}>
            <HeaderTitle style={Fonts.pageTitle}>Donations</HeaderTitle>

            <SearchBar
                placeholder="Search Donations..."
                platform="ios"
                onChangeText={() => {}}
                value=""
                containerStyle={Spacing.searchBarContainer}
                inputContainerStyle={Spacing.searchBarInputContainer}
                searchIcon={{ name: "search", type: 'ionicon', size: 24, color: Colors.light.icon}}
            />


            <View>
                <HeaderTitle>Filters</HeaderTitle>
                <View>
                    <Text>Donation Type</Text>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={donationTypes}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setDonationTypes}
                    />
                </View>

            </View>

            {currentUser.user_type === 'Team Member' ? (
                <View style={styles.reviewDonationsContainer}>
                    <HeaderTitle style={Spacing.widgetContainerText}>To Be Reviewed</HeaderTitle>
                    <Button
                        title="Review Donations"
                        buttonStyle={Buttons.primarySolid}
                        onPress={() => {}}
                        style={styles.reviewButton}
                    />

                    {shelterData.donations.filter(donation => donation.status === 'Pending').map(donation => (
                        <View style={{backgroundColor: 'white'}} key={donation.id}>
                            <Text>{donation.donation_type} Donation</Text>
                        </View>
                    ))}

                </View>
            ) : currentUser.user_type === 'Donor' && (
                <View>
                    <Button
                        title="Add Donation"
                        buttonStyle={Buttons.blackSolid}
                        onPress={() => {}}
                    />
                </View>
            )}

            <View>
            </View>

        </View>
        
        <View style={[Spacing.roundedContainer, { backgroundColor: Colors.light.icon}]}>
            <HeaderTitle style={Spacing.widgetContainerText}>Donations List</HeaderTitle>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    reviewDonationsContainer: {
        backgroundColor: "black",
        height: 'auto',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    reviewButton: {
        width: 'auto',
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: 20,
    },
})