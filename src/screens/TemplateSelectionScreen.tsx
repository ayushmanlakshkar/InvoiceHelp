import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { TemplateService } from '../services/TemplateService';
import { Template } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TemplateSelection'>;

const TemplateSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load templates
    setLoading(true);
    const availableTemplates = TemplateService.getTemplates();
    setTemplates(availableTemplates);
    setLoading(false);
  }, []);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleNext = () => {
    if (selectedTemplateId) {
      navigation.navigate('FormFilling', { templateId: selectedTemplateId });
    }
  };

  const renderTemplateItem = ({ item }: { item: Template }) => {
    const isSelected = selectedTemplateId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.templateItem,
          isSelected && styles.selectedTemplateItem,
        ]}
        onPress={() => handleSelectTemplate(item.id)}
      >
        <View style={styles.templateContent}>
          <Text style={styles.templateName}>{item.name}</Text>
          <Text style={styles.templateDescription}>{item.description}</Text>
        </View>
        <View style={[
          styles.radioButton,
          isSelected && styles.radioButtonSelected
        ]}>
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Template</Text>
      <Text style={styles.subHeader}>Choose the template that best fits your needs</Text>
      
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={renderTemplateItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            !selectedTemplateId && styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedTemplateId}
        >
          <Text style={styles.buttonText}>Next</Text>
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTemplateItem: {
    borderColor: '#f4511e',
    backgroundColor: '#fff3ef',
  },
  templateContent: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#f4511e',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f4511e',
  },
  footer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateSelectionScreen;