import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider } from "react-native-elements";

import { Colors } from "@/constants/Colors";
// import { useUtils } from "@/app/UtilsContext";
import { useApi } from "@/app/ApiContext";

export default function DonationCard() {
  const {
    formatDate,
    filteredDonations
  } = useApi();

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "lightgrey";
      case "Accepted":
        return "lightgreen";
      case "Rejected":
        return "red";
      case "Cancelled":
        return "red";
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.flex}>
        <HeaderTitle>Date</HeaderTitle>
        <HeaderTitle>Item</HeaderTitle>
        <HeaderTitle>Type</HeaderTitle>
        <HeaderTitle>Status</HeaderTitle>
      </View>

      <Divider style={{ backgroundColor: "white", height: 2, marginTop: 10 }} />

      <ScrollView style={styles.donationsContainer}>
        {filteredDonations.map((donation, index) => (
          <View key={index} style={styles.donationCard}>
            <View style={styles.flex}>
              <Text style={styles.donationCardText}>
                {formatDate(donation.created_at)}
              </Text>
              <Text style={styles.donationCardText}>
                {donation.donation_type === "Monetary"
                  ? "+ $" + donation.donation_amount
                  : donation.donated_items[0].resource_type}
              </Text>
              <Text style={styles.donationCardText}>
                {donation.donation_type}
              </Text>
              <Text
                style={[
                  styles.donationStatus,
                  {
                    backgroundColor: getStatusBackgroundColor(donation.status),
                  },
                ]}
              >
                {donation.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  donationsContainer: {
    marginTop: 10,
    flex: 1,
    marginBottom: 20,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  donationCard: {
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 10,
    boxShadow: "0px 6px 6px rgba(0, 0, 0, 0.25)",
    marginBottom: 15,
  },
  donationCardText: {
    fontWeight: "bold",
  },
  donationStatus: {
    fontWeight: "bold",
    padding: 4,
    borderRadius: 5,
  },
});
