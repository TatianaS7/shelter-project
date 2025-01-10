import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { useApi } from '../app/ApiContext'
import { Colors } from "../constants/Colors"
import { HeaderTitle } from "@react-navigation/elements";
import { Divider, Icon, Button } from "react-native-elements";
import ParallaxScrollView from "./ParallaxScrollView";
 
export default function Profile() {
        const { currentUser } = useApi()
    
    return (
        // <ParallaxScrollView>
            <View style={styles.mainContainer}>
                <View style={styles.detailsContainer}>
                    <Icon name="person" color="white" size={95} />
                    <HeaderTitle style={styles.userName}>{currentUser.first_name} {currentUser.last_name}</HeaderTitle>
                    <Text style={styles.userEmail}>{currentUser.email}</Text>

                    <Text style={styles.userType}>{currentUser.user_type}</Text>
                    {currentUser.user_role && (
                        <Text style={styles.userRole}>{currentUser.user_role}</Text>
                    )}
                </View>

                <View style={styles.optionsContainer}>
                    {currentUser.user_type === 'Donor' ? (
                        <HeaderTitle>Settings</HeaderTitle>
                    ) : (
                        <HeaderTitle>General</HeaderTitle>
                    )}

                        <Button  
                            title="Edit Profile"
                            titleStyle={{ 
                                color: Colors.light.text,
                                marginLeft: 10,
                                fontWeight: 500,
                            }}
                            type="outline"
                            icon={<Icon name="edit" color={Colors.light.icon} />}
                            buttonStyle={styles.button}>
                        </Button>
                        <Button 
                            title="Change Password"
                            titleStyle={{ 
                                color: Colors.light.text,
                                marginLeft: 10,
                                fontWeight: 500,
                            }}
                            type="outline"
                            icon={<Icon name="lock" color={Colors.light.icon} />}
                            buttonStyle={styles.button}>
                        </Button>

                        <Divider />

                        {currentUser.user_type === 'Donor' ? (
                            <>                    
                                <Button
                                    title="Payment Methods"
                                    titleStyle={{ 
                                        color: Colors.light.text,
                                        marginLeft: 10,
                                        fontWeight: 500,
                                    }}
                                    type="outline"
                                    icon={<Icon name="payment" color={Colors.light.icon} />}
                                    buttonStyle={styles.button}>    
                                </Button>

                                <Button 
                                title="Saved Shelters"
                                titleStyle={{ 
                                    color: Colors.light.text,
                                    marginLeft: 10,
                                    fontWeight: 500,
                                }}
                                type="outline"
                                icon={<Icon name="bookmark" color={Colors.light.icon} />}
                                buttonStyle={styles.button}>
                                </Button>

                                <Button
                                    title="Tax Information"
                                    titleStyle={{ 
                                        color: Colors.light.text,
                                        marginLeft: 10,
                                        fontWeight: 500,
                                    }}
                                    type="outline"
                                    icon={<Icon name="receipt" color={Colors.light.icon} />}
                                    buttonStyle={styles.button}>
                                </Button>
        
                            </>
                        ) : (
                            <>
                            <HeaderTitle>Shelter Settings</HeaderTitle>
                            <Button
                                title="Shelter Information"
                                titleStyle={{ 
                                    color: Colors.light.text,
                                    marginLeft: 10,
                                    fontWeight: 500,
                                }}
                                type="outline"
                                icon={<Icon name="info" color={Colors.light.icon} />}
                                buttonStyle={styles.button}>
                            </Button>
                            <Button
                                title="Team Members"
                                titleStyle={{ 
                                    color: Colors.light.text,
                                    marginLeft: 10,
                                    fontWeight: 500,
                                }}
                                type="outline"
                                icon={<Icon name="people" color={Colors.light.icon} />}
                                buttonStyle={styles.button}>
                            </Button>
                            </>
                            )
                        }
                    <Divider />

                    <Button 
                        title="Sign Out" 
                        titleStyle={{ color: 'white', fontWeight: 500 }}
                        type="solid"
                        buttonStyle={{
                            backgroundColor: 'red',
                            height: 50
                        }}>
                    </Button>
                </View>
            </View>
        // </ParallaxScrollView>
    )}

    const styles = StyleSheet.create({
        mainContainer: {
            backgroundColor: Colors.light.tint,
        },
        userName: {
            fontSize: 25,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'white',
        },
        userType: {
            fontSize: 17,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'white'
        },
        userRole: {
            fontSize: 17,
            textAlign: 'center',
            color: 'white'
        },
        userEmail: {
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'light',
            color: 'white',
            marginBottom: 10,
        },
        detailsContainer: {
            height: 'auto',
            padding: 15,
            backgroundColor: Colors.light.tint,
        },
        optionsContainer: {
            height: '100%',
            padding: 20,
            gap: 15,
            borderTopStartRadius: 25,
            borderTopEndRadius: 25,
            backgroundColor: Colors.light.background,
        },
        button: {
            display: 'flex',
            borderColor: Colors.light.tint,
            borderWidth: 1,
            height: 50,
            justifyContent: 'flex-start',
        }
    })

    