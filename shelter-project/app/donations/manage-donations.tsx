import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button, SearchBar } from "react-native-elements";

import { useApi } from "../ApiContext";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { Spacing } from "@/constants/Spacing";
import { Fonts } from "@/constants/Fonts";
import DonationCard from "../../components/DonationCard";
import ManageDonations from "@/components/ManageDonations";

export default function ManageDonationsScreen() {
  const { currentUser, shelterData } = useApi();

  return (
    <View>
      <HeaderTitle>Manage Donations</HeaderTitle>
      <ManageDonations />
    </View>
  );
}