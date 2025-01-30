import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, Card } from "react-native-elements";
import { useApi } from "../app/ApiContext";
import { Buttons } from "@/constants/Buttons";
import { Colors } from "@/constants/Colors";

export default function ShelterCard() {
  const { allShelters } = useApi();

  return (
    <View style={styles.container}>
      {allShelters.map((shelter, idx) => (
        <Card key={idx} containerStyle={styles.shelterCard}>
          <View style={styles.flex}>
            <Card.Title style={styles.shelterName}>
              {shelter.shelter_name}
            </Card.Title>
            <Button
              icon={{ name: "bookmark", color: "lightgrey" }}
              type="solid"
              buttonStyle={{ backgroundColor: "none" }}
            />
          </View>
          <Text>
            {shelter.city}, {shelter.state}{" "}
            {shelter.zip_code}
          </Text>
          <Card.Divider style={{ marginTop: 15}}/>
          <Button
            title="View"
            titleStyle={styles.viewButtonText}
            buttonStyle={styles.viewButton}
            onPress={() => console.log(shelter.shelter_name)}
          />
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
    marginTop: 5,
  },
  shelterButton: {
    backgroundColor: "white",
    justifyContent: "flex-start",
    padding: 0,
  },
  shelterCard: {
    borderRadius: 10,
    margin: 5,
  },
  shelterName: {
    fontSize: 19,
  },
  viewButton: {
    backgroundColor: "none",
    height: 'auto'
  },
  viewButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
