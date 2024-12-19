import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, ListItem } from 'react-native-elements'
import { useApi } from '../app/ApiContext'
 

export default function ShelterCard() {
    const { allShelters } = useApi()
    
    return (
        <View style={styles.container}>
            {allShelters.map((shelter, idx) => (
                <Card key={idx} containerStyle={styles.card}>
                    <ListItem>
                        <ListItem.Content>
                            <ListItem.Title style={{ fontWeight: 'bold'}}>{shelter.shelter_name}</ListItem.Title>
                            <ListItem.Subtitle>{shelter.address}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </Card>
            ))}
        </View>
    );}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 2
    },
    card: {
        borderRadius: 5,
        padding: 3
    }
  });