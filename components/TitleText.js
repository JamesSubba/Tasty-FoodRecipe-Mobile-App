import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TitleText = ({title}) => {
  return (
    <View>
      <Text style={styles.textStyle}>{title}</Text>
    </View>
  )
}

export default TitleText

const styles = StyleSheet.create({
    textStyle: {
        color: "#E56B6F"
    }
})