import { useApi } from "@/app/ApiContext";
import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { Colors } from "@/constants/Colors";
import { Buttons } from "@/constants/Buttons";

export default function ReportPreview({ fileType }) {
  const { generatedReport, reportFilePath, downloadReport, loading } = useApi();

  useEffect(() => {
    if (fileType && !reportFilePath && generatedReport.id) {
      // If the file path is not yet available, initiate the downloadReport API call
      downloadReport(generatedReport.id, fileType);
    }
  }, [fileType, reportFilePath, generatedReport.id]); // Only re-run if fileType changes


  const handleDownload = () => {
    if (generatedReport.id) {
      downloadReport(generatedReport.id, fileType);
    } else {
      Alert.alert("Error", "Report not available.");
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {fileType === "pdf" && (
        <View>
          <Button
            title={loading ? "Downloading..." : "Download PDF"}
            onPress={handleDownload}
            disabled={loading || !generatedReport.id}
            buttonStyle={[Buttons.primarySolid, { justifyContent: "center" }]}
          />
        </View>
      )}

      {fileType === "xlsx" && (
        <Button
          title="Download Excel"
          onPress={() => {}}
          disabled={true}
          buttonStyle={[Buttons.primarySolid, { justifyContent: "center" }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 30,
  },
});
