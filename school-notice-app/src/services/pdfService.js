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

// Generate clean A4 PDF without logo and colors
export const generateCleanA4PDF = async (element, filename = 'notice_clean.pdf') => {
  try {
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);
    
    // Remove logo elements
    const logoElements = clonedElement.querySelectorAll('[data-logo], .logo, img[src*="logo"], img[alt*="logo"], img[alt*="로고"]');
    logoElements.forEach(el => el.remove());
    
    // Remove color backgrounds and gradients, unify text color and borders
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(el => {
      // Reset backgrounds
      el.style.background = 'transparent';
      el.style.backgroundColor = 'transparent';
      el.style.backgroundImage = 'none';

      const computedStyle = window.getComputedStyle(el);

      // Unify text color to black
      el.style.color = '#000000';

      // Remove decorative elements (gradients, shadows)
      el.style.boxShadow = 'none';
      if (
        el.classList.contains('decoration') ||
        (computedStyle.backgroundImage && computedStyle.backgroundImage.includes('gradient'))
      ) {
        el.style.display = 'none';
      }

      // Footer separator removal by data attribute
      if (el.hasAttribute('data-clean-remove-top-border')) {
        el.style.borderTop = 'none';
        el.style.borderTopWidth = '0';
      }

      // Normalize borders: if any side has a visible border, set to 1px solid #000
      const hasVisibleBorder = ['Top', 'Right', 'Bottom', 'Left'].some(side => {
        const w = parseFloat(computedStyle[`border${side}Width`]);
        const s = computedStyle[`border${side}Style`];
        return !!w && w > 0 && s && s !== 'none';
      });
      if (hasVisibleBorder) {
        el.style.borderColor = '#000000';
        el.style.borderStyle = 'solid';
        el.style.borderWidth = '1px';
      }
    });
    
    // Apply clean document styling to root
    clonedElement.style.background = '#ffffff';
    clonedElement.style.color = '#000000';
    clonedElement.style.fontFamily = 'Arial, sans-serif';
    clonedElement.style.padding = '20mm';
    clonedElement.style.margin = '0';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.border = 'none';
    clonedElement.style.borderRadius = '0';
    
    // Temporarily add to DOM for rendering
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    clonedElement.style.width = '210mm'; // A4 width
    document.body.appendChild(clonedElement);
    
    try {
      // Create canvas from cleaned element without forcing fixed height to avoid truncation
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // A4 dimensions
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(filename);
      return true;
    } finally {
      // Remove cloned element from DOM
      document.body.removeChild(clonedElement);
    }
  } catch (error) {
    console.error('Clean PDF generation error:', error);
    throw new Error('깔끔한 PDF 생성 중 오류가 발생했습니다.');
  }
};

export default {
  generatePDFFromElement,
  generatePDFWithOptions,
  generateMultilingualPDFs,
  previewPDF,
  generateCleanA4PDF
};