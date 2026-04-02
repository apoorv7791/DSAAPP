import React from 'react';
import { StyleSheet, View } from 'react-native';
import Expandables from '../components/Expandable/Expandables';
import { ToastAndroid } from 'react-native';

const Settings = () => {
    const modules = [
        {
            title: "Account",
            items: ["Profile", "Language", "Themes"]
        }
    ]

    const handleSelect = (item: string) => {
        ToastAndroid.show(item, ToastAndroid.SHORT);
    }
    return (
        <View style={styles.container}>
            {modules.map((module, index) => (
                <Expandables
                    key={index}
                    title={module.title}
                    topics={module.items}
                    onSelected={handleSelect}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
        paddingBottom: 20,

    },
})

export default Settings;
