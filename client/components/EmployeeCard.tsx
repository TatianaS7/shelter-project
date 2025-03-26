import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useApi } from "../app/ApiContext";
import { Icon, Button } from "react-native-elements";
import { Colors } from "@/constants/Colors";

export default function EmployeeCard() {
  const { shelterData } = useApi();

  return (
    <ScrollView>
      {shelterData.staff.map((staffMember, index) => (
        <View key={index} style={[styles.employeeCard, styles.row]}>
          <Icon name="person" color={Colors.light.icon} size={50} />

          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>
              {staffMember.first_name} {staffMember.last_name}
            </Text>
            {staffMember.user_role === "Admin" ? (
              <Button
                title={"Admin"}
                titleStyle={{ fontSize: 13, fontWeight: "bold" }}
                buttonStyle={[styles.userRole, { backgroundColor: "black" }]}
              >
                {staffMember.user_role}
              </Button>
            ) : (
              <Button
                title={staffMember.user_role}
                titleStyle={{ fontSize: 13, fontWeight: "bold" }}
                buttonStyle={[
                  styles.userRole,
                  { backgroundColor: Colors.light.tint },
                ]}
              >
                {staffMember.user_role}
              </Button>
            )}
            {/* <Text>{staffMember.email}</Text> */}
          </View>

          <View style={styles.chevronContainer}>
            <Button
              icon={
                <Icon
                  name="chevron-right"
                  color={Colors.light.icon}
                  size={30}
                />
              }
              type="clear"
              onPress={() => {
                alert(
                  `View details for ${staffMember.first_name} ${staffMember.last_name}`
                );
              }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  employeeCard: {
    padding: 10,
    backgroundColor: Colors.light.background,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 5,
  },
  userRole: {
    borderRadius: 5,
    color: "white",
    padding: 0,
    width: 70,
  },
  chevronContainer: {
    justifyContent: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
