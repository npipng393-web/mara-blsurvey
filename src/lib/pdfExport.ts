import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SurveyFormData } from './types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export async function generateSurveyPDF(surveyData: SurveyFormData, includePhotos: boolean = true) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Manam Islanders Resettlement Survey', pageWidth / 2, currentY, { align: 'center' });

  currentY += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Baseline Survey Report', pageWidth / 2, currentY, { align: 'center' });

  currentY += 20;

  // Survey Information
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Survey Information', 20, currentY);
  currentY += 10;

  const surveyInfo = [
    ['Household ID', surveyData.demographicInfo?.householdId || 'N/A'],
    ['Family ID', surveyData.demographicInfo?.familyId || 'N/A'],
    ['Household Head', surveyData.householdStructure?.householdHead || 'N/A'],
    ['Clan Name', surveyData.culturalIdentity?.clanName || 'N/A'],
    ['Current Location', surveyData.currentLocation?.campVillageName || 'N/A'],
    ['Date Generated', new Date().toLocaleDateString()],
  ];

  pdf.autoTable({
    startY: currentY,
    head: [['Field', 'Value']],
    body: surveyInfo,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 20, right: 20 }
  });

  currentY = (pdf as any).lastAutoTable.finalY + 20;

  // Household Members Section
  if (surveyData.demographicInfo?.members && surveyData.demographicInfo.members.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Household Members', 20, currentY);
    currentY += 10;

    const membersData = surveyData.demographicInfo.members.map((member, index) => [
      (index + 1).toString(),
      member.fullName,
      member.sex,
      member.age.toString(),
      member.relationshipToHead,
      member.educationLevel,
      member.occupation
    ]);

    pdf.autoTable({
      startY: currentY,
      head: [['#', 'Name', 'Sex', 'Age', 'Relationship', 'Education', 'Occupation']],
      body: membersData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 }
    });

    currentY = (pdf as any).lastAutoTable.finalY + 20;
  }

  // Biometric Data Section
  if (includePhotos && surveyData.biometricsInfo?.memberBiometrics) {
    pdf.addPage();
    currentY = 20;

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Biometric Data', 20, currentY);
    currentY += 15;

    for (const memberBio of surveyData.biometricsInfo.memberBiometrics) {
      // Check if we need a new page
      if (currentY > pageHeight - 100) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${memberBio.memberName}`, 20, currentY);
      currentY += 10;

      // Add photo if available
      if (memberBio.biometricData.photoBlob) {
        try {
          const imgWidth = 60;
          const imgHeight = 80;
          pdf.addImage(memberBio.biometricData.photoBlob, 'JPEG', 20, currentY, imgWidth, imgHeight);

          // Add biometric info next to photo
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const bioInfo = [
            `Biometric ID: ${memberBio.biometricData.biometricId || 'N/A'}`,
            `Captured: ${memberBio.biometricData.capturedAt ? new Date(memberBio.biometricData.capturedAt).toLocaleDateString() : 'N/A'}`,
            `Captured By: ${memberBio.biometricData.capturedBy || 'N/A'}`,
            `Status: ${memberBio.biometricData.verificationStatus || 'Pending'}`,
            `Fingerprints: ${memberBio.biometricData.fingerprints?.length || 0}/10`
          ];

          bioInfo.forEach((info, index) => {
            pdf.text(info, 90, currentY + 10 + (index * 5));
          });

          currentY += imgHeight + 15;
        } catch (error) {
          console.error('Error adding image to PDF:', error);
          pdf.setFontSize(10);
          pdf.text('Photo not available', 20, currentY + 10);
          currentY += 20;
        }
      } else {
        pdf.setFontSize(10);
        pdf.text('No photo captured', 20, currentY + 5);
        currentY += 15;
      }

      // Add separator line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 10;
    }
  }

  // Location Information
  if (surveyData.currentLocation) {
    pdf.addPage();
    currentY = 20;

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Location & Displacement Information', 20, currentY);
    currentY += 15;

    const locationData = [
      ['Current Location', surveyData.currentLocation.campVillageName || 'N/A'],
      ['Year Moved', surveyData.currentLocation.yearMoved?.toString() || 'N/A'],
      ['Shelter Type', surveyData.currentLocation.shelterType || 'N/A'],
      ['GPS Coordinates',
        surveyData.currentLocation.gpsCoordinates?.latitude && surveyData.currentLocation.gpsCoordinates?.longitude
          ? `${surveyData.currentLocation.gpsCoordinates.latitude.toFixed(6)}, ${surveyData.currentLocation.gpsCoordinates.longitude.toFixed(6)}`
          : 'N/A'
      ],
      ['Previous Locations', surveyData.currentLocation.previousLocations?.join(', ') || 'None recorded']
    ];

    pdf.autoTable({
      startY: currentY,
      head: [['Field', 'Information']],
      body: locationData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 20, right: 20 }
    });

    currentY = (pdf as any).lastAutoTable.finalY + 15;

    if (surveyData.currentLocation.shelterDescription) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Shelter Description:', 20, currentY);
      currentY += 10;

      pdf.setFont('helvetica', 'normal');
      const splitText = pdf.splitTextToSize(surveyData.currentLocation.shelterDescription, pageWidth - 40);
      pdf.text(splitText, 20, currentY);
    }
  }

  // Footer
  const pageCount = (pdf.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return pdf;
}

export async function generateIDCard(memberBio: any, surveyData: SurveyFormData) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.6, 53.98] // Standard ID card size
  });

  const cardWidth = 85.6;
  const cardHeight = 53.98;

  // Background
  pdf.setFillColor(245, 245, 245);
  pdf.rect(0, 0, cardWidth, cardHeight, 'F');

  // Header
  pdf.setFillColor(41, 128, 185);
  pdf.rect(0, 0, cardWidth, 12, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MANAM ISLANDERS RESETTLEMENT ID', cardWidth / 2, 7, { align: 'center' });

  // Photo
  if (memberBio.biometricData.photoBlob) {
    try {
      pdf.addImage(memberBio.biometricData.photoBlob, 'JPEG', 5, 15, 20, 25);
    } catch (error) {
      console.error('Error adding photo to ID card:', error);
    }
  }

  // Member information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text(memberBio.memberName, 30, 20);

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Household: ${surveyData.demographicInfo?.householdId || 'N/A'}`, 30, 25);
  pdf.text(`Clan: ${surveyData.culturalIdentity?.clanName || 'N/A'}`, 30, 30);
  pdf.text(`Location: ${surveyData.currentLocation?.campVillageName || 'N/A'}`, 30, 35);
  pdf.text(`Bio ID: ${memberBio.biometricData.biometricId || 'N/A'}`, 30, 40);

  // Footer
  pdf.setFontSize(6);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 5, 50);

  return pdf;
}

export async function generateHouseholdReport(surveyData: SurveyFormData) {
  const pdf = await generateSurveyPDF(surveyData, true);
  return pdf;
}

export async function downloadPDF(pdf: jsPDF, filename: string) {
  pdf.save(filename);
}

export async function generateBulkIDCards(surveyDataList: SurveyFormData[]) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  let cardCount = 0;
  const cardsPerPage = 8; // 2x4 layout
  const cardWidth = 85.6;
  const cardHeight = 53.98;
  const margin = 10;

  for (const surveyData of surveyDataList) {
    if (surveyData.biometricsInfo?.memberBiometrics) {
      for (const memberBio of surveyData.biometricsInfo.memberBiometrics) {
        if (cardCount > 0 && cardCount % cardsPerPage === 0) {
          pdf.addPage();
        }

        const row = Math.floor((cardCount % cardsPerPage) / 2);
        const col = cardCount % 2;
        const x = margin + col * (cardWidth + margin);
        const y = margin + row * (cardHeight + margin);

        // Generate individual ID card content at position
        const tempPdf = await generateIDCard(memberBio, surveyData);
        // Note: This is a simplified approach. In production, you'd need to
        // properly position the card content at x, y coordinates

        cardCount++;
      }
    }
  }

  return pdf;
}
