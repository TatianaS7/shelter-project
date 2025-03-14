import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, ScrollView } from "react-native";
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Button } from "react-native-elements";
import { RadioButton } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { Fonts } from "@/constants/Fonts";
import { useApi } from "@/app/ApiContext";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { setActiveFilters } = useApi();
    const [showAll, setShowAll] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [statusOptions] = useState([
      "Pending",
      "Accepted",
      "Rejected",
      "Cancelled",
    ]);
  

  const handleSelectAll = () => {
    setShowAll(true);
    setTypeFilter(null);
    setStatusFilter(null);
    setActiveFilters({});
    onClose();
  };

  const handleSelectType = (type: string) => {
    setShowAll(false);
    setTypeFilter(type);
  };

  const handleSelectStatus = (status: string) => {
    setShowAll(false);
    setStatusFilter(status);
  };

  const handleApplyFilters = () => {
    const filters: { status?: string; donation_type?: string } = {};
    if (!showAll) {
      if (typeFilter) filters.donation_type = typeFilter;
      if (statusFilter) filters.status = statusFilter;
    }
    setActiveFilters(filters);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <HeaderTitle
            style={[Fonts.sectionTitle, { marginLeft: 0, color: "white" }]}
          >
            Filters
          </HeaderTitle>

          <ScrollView>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="All"
                status={showAll ? "checked" : "unchecked"}
                onPress={handleSelectAll}
                color={Colors.light.icon}
              />
              <Text style={styles.filterText}>All</Text>
            </View>

            <Divider style={styles.dividerStyle} />

            <HeaderTitle style={styles.headerTitle}>Donation Type</HeaderTitle>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="Monetary"
                status={typeFilter === "Monetary" ? "checked" : "unchecked"}
                onPress={() => handleSelectType("Monetary")}
                color={Colors.light.icon}
              />
              <Text style={styles.filterText}>Monetary</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="Physical"
                status={typeFilter === "Physical" ? "checked" : "unchecked"}
                onPress={() => handleSelectType("Physical")}
                color={Colors.light.icon}
              />
              <Text style={styles.filterText}>Physical</Text>
            </View>

            <Divider style={styles.dividerStyle} />

            <HeaderTitle style={styles.headerTitle}>
              Donation Status
            </HeaderTitle>
            {statusOptions.map((status) => (
              <View style={styles.radioButtonContainer} key={status}>
              <RadioButton
                value={status}
                status={statusFilter === status ? "checked" : "unchecked"}
                onPress={() => handleSelectStatus(status)}
                color={Colors.light.icon}
              />
              <Text style={styles.filterText}>{status}</Text>
            </View>
            ))}
          </ScrollView>

          <View style={styles.flexRow}>
            <Button
              title="Apply Filters"
              buttonStyle={[
                Buttons.primarySolid,
                { paddingLeft: 55, paddingRight: 55 },
              ]}
              onPress={handleApplyFilters}
            />
            <Button title="Reset" onPress={handleSelectAll} buttonStyle={[Buttons.primarySolid, {backgroundColor: 'red', paddingLeft: 40, paddingRight: 40}]}/>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    height: "auto",
    backgroundColor: "black",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  filterText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
  },
  headerTitle: {
    color: "white",
  },
  dividerStyle: {
    backgroundColor: Colors.light.icon,
    height: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
  }
});
