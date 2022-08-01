import { StyleSheet, TouchableOpacity, Text } from "react-native";
import React from 'react'

const RedButton = ({ title, width, height }) => {
  return (
    <TouchableOpacity style={[
        styles.appButtonContainer,
        width && {width},
        height && {height}
      ]}>
        <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default RedButton

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#E56B6F",
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 12

      },
      appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
      }
})