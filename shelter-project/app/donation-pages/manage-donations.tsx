import React, {useState} from "react";
import {
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Text,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";

import { useApi } from "../ApiContext";
import { Icon, Button } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { Stack } from "expo-router";

export default function ManageDonations() {
    const { currentDonationData } = useApi();

  return (
    <>
    <Stack.Screen
        options={{
            title: "Manage Donation",
            headerStyle: {
            backgroundColor: Colors.light.tint,
            },
            headerTintColor: Colors.light.background,
            headerTitleStyle: {
            fontWeight: "bold",
            },
        }}
        />
        <View style={styles.container}>
          <Text>Manage Donation</Text>

          <Text>{currentDonationData?.note}</Text>
          <Text>{currentDonationData?.donation_amount}</Text>
          <Text>{currentDonationData?.donated_items}</Text>
          <Text>{currentDonationData?.status}</Text>
          <Text>{currentDonationData?.created_at}</Text>
          <Text>{currentDonationData?.donation_type}</Text> 
          <Text>{currentDonationData?.shelter_id}</Text>
          <Text>{currentDonationData?.user_id}</Text>

        </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: Colors.light.tint,
    },
});
