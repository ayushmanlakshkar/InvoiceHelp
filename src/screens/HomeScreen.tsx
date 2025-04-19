import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>InvoiceHelp</Text>
        <Text style={styles.subtitle}>Generate professional invoices easily</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          Create, customize, and download professional invoices and receipts in a few simple steps.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Multiple Templates</Text>
            <Text style={styles.featureText}>Choose from different document templates</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>Easy Forms</Text>
            <Text style={styles.featureText}>Fill in details with simple forms</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>PDF Export</Text>
            <Text style={styles.featureText}>Download or share your documents</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('TemplateSelection')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('MyPDFs')}
        >
          <Text style={styles.buttonText}>Show Invoices</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    color: '#444',
    lineHeight: 24,
    textAlign: 'center',
  },
  features: {
    marginTop: 20,
  },
  featureItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f4511e',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  featureText: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;