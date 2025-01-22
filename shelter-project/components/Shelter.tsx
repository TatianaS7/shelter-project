import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { useApi } from '../app/ApiContext'
import { Colors } from "../constants/Colors"
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button } from "react-native-elements";
import ParallaxScrollView from "./ParallaxScrollView";
import { Spacing } from "@/constants/Spacing";
import { Fonts } from "@/constants/Fonts";
import { Buttons } from "@/constants/Buttons";
 
export default function Shelter() {
    const { shelterData } = useApi();

    return (
    <View style={Spacing.mainContainer}>
       <View>
                <HeaderTitle style={{fontSize: 25}} numberOfLines={2}>
                    {shelterData.shelter_name}
                </HeaderTitle>
                <Text style={styles.shelterAddress}>{shelterData.address}</Text>
                <Text style={styles.shelterAddress}>{shelterData.city}, {shelterData.state} {shelterData.zip_code}</Text>
                <Text style={styles.shelterAddress}>{shelterData.phone}</Text>
        </View>

        <View style={styles.pageContent}>
            <View style={styles.containers}>
                <HeaderTitle>Reports</HeaderTitle>
                <Button title="Generate a Report" buttonStyle={Buttons.primarySolid} type="solid"/>
                <Button title="View Previous Reports" buttonStyle={Buttons.primarySolid} type="solid"/>
            </View>

            <Divider />

            <View style={styles.containers}>
                <HeaderTitle>Resources</HeaderTitle>
                <Button title="Add a Resource" buttonStyle={Buttons.primarySolid} type="solid"/>
                <Button title="View Resources" buttonStyle={Buttons.primarySolid} type="solid"/>
            </View>

            <Divider />

            <View style={styles.containers}>
                <HeaderTitle>Funding</HeaderTitle>
                <Button title="Update Funding" buttonStyle={Buttons.primarySolid} type="solid"/>
                <Button title="View Funding" buttonStyle={Buttons.primarySolid} type="solid"/>
            </View>
        </View>
    </View>
)}

const styles = StyleSheet.create({
    shelterAddress: {
        fontSize: 16,
        color: Colors.light.text,
        fontWeight: '500'
    },
    pageContent: {
        marginTop: 20,
    },
    containers: {
        marginTop: 20,
        gap: 10,
    }
})
