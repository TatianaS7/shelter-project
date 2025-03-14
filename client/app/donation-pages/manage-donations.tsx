import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { useApi } from "../ApiContext";
import { Icon, Button } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { Stack } from "expo-router";
import { HeaderTitle } from "@react-navigation/elements";
import { Fonts } from "@/constants/Fonts";
import { router } from "expo-router";


export default function ManageDonations() {
  const {
    currentDonationData,
    getStatusBackgroundColor,
    updateDonationStatus,
    currentUser,
  } = useApi();

  function handleDonationUpdate(action: string, donationID: number) {
    updateDonationStatus(action, donationID);
    // setCurrentDonationID(null);
    // setCurrentDonationData(null);
    router.back();
  }

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
        <HeaderTitle style={Fonts.pageTitle}>Donation Details</HeaderTitle>
        <Text style={Fonts.mutedText}>Review and manage this donation</Text>

        <View style={styles.donationDetailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID:</Text>
            <Text style={styles.detailValue}>{currentDonationData?.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Received On:</Text>
            <Text style={styles.detailValue}>
              {currentDonationData?.created_at}
            </Text>
          </View>
          {currentDonationData?.donation_amount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>
                ${currentDonationData.donation_amount}
              </Text>
            </View>
          )}
              {currentDonationData?.donation_type === "Physical" && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Donated Items:</Text>
                    {currentDonationData.donated_items.map((item, idx) => (
                      <Text key={idx} style={styles.detailValue}>
                        {item.quantity} {item.unit} {item.resource_type}
                      </Text>
                    ))}
                  </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text
              style={[
                Buttons.donationStatus,
                {
                  backgroundColor: getStatusBackgroundColor(
                    currentDonationData?.status
                  ),
                },
              ]}
            >
              {currentDonationData?.status}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Donation Type:</Text>
            <Text style={styles.detailValue}>
              {currentDonationData?.donation_type}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Donor:</Text>
            <Text style={styles.detailValue}>
              {currentDonationData?.user_id}
            </Text>
          </View>
          {currentDonationData?.note && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Note:</Text>
              <Text style={styles.detailValue}>{currentDonationData.note}</Text>
            </View>
          )}
        </View>

        {/* <HeaderTitle style={{ textAlign: "center" }}>Actions</HeaderTitle> */}

        {currentUser.user_type === "Team Member" && (
          <View style={styles.actionsContainer}>
            <Button
              title="Reject"
              onPress={() => handleDonationUpdate("Rejected", currentDonationData?.id)}
              buttonStyle={[Buttons.warningSolid, styles.actionButton]}
              titleStyle={Buttons.warningSolid}
              icon={<Icon name="close" size={15} color="red" />}
              type="outline"
            />

            <Button
              title="Accept"
              onPress={() => {
                handleDonationUpdate("Accepted", currentDonationData?.id);
              }}
              buttonStyle={[Buttons.successSolid, styles.actionButton]}
              titleStyle={Buttons.successSolid}
              icon={<Icon name="check" size={15} color="green" />}
              type="outline"
            />
          </View>
        )}

        {currentUser.user_type === "Donor" && (
          <View style={styles.actionsContainer}>
            <Button
              title="Cancel"
              onPress={() => {
                handleDonationUpdate("Cancelled", currentDonationData?.id); // TODO: Fix this
              }}
              buttonStyle={[Buttons.warningSolid, styles.actionButton]}
              titleStyle={Buttons.warningSolid}
              icon={<Icon name="close" size={15} color="red" />}
              type="outline"
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    height: "100%",
  },
  donationDetailsContainer: {
    marginTop: 20,
    borderTopColor: Colors.light.tint,
    borderTopWidth: 1,
    paddingTop: 20,
    marginBottom: 20,
    borderBottomColor: Colors.light.tint,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  donationID: {
    fontWeight: "500",
    fontSize: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  actionButton: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  detailLabel: {
    fontWeight: "700",
    color: Colors.light.text,
  },
  detailValue: {
    color: Colors.light.text,
    fontWeight: "500",
  },
});
