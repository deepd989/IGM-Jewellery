import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RibbonGiftCard from './ribbonGiftCard';

const GiftStepA = () => {
  const steps = [
    {
      icon: '💎',
      title: 'Select your occasion',
      description: 'A maximum of 5 products'
    },
    {
      icon: '🏠',
      title: 'Choose the E-Gift amount',
      description: 'Select you convenient date, time, and place'
    },
    {
      icon: '💝',
      title: 'Personalise it with a note',
      description: 'Our consultant will get you your chosen designs'
    },
    {
      icon: '🔒',
      title: "Add Recipient's number & they will receive a redeemable link",
      description: 'Our consultant will get you your chosen designs'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Image Placeholder */}
        {/* <View style={styles.imageContainer} /> */}
        <RibbonGiftCard/>

        {/* Title Section */}
        <Text style={styles.title}>Send a Gift Card!</Text>
        <Text style={styles.subtitle}>
          Send a virtual gift cart for occasions you can't be their physically
        </Text>

        {/* Steps Section */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepWrapper}>
              <View style={styles.stepRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{step.icon}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
              {index < steps.length - 1 && (
                <View style={styles.connectorLine} />
              )}
            </View>
          ))}
        </View>


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 20
  },
  imageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 32
  },
  stepsContainer: {
    marginBottom: 32
  },
  stepWrapper: {
    position: 'relative'
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  icon: {
    fontSize: 24
  },
  stepContent: {
    flex: 1,
    paddingTop: 4
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 22
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  connectorLine: {
    width: 2,
    height: 24,
    backgroundColor: '#e0e0e0',
    marginLeft: 23,
    marginBottom: 8
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default GiftStepA;