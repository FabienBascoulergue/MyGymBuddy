import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const ButtonSmall = ({ onPress, children }) => {
    const { buttonStyle, textStyle } = styles;

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
    textStyle: {
        alignSelf: 'center',
        color: '#007aff',
        fontSize: 10,
        fontWeight: '400',
        paddingTop: 5,
        paddingBottom: 5
    },
    buttonStyle: {
        flex: 1,
        height: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#007aff',
        marginLeft: 5,
        marginRight: 5
    }
};

export { ButtonSmall };
