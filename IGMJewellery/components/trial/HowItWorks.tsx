import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING } from '../../constants/theme';

export const HowItWorks: React.FC = () => {
  const steps = [
    { icon: 'diamond-outline', title: 'Pick your favourite designs', desc: 'A maximum of 5 products' },
    { icon: 'calendar-outline', title: 'Schedule a date & time', desc: 'Consultant will visit your place' },
    { icon: 'heart-outline', title: 'Try the designs', desc: 'Our consultant will get you your chosen designs' },
    { icon: 'bag-handle-outline', title: 'Buy only if you like', desc: 'No obligation to buy after trial' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Here’s how it works</Text>
      <Text style={styles.sub}>Add jewellery upto 5 designs to try in the comfort of your home at your convinience</Text>
      
      {steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <View style={styles.iconCircle}>
            <Ionicons name={step.icon as any} size={20} color="#053844" />
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
          {index < steps.length - 1 && <View style={styles.connector} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: SPACING.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 12,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepContent: {
    marginLeft: 16,
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  stepDesc: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  connector: {
    position: 'absolute',
    left: 20,
    top: 40,
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
  }
});