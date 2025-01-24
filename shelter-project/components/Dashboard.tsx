import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { HeaderTitle } from '@react-navigation/elements';
import { useApi } from '@/app/ApiContext'
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Divider, Icon } from "react-native-elements";
import { Spacing } from "@/constants/Spacing";
// import { useUtils } from "@/app/UtilsContext";

export default function Dashboard() {
    const { currentUser, shelterData, fetchUserData, fetchShelterData, formatDate } = useApi();
    // const { formatDate } = useUtils();
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date().toLocaleTimeString());

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const totalDonations = shelterData.donations
        .filter(donation => {
            const donationDate = new Date(donation.created_at);
            return donationDate.getMonth() === new Date().getMonth() && donationDate.getFullYear() === currentYear;
        })
        .reduce((sum, donation) => sum + donation.donation_amount, 0)
        .toFixed(2);

    const pendingPhysicalDonations = shelterData.donations.filter(donation => {
        const donationDate = new Date(donation.created_at);
        return donation.status === "Pending" && donation.donation_type === "Physical" && donationDate.getMonth() === new Date().getMonth() && donationDate.getFullYear() === currentYear;
    });

    const pendingMonetaryDonations = shelterData.donations.filter(donation => {
        const donationDate = new Date(donation.created_at);
        return donation.status === "Pending" && donation.donation_type === "Monetary" && donationDate.getMonth() === new Date().getMonth() && donationDate.getFullYear() === currentYear;
    });    
    
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
    
    const onRefresh = () => {
        setRefreshing(true);
        fetchUserData();
        fetchShelterData();
        setLastRefreshTime(new Date().toLocaleTimeString());
        setRefreshing(false);
    };

    useEffect(() => {
        onRefresh();
    }, [])

    
    return (
        <ScrollView
            contentContainerStyle={Spacing.mainContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.headerContainer}>
                <Text style={Fonts.pageTitle}>Overview</Text>
                <HeaderTitle style={{ fontSize: 17, fontWeight: '500' }}>{formattedDate}</HeaderTitle>
                {/* Update time and date to reflect last refresh  */}
                <Text style={{ fontWeight: '500', color: 'darkgrey'}}>Last Updated at {lastRefreshTime}</Text>
            </View>
            
            <Divider />

            <View id='widget-container' style={styles.widgetContainer}>
                <View style={styles.widgetRow}>
                    <View style={styles.containers}>
                        <HeaderTitle>Pending Donations</HeaderTitle>
                        <Text style={Fonts.lightWidgetText}>{pendingPhysicalDonations.length}</Text>
                        <Text>Physical</Text>
                        <Text style={Fonts.lightWidgetText}>{pendingMonetaryDonations.length}</Text>
                        <Text>Monetary</Text>
                    </View>

                    <View style={styles.darkWidget}>
                        <View style={styles.row}>
                            <HeaderTitle style={{ color: 'white' }}>Total Donations</HeaderTitle>
                        </View>
                        <Text style={Fonts.darkWidgetText}>${totalDonations}</Text>
                        <Text style={{color: 'white'}}>{currentMonth.toLocaleString('default', { month: 'long' })}</Text>
                    </View>

                </View>

                <View style={styles.widgetRow}>
                    <View style={styles.darkWidget}>
                        <HeaderTitle style={{ color: 'white' }}>Capacity</HeaderTitle>
                        <Text style={Fonts.lightWidgetText}> {shelterData.current_occupancy}</Text>
                        <Text style={Fonts.lightWidgetText}>/{shelterData.capacity}</Text>
                        <Text style={{ fontSize: 12, color: 'white', marginTop: 10 }}>Occupants</Text>
                    </View>

                    <View style={styles.recentDonationsWidget}>
                        <HeaderTitle style={{ marginBottom: 10}}>Recent Donations</HeaderTitle>
                        {shelterData.donations.filter(donation => {
                            const donationDate = new Date(donation.created_at);
                            return donationDate.getMonth() === new Date().getMonth() && donationDate.getFullYear() === currentYear;
                        }).map((donation, index) => (
                            <View key={index} style={styles.row}>                                
                                <Text style={{fontWeight: 400}}>{formatDate(donation.created_at)}</Text>
                                {donation.donation_type === "Physical" ? (
                                    <Text style={{fontWeight: "bold", color: Colors.light.icon}}>+ {donation.donated_items[0].quantity} {donation.donated_items[0].unit}(s) {donation.donated_items[0].resource_type}</Text>
                                ) : (
                                    <Text style={{fontWeight: "bold", color: Colors.light.icon}}>+ ${donation.donation_amount && donation.donation_amount.toFixed(2)}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.widgetRow}>
                    <View style={styles.containers}>
                        <HeaderTitle>Top Resource Needs</HeaderTitle>
                        {shelterData.resource_needs.filter(resource => {
                            return resource.priority === 1;
                        }).map((resource, index) => (
                            <View key={index} style={styles.row}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 25 }}>{resource.quantity}</Text> 
                                    <Text style={{ fontWeight: '500', fontSize: 10 }}>{resource.unit}s</Text>
                                </View>
                                <Text style={Fonts.lightWidgetText}>{resource.resource_type}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.darkWidget} >
                        <HeaderTitle style={{ color: 'white' }}>Finances</HeaderTitle>
                        <Text style={{ color: 'white' }}>Current Funding:</Text>
                        <Text style={Fonts.lightWidgetText}>${shelterData.current_funding.toLocaleString()}</Text>
                        <Text style={{ color: 'white' }}>Funding Needs:</Text>
                        <Text style={Fonts.lightWidgetText}>${shelterData.funding_needs.toLocaleString()}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 20,
    },
    widgetContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        gap: 20
    },
    widgetRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        justifyContent: 'space-between',
    },
    darkWidget: {
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        minHeight: 120,
        width: 'auto',
        padding: 10,
    },
    recentDonationsWidget: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        minHeight: 120,
        padding: 10,
        backgroundColor: 'white',
        width: '70%',
    },
    containers: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        minHeight: 120,
        width: 'auto',
        padding: 12,
        backgroundColor: 'white'
    },
    row: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 5,
        justifyContent: 'space-between'
    }
});