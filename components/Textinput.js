import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

const Textinput = ({title, contentType}) => {
  return (
    <View>
      <TextInput placeholder={title} placeholderTextColor="#70706f" textContentType={contentType}/>
    </View>
  )
}

export default Textinput

const styles = StyleSheet.create({})