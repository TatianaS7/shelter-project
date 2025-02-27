import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Stack } from "expo-router";
import { useApi } from "../ApiContext";
import { Divider } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { HeaderTitle } from "@react-navigation/elements";
import { RadioButton } from "react-native-paper";
import ReportPreview from "@/components/ReportPreview";

export default function DownloadReportScreen() {
  const { currentUser, generatedReport } = useApi();
  const [fileType, setFileType] = useState("");


  return (
    <>
      <Stack.Screen
        options={{
            title: "Download Report"
        }}
      />

      <View style={styles.container}>
        <HeaderTitle style={styles.reportName}>{`${generatedReport.report_type} Report`}</HeaderTitle>
        <HeaderTitle>Generated by: </HeaderTitle>
        <Text>{currentUser.first_name} {currentUser.last_name}</Text>
        <HeaderTitle>Generated on: </HeaderTitle>
        <Text>{generatedReport.generated_at}</Text>

        <Divider style={styles.dividerStyle} />
        <HeaderTitle>Download as:</HeaderTitle>
        <View style={styles.flexRow}>
            <RadioButton
                value="pdf"
                status={fileType === "pdf" ? "checked" : "unchecked"}
                onPress={() => setFileType("pdf")}
                backgroundColor={Colors.light.background}
            />
            <Text>PDF</Text>
        </View>
        <View style={styles.flexRow}>
            <RadioButton
                value="xlsx"
                status={fileType === "xlsx" ? "checked" : "unchecked"}
                onPress={() => setFileType("xlsx")}
                backgroundColor={Colors.light.background}
            />
            <Text>Excel</Text>
        </View>

        <ReportPreview fileType={fileType} />
      </View>
      </>
  );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1,
    },
    reportName: {
        fontSize: 23,
        fontWeight: "bold",
        color: Colors.light.text,
        marginBottom: 20,
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    dividerStyle: {
        backgroundColor: Colors.light.icon,
        height: 2,
        marginTop: 15,
        marginBottom: 20,
    },

})