import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput } from "react-native";
import { Stack } from "expo-router";
import { useApi } from "../ApiContext";
import { Button, Divider } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";
import { router } from "expo-router";
import { HeaderTitle } from "@react-navigation/elements";
import DatePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton, Checkbox } from "react-native-paper";

export default function GenerateReportScreen() {
  const { currentUser, generateReport, shelterData } = useApi();

  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //   Filter State
  const [showAll, setShowAll] = useState(true);
  const [donationType, setDonationType] = useState<string | null>(null);
  const [minAmount, setMinAmount] = useState<number | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [statusOptions] = useState([
    "Pending",
    "Accepted",
    "Rejected",
    "Cancelled",
  ]);
  const [donatedItems, setDonatedItems] = useState<string[]>([]);
  const [donatedItemOptions] = useState([
    "Food",
    "Clothing",
    "Hygiene",
    "Blankets",
    "Water",
    "Medicine",
    "Other",
  ]);
  const [error, setError] = useState<string | null>(null);

  // Function to format the date into YYYY-MM-DD format
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure month is 2 digits
    const day = date.getDate().toString().padStart(2, "0"); // Ensure day is 2 digits
    return `${year}-${month}-${day}`;
  };

  const handleGenerateReport = () => {
    if (!reportType || !startDate || !endDate) {
      setError("Please fill out all required fields.");
      return;
    }
  
    const reportData = {
      report_type: reportType, 
      user_id: currentUser.id, 
      start_date: formatDate(startDate),
      end_date: formatDate(endDate), 
      shelter_id: shelterData.shelter_id, 
      status: status, 
      donation_type: donationType, 
      donated_items: donatedItems,
      donation_min_amount: minAmount,
      donation_max_amount: maxAmount, 
    };
      
    console.log("Report Data:", reportData);
  
    // Proceed to generate report
    generateReport(reportData);
    router.navigate("/shelter-pages/download-report");
  };
  
  const handleShowAll = () => {
    setShowAll(true);
    setDonationType(null);
    setMinAmount(null);
    setMaxAmount(null);
    setStatus(null);
    setDonatedItems([]);
  };

  const handleDonationType = (type: string) => {
    setShowAll(false);
    setDonationType(type);
  };

  const handleDonatedItems = (item: string) => {
    if (donatedItems && donatedItems.includes(item)) {
      setDonatedItems((donatedItems || []).filter((i) => i !== item));
    } else {
      setDonatedItems([...(donatedItems || []), item]);
    }
  };

  const handleStatus = (status: string) => {
    setShowAll(false);
    setStatus(status);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Generate Report",
          headerStyle: {
            backgroundColor: Colors.light.tint,
          },
          headerTintColor: Colors.light.background,
          
        }}
      />

      {/* Report Type Dropdown */}
      <View style={styles.mainContainer}>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
        <View>
          <Text style={styles.label}>Report Type</Text>
          <DropDownPicker
            items={[
              { label: "Select Report Type", value: "" },
              { label: "Shelter Resources", value: "Shelter Resources" },
              { label: "Shelter Summary", value: "Shelter Summary" },
              { label: "Shelter Donations", value: "Shelter Donations" },
            ]}
            value={reportType}
            containerStyle={styles.dropdown}
            onChangeValue={(value) => setReportType(value)}
            dropDownContainerStyle={styles.dropdownList}
            placeholder="Select Report Type"
            multiple={false}
            setValue={setReportType}
            open={open}
            setOpen={setOpen}
          />
        </View>

        {/* Start Date Picker */}
        <View style={styles.flexRow}>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.label}>End Date</Text>
        </View>
        <View style={styles.flexRow}>
          <DatePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setStartDate(selectedDate || startDate);
            }}
          />

          {/* End Date Picker */}
          <DatePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setEndDate(selectedDate || endDate);
            }}
          />
        </View>

        <Divider style={styles.dividerStyle} />
        <ScrollView contentContainerStyle={styles.container}>
          {/* Filters */}
          <View>
            {reportType !== "Shelter Summary" && reportType !== "" && (
              <>
                <Text style={styles.label}>Filters</Text>

                <View style={styles.selectionContainer}>
                  <RadioButton
                    value="All"
                    status={showAll ? "checked" : "unchecked"}
                    onPress={handleShowAll}
                    color={Colors.light.icon}
                    backgroundColor={Colors.light.background}
                  />
                  <Text>All</Text>
                </View>

                <Divider style={styles.dividerStyle} />
              </>
            )}
          </View>

          {reportType === "Shelter Resources" && (
            <>
              <HeaderTitle>Quantity Needed</HeaderTitle>
              <TextInput
                style={[styles.input, { width: "100%" }]}
                placeholder="10"
                inputMode="numeric"
              />
              <Divider style={styles.dividerStyle} />
            </>
          )}

          {reportType === "Shelter Donations" && (
            <>
              <HeaderTitle>Donation Type</HeaderTitle>
              <View style={styles.selectionContainer}>
                <RadioButton
                  value="Monetary"
                  status={donationType === "Monetary" ? "checked" : "unchecked"}
                  onPress={() => handleDonationType("Monetary")}
                  color={Colors.light.icon}
                  backgroundColor={Colors.light.background}
                />
                <Text>Monetary</Text>

                <RadioButton
                  value="Physical"
                  status={donationType === "Physical" ? "checked" : "unchecked"}
                  onPress={() => handleDonationType("Physical")}
                  color={Colors.light.icon}
                  backgroundColor={Colors.light.background}
                />
                <Text>Physical</Text>
              </View>

              <Divider style={styles.dividerStyle} />

              {donationType === "Monetary" && (
                <>
                  <View>
                    <HeaderTitle>Donation Amount</HeaderTitle>
                    <View style={styles.flexRow}>
                      <Text>Min Amount</Text>
                      <Text>Max Amount</Text>
                    </View>

                    <View style={styles.flexRow}>
                      <Text style={Buttons.boldText}>$</Text>
                      <TextInput
                        style={styles.input}
                        value={minAmount}
                        onChangeText={setMinAmount}
                        placeholder="60.00"
                        inputMode="numeric"
                      />
                      <Text style={Buttons.boldText}>$</Text>
                      <TextInput
                        style={styles.input}
                        value={maxAmount}
                        onChangeText={setMaxAmount}
                        placeholder="100.00"
                        inputMode="numeric"
                      />
                    </View>
                  </View>
                  <Divider style={styles.dividerStyle} />
                </>
              )}
              {donationType === "Physical" && (
                <>
                  <HeaderTitle>Donated Items</HeaderTitle>
                  <View
                    style={[styles.selectionContainer, { flexWrap: "wrap" }]}
                  >
                    {donatedItemOptions.map((item) => (
                      <View key={item} style={styles.selectionContainer}>
                        <Checkbox
                          status={donatedItems &&
                            donatedItems.includes(item)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => handleDonatedItems(item)}
                          color={Colors.light.icon}
                          backgroundColor={Colors.light.background}
                        />
                        <Text>{item}</Text>
                      </View>
                    ))}
                  </View>
                  <Divider style={styles.dividerStyle} />
                </>
              )}
            </>
          )}

          <View>
            <HeaderTitle>Status</HeaderTitle>
            {statusOptions.map((option) => (
              <View key={option} style={styles.selectionContainer}>
                <RadioButton
                  value={option}
                  status={status === option ? "checked" : "unchecked"}
                  onPress={() => handleStatus(option)}
                  color={Colors.light.icon}
                  backgroundColor={Colors.light.background}
                />
                <Text>{option}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Generate Report Button */}
        <View style={styles.buttonContainer}>
          <Divider style={styles.dividerStyle} />
          <Button
            title={"Generate Report"}
            buttonStyle={[Buttons.primarySolid, styles.generateButton]}
            onPress={handleGenerateReport}
            disabled={!reportType}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    margin: 20,
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    marginBottom: 20,
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  input: {
    height: 40,
    width: "40%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 30,
  },
  dividerStyle: {
    backgroundColor: Colors.light.icon,
    height: 2,
    marginTop: 15,
    marginBottom: 10,
  },
  generateButton: {
    width: "100%",
    justifyContent: "center",
  },
});
