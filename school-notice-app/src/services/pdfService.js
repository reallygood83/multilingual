import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Generate PDF from HTML element
export const generatePDFFromElement = async (element, filename = 'notice.pdf') => {
  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
};

// Generate PDF with custom options
export const generatePDFWithOptions = async (element, options = {}) => {
  const {
    filename = 'notice.pdf',
    format = 'a4',
    orientation = 'portrait',
    quality = 2,
    backgroundColor = '#ffffff'
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: true,
      backgroundColor
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(orientation === 'portrait' ? 'p' : 'l', 'mm', format);
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Generate multiple PDFs for different languages
export const generateMultilingualPDFs = async (elements, languages, baseFilename = 'notice') => {
  try {
    const results = [];
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const language = languages[i];
      const filename = `${baseFilename}_${language}.pdf`;
      
      await generatePDFFromElement(element, filename);
      results.push({
        language,
        filename,
        success: true
      });
    }
    
    return results;
  } catch (error) {
    console.error('Multilingual PDF generation error:', error);
    throw error;
  }
};

// Preview PDF (returns data URL instead of saving)
export const previewPDF = async (element) => {
  try {
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    return pdf.output('datauristring');
  } catch (error) {
    console.error('PDF preview error:', error);
    throw error;
  }
};

export default {
  generatePDFFromElement,
  generatePDFWithOptions,
  generateMultilingualPDFs,
  previewPDF
};