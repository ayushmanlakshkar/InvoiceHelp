import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { TemplateService } from '../services/TemplateService';
import { TemplateField, Template } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FormFilling'>;

const FormFillingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId } = route.params;
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    // Get template details
    const selectedTemplate = TemplateService.getTemplateById(templateId);
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
      
      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      selectedTemplate.fields.forEach(field => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
    }
    setLoading(false);
  }, [templateId]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!template) return false;
    
    let isValid = true;
    // const requiredFields = template.fields.filter(field => field.required);
    
    // for (const field of requiredFields) {
    //   if (!formData[field.id] || formData[field.id].trim() === '') {
    //     Alert.alert('Missing Information', `Please fill in the ${field.label} field.`);
    //     isValid = false;
    //     break;
    //   }
    // }
    
    return isValid;
  };

  const handlePreview = () => {
    if (validateForm()) {
      navigation.navigate('Preview', {
        templateId,
        formData,
      });
    }
  };

  const renderFormField = (field: TemplateField) => {
    const value = formData[field.id] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder={`Enter ${field.label}`}
          />
        );
      case 'number':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder={`Enter ${field.label}`}
            keyboardType="numeric"
          />
        );
      case 'date':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder="DD-MM-YYYY"
          />
        );
      default:
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder={`Enter ${field.label}`}
          />
        );
    }
  };

  if (loading || !template) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Loading form...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.header}>{template.name}</Text>
        <Text style={styles.subHeader}>Fill in the details for your document</Text>
        
        {template.fields.map(field => (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            {renderFormField(field)}
          </View>
        ))}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePreview}
          >
            <Text style={styles.buttonText}>Preview Document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  required: {
    color: '#f4511e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormFillingScreen;