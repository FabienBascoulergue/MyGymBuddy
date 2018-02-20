import React from 'react';
import { TextInput, View, Text } from 'react-native';

const InputEx = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, maxLength }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput 
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 14,
    lineHeight: 19,
    flex: 1
  },
  labelStyle: {
    fontSize: 14,
    paddingLeft: 40,
    flex: 3
  },
  containerStyle: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default InputEx;
