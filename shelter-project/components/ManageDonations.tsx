import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button, SearchBar } from "react-native-elements";

import { useApi } from '../app/ApiContext'
import { Colors } from "@/constants/Colors"
import { Buttons } from "@/constants/Buttons";
import { Spacing } from "@/constants/Spacing";
import { Fonts } from "@/constants/Fonts";
import DonationCard from "@/components/DonationCard";
 
export default function ManageDonations() {
    return (
        <View style={Spacing.mainContainer}>
            <HeaderTitle>Manage Donations</HeaderTitle>

            <HeaderTitle>Pending Donations</HeaderTitle>
            <DonationCard />
        </View>
    );
}
