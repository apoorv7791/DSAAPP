import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
const QueueVisual = () => {

    const { theme } = useContext(ThemeContext);
    const styles = React.useMemo(() => getStyles(theme), [theme]);

    return (
        <View>

        </View>
    );
}
const getStyles = (theme: any) => {
    return StyleSheet.create({

    })
}

export default QueueVisual;
