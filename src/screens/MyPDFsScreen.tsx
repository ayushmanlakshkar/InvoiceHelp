/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PDFService } from '../services/PDFService';
import { useNavigation } from '@react-navigation/native';

const MyPDFsScreen: React.FC = () => {
  const [pdfs, setPDFs] = useState<any[]>([]);
  const navigation = useNavigation();
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const stored = await AsyncStorage.getItem('pdfs');
        setPDFs(stored ? JSON.parse(stored) : []);
      } catch (e) {
        setPDFs([]);
      }
    };
    const unsubscribe = navigation.addListener('focus', fetchPDFs);
    return unsubscribe;
  }, [navigation]);

  const handleShare = async (pdf: any) => {
    try {
      console.log(`Sharing PDF from MyPDFsScreen: ${pdf.filePath}`);

      // Check if the file exists before attempting to share
      if (!pdf.filePath) {
        Alert.alert('Error', 'Invalid PDF file path.');
        return;
      }

      await PDFService.sharePDF(pdf.filePath, pdf.fileName);
    } catch (e) {
      console.error('Error sharing PDF:', e);
      const errorMessage = (e && typeof e === 'object' && 'message' in e) ? (e as any).message : 'Unknown error';
      Alert.alert('Error', `Could not share PDF: ${errorMessage}`);
    }
  };

  const handleDelete = async (pdf: any) => {
    Alert.alert('Delete PDF', 'Are you sure you want to delete this PDF?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem('pdfs');
            let updatedPDFs = stored ? JSON.parse(stored) : [];
            updatedPDFs = updatedPDFs.filter((p: any) => p.filePath !== pdf.filePath);
            await AsyncStorage.setItem('pdfs', JSON.stringify(updatedPDFs));
            setPDFs(updatedPDFs);
          } catch (e) {
            Alert.alert('Error', 'Could not delete PDF.');
          }
        },
      },
    ]);
  };

  const openRenameModal = (pdf: any) => {
    setSelectedPDF(pdf);
    setNewFileName(pdf.fileName);
    setRenameModalVisible(true);
  };

  const handleRename = async () => {
    if (!newFileName.trim()) {
      Alert.alert('Invalid Name', 'File name cannot be empty.');
      return;
    }
    try {
      const stored = await AsyncStorage.getItem('pdfs');
      let updatedPDFs = stored ? JSON.parse(stored) : [];
      updatedPDFs = updatedPDFs.map((p: any) =>
        p.filePath === selectedPDF.filePath ? { ...p, fileName: newFileName } : p
      );
      await AsyncStorage.setItem('pdfs', JSON.stringify(updatedPDFs));
      setPDFs(updatedPDFs);
      setRenameModalVisible(false);
      setSelectedPDF(null);
    } catch (e) {
      Alert.alert('Error', 'Could not rename PDF.');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.fileName}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={styles.shareBtn} onPress={() => handleShare(item)}>
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.renameBtn} onPress={() => openRenameModal(item)}>
        <Text style={styles.renameText}>Rename</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>My Generated PDFs</Text> */}
      <FlatList
        data={pdfs}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No PDFs found.</Text>}
      />
      <Modal
        visible={renameModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename PDF</Text>
            <TextInput
              style={styles.input}
              value={newFileName}
              onChangeText={setNewFileName}
              placeholder="Enter new file name"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setRenameModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRename} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: 'bold', fontSize: 16 },
  date: { color: '#888', fontSize: 12 },
  path: { color: '#aaa', fontSize: 10 },
  shareBtn: { backgroundColor: '#f4511e', padding: 8, borderRadius: 6, marginLeft: 10 },
  shareText: { color: '#fff', fontWeight: 'bold' },
  renameBtn: { backgroundColor: '#2196f3', padding: 8, borderRadius: 6, marginLeft: 10 },
  renameText: { color: '#fff', fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#e53935', padding: 8, borderRadius: 6, marginLeft: 10 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { marginRight: 10 },
  cancelText: { color: '#888' },
  saveBtn: { backgroundColor: '#4caf50', padding: 8, borderRadius: 6 },
  saveText: { color: '#fff', fontWeight: 'bold' },
});

export default MyPDFsScreen;
