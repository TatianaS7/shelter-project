import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ManageDonations from "@/components/ManageDonations";

const Stack = createStackNavigator();

export default function DonationsStack() {
  return (
    <Stack.Navigator 
      initialRouteName="ManageDonations"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ManageDonations" component={ManageDonations} />
    </Stack.Navigator>
  );
}
