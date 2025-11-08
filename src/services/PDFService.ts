import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const pdff = {
  async generatePDF(htmlContent: string, fileName: string): Promise<{ filePath: string }> {
    const options = {
      html: htmlContent,
      fileName,
      directory: 'Documents',
      base64: false,
    };
    const pdf = await RNHTMLtoPDF.convert(options);
    if (!pdf.filePath) throw new Error('PDF generation failed');
    // Save PDF metadata to AsyncStorage
    const pdfMeta = {
      filePath: pdf.filePath,
      fileName,
      date: new Date().toISOString(),
    };
    try {
      const existing = await AsyncStorage.getItem('pdfs');
      let pdfs = existing ? JSON.parse(existing) : [];
      pdfs.unshift(pdfMeta);
      await AsyncStorage.setItem('pdfs', JSON.stringify(pdfs));
    } catch (e) {
      // Ignore AsyncStorage errors for now
    }
    return { filePath: pdf.filePath };
  },

  async sharePDF(filePath: string, fileName: string): Promise<void> {
    try {
      console.log(`Attempting to share PDF: ${filePath} with name ${fileName}`);
      const options = {
        title: 'Share PDF',
        url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
        type: 'application/pdf',
        failOnCancel: false,
        filename: fileName + '.pdf',
      };
      console.log('Share options:', JSON.stringify(options));
      await Share.open(options);
      console.log('Share completed successfully');
    } catch (error) {
      console.error('Error in sharePDF:', error);
      if (error.message.includes('User did not share')) {
        // User cancelled sharing, this is not an error
        console.log('User cancelled sharing');
        return;
      }
      throw error;
    }
  },
};
