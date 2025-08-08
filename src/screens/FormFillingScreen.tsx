/* eslint-disable react-native/no-inline-styles */
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
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, LineItem } from '../utils/types';
import { TemplateService } from '../services/TemplateService';
import { TemplateField, Template } from '../utils/types';
// To use voice recording, install react-native-audio-recorder-player:
//   npm install react-native-audio-recorder-player
//   npx pod-install
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import { PermissionsAndroid } from 'react-native';
// import { transcribeAudio } from '../services/SpeechToTextService';
// import { analyzeAndConvertText } from '../services/GeminiService';

type Props = NativeStackScreenProps<RootStackParamList, 'FormFilling'>;

const FormFillingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId } = route.params;
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  // const [isRecording, setIsRecording] = useState(false);
  // const [aiLoading, setAiLoading] = useState(false);

  // Helper function to convert number to words
  const convertNumberToWords = (amount: number): string => {
    try {
      if (amount <= 0) { return 'Zero'; }

      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

      const numToWords = (num: number): string => {
        if (num < 20) { return ones[num]; }
        if (num < 100) { return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : ''); }
        if (num < 1000) { return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + numToWords(num % 100) : ''); }
        if (num < 100000) { return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numToWords(num % 1000) : ''); }
        if (num < 10000000) { return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numToWords(num % 100000) : ''); }
        return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numToWords(num % 10000000) : '');
      };

      const wholePart = Math.floor(amount);
      const decimalPart = Math.round((amount - wholePart) * 100);

      let result = numToWords(wholePart) + ' Rupees';
      if (decimalPart > 0) {
        result += ' and ' + numToWords(decimalPart) + ' Paise';
      }

      return result + ' Only';
    } catch (error) {
      console.error('Error converting number to words:', error);
      return 'Amount in words conversion error';
    }
  };

  useEffect(() => {
    setLoading(true);
    // Get template details
    const selectedTemplate = TemplateService.getTemplateById(templateId);
    if (selectedTemplate) {
      setTemplate(selectedTemplate);

      // Initialize form data with empty values
      const initialData: Record<string, any> = {};
      selectedTemplate.fields.forEach((field: { id: string; }) => {
        if (field.id !== 'lineItems') {
          initialData[field.id] = '';
        }
      });

      // Initialize with default values for invoice template
      if (selectedTemplate.id === 'invoice') {
        initialData.cgstRate = '9';  // Default CGST rate
        initialData.sgstRate = '9';  // Default SGST rate

        // Add a single empty line item
        setLineItems([{
          id: Date.now().toString(),
          description: '',
          hsnCode: '',
          quantity: 0,
          units: '',
          rate: 0,
          amount: 0,
          _rateInput: '',
        }]);
      }

      setFormData(initialData);
    }
    setLoading(false);
  }, [templateId]);

  // Calculate values when line items or tax rates change
  useEffect(() => {
    if (!template || template.id !== 'invoice') { return; }

    // Calculate total from line items
    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

    // Round to 2 decimal places
    const roundTo2 = (num: number) => Math.round(num * 100) / 100;

    // Set taxable value equal to total by default
    const taxableValue = total;

    // Calculate tax amounts
    const cgstRate = parseFloat(formData.cgstRate || '0');
    const sgstRate = parseFloat(formData.sgstRate || '0');
    const cgst = roundTo2((taxableValue * cgstRate) / 100);
    const sgst = roundTo2((taxableValue * sgstRate) / 100);

    // Calculate grand total
    const grandTotal = roundTo2(taxableValue + cgst + sgst);

    // Convert grand total to words
    const amountWords = convertNumberToWords(grandTotal);

    // Update form data with calculated values
    setFormData(prevData => ({
      ...prevData,
      total: total.toFixed(2),
      taxableValue: taxableValue.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      amountWords: amountWords,
    }));
  }, [lineItems, formData.cgstRate, formData.sgstRate, template]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  // Format date input with automatic dashes (DD-MM-YYYY)
  const handleDateInputChange = (fieldId: string, text: string) => {
    // Remove any non-numeric characters first
    let numericValue = text.replace(/[^0-9]/g, '');

    // Format with dashes
    let formattedValue = '';
    if (numericValue.length > 0) {
      // Add first dash after day (DD-)
      if (numericValue.length <= 2) {
        formattedValue = numericValue;
      }
      // Add second dash after month (DD-MM-)
      else if (numericValue.length <= 4) {
        formattedValue = `${numericValue.substring(0, 2)}-${numericValue.substring(2)}`;
      }
      // Complete date format (DD-MM-YYYY)
      else {
        formattedValue = `${numericValue.substring(0, 2)}-${numericValue.substring(2, 4)}-${numericValue.substring(4, 8)}`;
      }
    }

    setFormData(prevData => ({
      ...prevData,
      [fieldId]: formattedValue,
    }));
  };

  // Handle changes to line items
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string) => {
    const updatedItems = [...lineItems];
    const item = { ...updatedItems[index] };

    if (field === 'quantity') {
      const numValue = parseFloat(value) || 0;
      item[field] = numValue;
      item.amount = numValue * item.rate;
    } else if (field === 'rate') {
      // Store the raw input value to preserve decimal points
      // @ts-ignore - We're adding a custom property for UI purposes
      item._rateInput = value;

      // Only update the actual rate if the value is valid
      const numValue = parseFloat(value) || 0;
      item[field] = numValue;
      item.amount = item.quantity * numValue;
    } else {
      (item as any)[field] = value;
    }

    updatedItems[index] = item;
    setLineItems(updatedItems);
  };

  // Add a new line item
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: '',
        hsnCode: '',
        quantity: 0,
        units: '',
        rate: 0,
        amount: 0,
        _rateInput: '',
      },
    ]);
  };

  // Remove a line item
  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) {
      Alert.alert('Cannot Remove', 'You need at least one item.');
      return;
    }

    const updatedItems = [...lineItems];
    updatedItems.splice(index, 1);
    setLineItems(updatedItems);
  };

  const validateForm = (): boolean => {
    if (!template) { return false; }

    let isValid = true;
    const requiredFields = template.fields.filter(field => field.required && field.id !== 'lineItems');

    for (const field of requiredFields) {
      if (!formData[field.id] || formData[field.id].toString().trim() === '') {
        Alert.alert('Missing Information', `Please fill in the ${field.label} field.`);
        isValid = false;
        break;
      }
    }

    // Validate line items if it's an invoice
    if (isValid && template.supportLineItems) {
      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i];
        if (!item.description || !item.hsnCode || !item.units) {
          Alert.alert('Missing Information', `Please fill in all details for item #${i + 1}.`);
          isValid = false;
          break;
        }
        if (item.quantity <= 0 || item.rate <= 0) {
          Alert.alert('Invalid Values', `Quantity and rate must be greater than zero for item #${i + 1}.`);
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  };

  const handlePreview = () => {
    if (validateForm()) {
      // Prepare the form data with line items formatted as HTML
      const completeFormData = { ...formData };

      if (template?.supportLineItems) {
        const lineItemsHTML = lineItems.map(item => `
          <tr>
            <td>${item.description}</td>
            <td>${item.hsnCode}</td>
            <td>${item.quantity}</td>
            <td>${item.units}</td>
            <td>${item.rate.toFixed(2)}</td>
            <td>${item.amount.toFixed(2)}</td>
          </tr>
        `).join('');

        completeFormData.lineItems = lineItemsHTML;
      }

      navigation.navigate('Preview', {
        templateId,
        formData: completeFormData,
      });
    }
  };

  // const audioRecorderPlayer = React.useRef(new AudioRecorderPlayer()).current;

  // const startRecording = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //         {
  //           title: 'Microphone Permission',
  //           message: 'App needs access to your microphone to record audio.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         Alert.alert('Permission Denied', 'Cannot record without microphone permission.');
  //         return;
  //       }
  //     }
  //     setIsRecording(true);
  //     await audioRecorderPlayer.startRecorder();
  //   } catch (err) {
  //     setIsRecording(false);
  //     Alert.alert('Recording Error', 'Could not start recording.');
  //   }
  // };

  // const stopRecording = async () => {
  //   setIsRecording(false);
  //   try {
  //     const uri = await audioRecorderPlayer.stopRecorder();
  //     audioRecorderPlayer.removeRecordBackListener();
  //     if (uri) {
  //       try {
  //         setAiLoading(true);
  //         const text = await transcribeAudio(uri);
  //         const response = await analyzeAndConvertText(text);
  //         setAiLoading(false);
  //         console.log('Transcribed Text:', response);
  //         // Optionally update formData and lineItems here
  //       } catch (e) {
  //         setAiLoading(false);
  //         Alert.alert('Upload Error', 'Could not upload audio.');
  //       }
  //     }
  //   } catch (err) {
  //     setAiLoading(false);
  //     Alert.alert('Recording Error', 'Could not stop recording.');
  //   }
  // };

  const renderLineItemsSection = () => {
    return (
      <View style={styles.lineItemsContainer}>
        <Text style={styles.sectionTitle}>Items</Text>

        {lineItems.map((item, index) => (
          <View style={styles.lineItemCard}>
            <View style={styles.lineItemHeader}>
              <Text style={styles.lineItemTitle}>Item #{index + 1}</Text>
              <TouchableOpacity onPress={() => removeLineItem(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Description of Goods</Text>
              <TextInput
                style={styles.input}
                value={item.description}
                onChangeText={(text) => handleLineItemChange(index, 'description', text)}
                placeholder="Enter description"
                placeholderTextColor="grey"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>HSN Code</Text>
              <TextInput
                style={styles.input}
                value={item.hsnCode}
                onChangeText={(text) => handleLineItemChange(index, 'hsnCode', text)}
                placeholder="Enter HSN code"
                placeholderTextColor="grey"

              />
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={item.quantity > 0 ? item.quantity.toString() : ''}
                  onChangeText={(text) => handleLineItemChange(index, 'quantity', text)}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="grey"
                />
              </View>

              <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Units</Text>
                <TextInput
                  style={styles.input}
                  value={item.units}
                  onChangeText={(text) => handleLineItemChange(index, 'units', text)}
                  placeholder="pcs, kg, etc."
                  placeholderTextColor="grey"
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Rate</Text>
                <TextInput
                  style={styles.input}
                  value={item._rateInput || ''}
                  onChangeText={(text) => handleLineItemChange(index, 'rate', text)}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="grey"

                />
              </View>
              <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={item.amount.toFixed(2)}
                  editable={false}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addItemButton} onPress={addLineItem}>
          <Text style={styles.addItemButtonText}>+ Add Another Item</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCalculatedFields = () => {
    const calculatedFields = [
      'total', 'taxableValue', 'cgst', 'sgst', 'grandTotal', 'amountWords',
    ];

    return calculatedFields.map(fieldId => {
      const field = template?.fields.find(f => f.id === fieldId);
      if (!field) { return null; }

      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData[field.id] || ''}
            editable={false}
            placeholderTextColor="grey"
          />
        </View>
      );
    });
  };

  const renderFormField = (field: TemplateField) => {
    // Skip fields that are handled specially
    if (field.id === 'lineItems' || field.calculateFrom) {
      return null;
    }

    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder={`Enter ${field.label}`}
                            placeholderTextColor="grey"

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
                            placeholderTextColor="grey"

          />
        );
      case 'date':
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleDateInputChange(field.id, text)}
            placeholder="DD-MM-YYYY"
            placeholderTextColor="grey"
            keyboardType="numeric"
            maxLength={10}
          />
        );
      default:
        return (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder={`Enter ${field.label}`}
                            placeholderTextColor="grey"

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

        {/* Render regular input fields */}
        {template.fields
          .filter(field => !field.calculateFrom && field.id !== 'lineItems')
          .map(field => (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
              {renderFormField(field)}
            </View>
          ))}

        {/* Render line items section for invoices */}
        {template.supportLineItems && renderLineItemsSection()}

        {/* Render calculated fields */}
        {template.id === 'invoice' && (
          <View style={styles.calculatedFieldsContainer}>
            <Text style={styles.sectionTitle}>Summary</Text>
            {renderCalculatedFields()}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePreview}
          >
            <Text style={styles.buttonText}>Preview Document</Text>
          </TouchableOpacity>
        </View>

        {/* Voice recording button */}
        {/* <View style={{ marginBottom: 16 }}>
          <TouchableOpacity
            style={{ backgroundColor: isRecording ? '#e74c3c' : '#4caf50', padding: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              {isRecording ? 'Stop Recording' : 'Record Audio'}
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* {aiLoading && (
          <View style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#f4511e" />
              <Text style={{ marginTop: 12, color: '#333', fontSize: 16 }}>Analyzing audio with AI...</Text>
            </View>
          </View>
        )} */}
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
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
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
  // Line items styles
  lineItemsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  lineItemCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  lineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lineItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    color: '#e74c3c',
    fontWeight: '500',
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addItemButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addItemButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  calculatedFieldsContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
});

export default FormFillingScreen;
