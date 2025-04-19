import { Template } from '../utils/types';
import { templates } from '../templates/defaultTemplate';

export const TemplateService = {
  // Get all available templates
  getTemplates: (): Template[] => {
    return templates;
  },

  // Get a specific template by ID
  getTemplateById: (id: string): Template | undefined => {
    return templates.find(template => template.id === id);
  },

  // Get the template HTML content
  getTemplateHTML: async (templateId: string): Promise<string> => {
    const template = templates.find(template => template.id === templateId);
    if (template) {
      return template.html;
    }
    
    // Fallback to the first template if templateId is not found
    return templates[0].html;
  },

  // Fill template with data using placeholders and return filled HTML
  fillTemplate: (templateHTML: string, data: Record<string, any>): string => {
    let filledTemplate = templateHTML;
    
    // Replace placeholders with actual data
    Object.keys(data).forEach(key => {
      const value = data[key]?.toString() || '';
      const placeholder = `{{${key}}}`;
      filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), value);
    });

    return filledTemplate;
  }
};