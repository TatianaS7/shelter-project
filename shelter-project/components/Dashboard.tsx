import React from "react";
import { StyleSheet, Image, Platform, View, Text } from 'react-native';
import { HeaderTitle } from '@react-navigation/elements';


export default function Dashboard() {
    return (
        <>
            <View id='shelter-information' style={styles.shelterInformation}>
                <HeaderTitle style={{fontSize: 25}}>Shelter Name</HeaderTitle>
                <Text>Shelter Location</Text>
            </View>

            <View id='widget-container' style={styles.widgetContainer}>
                <View id='capacity-widget' style={styles.containers}>
                    <HeaderTitle>Capacity</HeaderTitle>
                </View>
                <View id='donations-widget' style={styles.containers}>
                    <HeaderTitle>Donations</HeaderTitle>
                </View>
                <View id='finances-widget' style={styles.containers} >
                    <HeaderTitle>Finances</HeaderTitle>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    shelterInformation: {
        margin: 20
    },
    widgetContainer: {
        margin: 20,
        gap: 10
    },
    containers: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        minHeight: 120,
        padding: 10,
        backgroundColor: 'white'
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
