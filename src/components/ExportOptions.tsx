'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileText, CreditCard, Users, Loader2 } from 'lucide-react';
import { generateSurveyPDF, generateIDCard, generateHouseholdReport, downloadPDF } from '@/lib/pdfExport';
import { SurveyFormData } from '@/lib/types';

interface ExportOptionsProps {
  surveys: any[];
  selectedSurveys?: string[];
}

export function ExportOptions({ surveys, selectedSurveys }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includePhotos: true,
    includeBiometrics: true,
    includeAllSections: true,
  });

  const exportSingleSurvey = async (survey: any, type: 'full' | 'id-card') => {
    setIsExporting(true);
    try {
      const surveyData: SurveyFormData = survey.data;

      if (type === 'full') {
        const pdf = await generateHouseholdReport(surveyData);
        await downloadPDF(pdf, `survey_${survey.household_id}_${new Date().toISOString().split('T')[0]}.pdf`);
      } else if (type === 'id-card' && surveyData.biometricsInfo?.memberBiometrics) {
        // Generate ID cards for all members with biometric data
        for (const memberBio of surveyData.biometricsInfo.memberBiometrics) {
          const pdf = await generateIDCard(memberBio, surveyData);
          await downloadPDF(pdf, `id_card_${memberBio.memberName.replace(/\s+/g, '_')}_${survey.household_id}.pdf`);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportMultipleSurveys = async (type: 'full' | 'summary') => {
    setIsExporting(true);
    try {
      const surveysToExport = selectedSurveys
        ? surveys.filter(s => selectedSurveys.includes(s.id))
        : surveys;

      if (type === 'full') {
        // Generate individual PDFs for each survey
        for (const survey of surveysToExport) {
          const surveyData: SurveyFormData = survey.data;
          const pdf = await generateHouseholdReport(surveyData);
          await downloadPDF(pdf, `survey_${survey.household_id}.pdf`);
        }
      } else if (type === 'summary') {
        // Generate summary report
        await generateSummaryReport(surveysToExport);
      }
    } catch (error) {
      console.error('Bulk export error:', error);
      alert('Error generating PDFs. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateSummaryReport = async (surveys: any[]) => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    // Title page
    pdf.setFontSize(20);
    pdf.text('Manam Islanders Resettlement Survey', 105, 30, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text('Summary Report', 105, 45, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 60, { align: 'center' });
    pdf.text(`Total Surveys: ${surveys.length}`, 105, 75, { align: 'center' });

    // Statistics
    const stats = {
      totalHouseholds: surveys.length,
      totalPeople: surveys.reduce((sum, s) => sum + (s.household_size || 0), 0),
      clans: new Set(surveys.map(s => s.clan_name).filter(Boolean)).size,
      locations: new Set(surveys.map(s => s.current_location).filter(Boolean)).size,
      completed: surveys.filter(s => s.status === 'completed').length,
    };

    const statsData = [
      ['Total Households', stats.totalHouseholds.toString()],
      ['Total People', stats.totalPeople.toString()],
      ['Unique Clans', stats.clans.toString()],
      ['Unique Locations', stats.locations.toString()],
      ['Completed Surveys', stats.completed.toString()],
      ['Completion Rate', `${Math.round((stats.completed / stats.totalHouseholds) * 100)}%`],
    ];

    (pdf as any).autoTable({
      startY: 90,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'striped',
    });

    // Survey list
    const surveyListData = surveys.map(s => [
      s.household_id || 'N/A',
      s.household_head || 'N/A',
      s.clan_name || 'N/A',
      s.current_location || 'N/A',
      s.household_size?.toString() || '0',
      s.status || 'draft',
      new Date(s.created_at).toLocaleDateString()
    ]);

    (pdf as any).autoTable({
      startY: (pdf as any).lastAutoTable.finalY + 20,
      head: [['Household ID', 'Head', 'Clan', 'Location', 'Size', 'Status', 'Date']],
      body: surveyListData,
      theme: 'striped',
      styles: { fontSize: 8 },
    });

    await downloadPDF(pdf, `survey_summary_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Options</span>
        </CardTitle>
        <CardDescription>
          Generate PDF reports and ID cards from survey data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Single Survey Export */}
          {surveys.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <FileText className="h-8 w-8" />
                  <span className="font-medium">Individual Reports</span>
                  <span className="text-xs text-gray-600">Export single survey</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Export Individual Survey</DialogTitle>
                  <DialogDescription>
                    Select a survey to generate detailed PDF report
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {surveys.map((survey) => (
                    <div key={survey.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{survey.household_id}</p>
                        <p className="text-sm text-gray-600">{survey.household_head} - {survey.clan_name}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => exportSingleSurvey(survey, 'full')}
                          disabled={isExporting}
                        >
                          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Full Report'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportSingleSurvey(survey, 'id-card')}
                          disabled={isExporting || !survey.data?.biometricsInfo?.memberBiometrics?.length}
                        >
                          ID Cards
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Summary Report */}
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
            onClick={() => exportMultipleSurveys('summary')}
            disabled={isExporting || surveys.length === 0}
          >
            <Users className="h-8 w-8" />
            <span className="font-medium">Summary Report</span>
            <span className="text-xs text-gray-600">All surveys overview</span>
          </Button>

          {/* Bulk ID Cards */}
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2"
            onClick={() => exportMultipleSurveys('full')}
            disabled={isExporting || surveys.length === 0}
          >
            <CreditCard className="h-8 w-8" />
            <span className="font-medium">Bulk Export</span>
            <span className="text-xs text-gray-600">All survey reports</span>
          </Button>
        </div>

        {/* Export Options */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Export Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="photos"
                checked={exportOptions.includePhotos}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includePhotos: !!checked }))
                }
              />
              <label htmlFor="photos" className="text-sm">Include biometric photos</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="biometrics"
                checked={exportOptions.includeBiometrics}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeBiometrics: !!checked }))
                }
              />
              <label htmlFor="biometrics" className="text-sm">Include fingerprint data</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-sections"
                checked={exportOptions.includeAllSections}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, includeAllSections: !!checked }))
                }
              />
              <label htmlFor="all-sections" className="text-sm">Include all survey sections</label>
            </div>
          </div>
        </div>

        {/* Status */}
        {isExporting && (
          <div className="bg-blue-50 p-3 rounded-lg flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-blue-800">Generating PDF...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
