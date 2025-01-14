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
 
export default function DonationCard() {
    const { formatDate, currentUser, shelterData } = useApi()
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.donationsContainer}>
            <View style={styles.flex}>
                <HeaderTitle>Date</HeaderTitle>
                <HeaderTitle>Item</HeaderTitle>
                <HeaderTitle>Type</HeaderTitle>
                <HeaderTitle>Status</HeaderTitle>
            </View>

            <Divider style={{ backgroundColor: "white", height: 2 }} />

            {currentUser.user_type === 'Donor' ? (
                currentUser.donations.map((donation, index) => (
                    <View key={index} style={styles.donationCard}>
                        <Text>{formatDate(donation.created_at)}</Text>
                        <Text>{donation.donation_type === 'Monetary' ? '+ $' + donation.donation_amount: 
                            donation.donated_items[0].resource_type}</Text>
                        <Text>{donation.donation_type}</Text>
                        <Text style={styles.donationStatus}>{donation.status}</Text>
                    </View>
                ))
            ) : currentUser.user_type === 'Team Member' && (
                shelterData.donations.map((donation, index) => (
                    <View key={index} style={styles.donationCard}>
                        <View style={styles.flex}>
                            <Text>{formatDate(donation.created_at)}</Text>
                            <Text>{donation.donation_type === 'Monetary' ? '+ $' + donation.donation_amount: 
                            donation.donated_items[0].resource_type}</Text>
                            <Text >{donation.donation_type}</Text>
                            <Text style={styles.donationStatus}>{donation.status}</Text>
                        </View>
                    </View>
                ))
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    donationsContainer: {
        gap: 15,
        // marginLeft: 15,
        // marginRight: 15,
        overflow: 'scroll',
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    donationCard: {
        backgroundColor: Colors.light.background,
        padding: 15,
        borderRadius: 10
    },
    donationStatus: {
        fontWeight: 'bold',
    }
})