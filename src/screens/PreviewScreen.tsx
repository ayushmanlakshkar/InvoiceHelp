import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { TemplateService } from '../services/TemplateService';
import { PDFService } from '../services/PDFService';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { templateId, formData } = route.params;
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [fileNameModalVisible, setFileNameModalVisible] = useState(false);
  const [inputFileName, setInputFileName] = useState('');

  useEffect(() => {
    loadTemplateAndFillData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTemplateAndFillData = async () => {
    setLoading(true);
    try {
      const templateHTML = await TemplateService.getTemplateHTML(templateId);
      const filledTemplate = TemplateService.fillTemplate(templateHTML, formData);
      setHtmlContent(filledTemplate);
    } catch (error) {
      console.error('Error loading template:', error);
      Alert.alert('Error', 'Failed to load template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const promptForFileName = () => {
    setInputFileName('');
    setFileNameModalVisible(true);
  };

  const handleFileNameSubmit = async () => {
    if (!inputFileName.trim()) {
      Alert.alert('Invalid Name', 'File name cannot be empty.');
      return;
    }
    setFileNameModalVisible(false);
    await handleDownload(inputFileName.trim());
  };

  const handleDownload = async (customFileName?: string) => {
    setGenerating(true);
    try {
      const template = TemplateService.getTemplateById(templateId);
      const fileName = customFileName || `${template?.name || 'Document'}_${new Date().getTime()}`;
      const { filePath } = await PDFService.generatePDF(htmlContent, fileName);
      setPdfPath(filePath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!pdfPath) {
      Alert.alert('No PDF', 'Please generate or select a document to share.');
      return;
    }
    try {
      const template = TemplateService.getTemplateById(templateId);
      console.log(`Sharing PDF from path: ${pdfPath}`);
      await PDFService.sharePDF(pdfPath, template?.name || 'Document');
    } catch (error) {
      console.error('Error sharing PDF:', error);
      const errorMessage = (error instanceof Error && error.message) ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to share document: ${errorMessage}`);
    }
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  const isSaved = !!pdfPath;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Loading preview...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Document Preview</Text>
      </View>

      <View style={styles.previewContainer}>
        <WebView
          source={{ html: htmlContent }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
          disabled={generating}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, (generating || isSaved) && styles.disabledButton]}
          onPress={promptForFileName}
          disabled={generating || isSaved}
        >
          {generating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.actionButtonText}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, (generating || !isSaved) && styles.disabledButton]}
          onPress={handleShare}
          disabled={generating || !isSaved}
        >
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={fileNameModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFileNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter PDF File Name</Text>
            <TextInput
              style={styles.input}
              value={inputFileName}
              onChangeText={setInputFileName}
              placeholder="File name"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setFileNameModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFileNameSubmit} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    marginRight: 10,
  },
  cancelText: {
    color: '#888',
  },
  saveBtn: {
    backgroundColor: '#4caf50',
    padding: 8,
    borderRadius: 6,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PreviewScreen;
