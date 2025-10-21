import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
const SubscriptionInfoComp = ({title, message}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Markdown style={markdownStyles}>{message}</Markdown>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
});
const markdownStyles = {
  body: {fontSize: 16, lineHeight: 24, color: '#444'},
  strong: {fontWeight: '700'},
  em: {fontStyle: 'italic'},
  list_item: {marginBottom: 6},
};
export default SubscriptionInfoComp;
