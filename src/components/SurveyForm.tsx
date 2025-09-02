'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { SurveyFormData, SurveyStep } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import { DemographicForm } from './forms/DemographicForm';
import { HouseholdForm } from './forms/HouseholdForm';
import { CulturalForm } from './forms/CulturalForm';
import { LocationForm } from './forms/LocationForm';
import { ResettlementForm } from './forms/ResettlementForm';
import { LivelihoodForm } from './forms/LivelihoodForm';
import { HealthForm } from './forms/HealthForm';
import { EducationForm } from './forms/EducationForm';
import { LandForm } from './forms/LandForm';
import { GovernanceForm } from './forms/GovernanceForm';
import { VulnerabilityForm } from './forms/VulnerabilityForm';
import { AspirationsForm } from './forms/AspirationsForm';
import { BiometricsForm } from './forms/BiometricsForm';

interface SurveyFormProps {
  onBack: () => void;
}

const surveySteps: { key: SurveyStep; title: string; description: string }[] = [
  { key: 'demographic', title: 'Demographic Information', description: 'Household members and basic details' },
  { key: 'household', title: 'Household Structure', description: 'Family organization and dependencies' },
  { key: 'cultural', title: 'Cultural Identity', description: 'Clan affiliation and traditional leadership' },
  { key: 'biometrics', title: 'Biometric Data', description: 'Photos and fingerprints for identification' },
  { key: 'location', title: 'Current Location', description: 'Displacement history and current shelter' },
  { key: 'resettlement', title: 'Resettlement Needs', description: 'Preferences for relocation to Andarum' },
  { key: 'livelihood', title: 'Livelihood & Income', description: 'Income sources and economic assets' },
  { key: 'health', title: 'Health & Social Services', description: 'Access to healthcare and sanitation' },
  { key: 'education', title: 'Education & Youth', description: 'School attendance and literacy' },
  { key: 'land', title: 'Land & Resources', description: 'Ownership and access to natural resources' },
  { key: 'governance', title: 'Governance & Security', description: 'Leadership structures and conflicts' },
  { key: 'vulnerability', title: 'Vulnerability & Special Needs', description: 'Households requiring special assistance' },
  { key: 'aspirations', title: 'Future Aspirations', description: 'Goals and expectations for resettlement' },
];

export function SurveyForm({ onBack }: SurveyFormProps) {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<SurveyFormData>({
    currentStep: 'demographic',
  });

  const currentStep = surveySteps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / surveySteps.length) * 100;

  const updateFormData = (stepData: Partial<SurveyFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStepIndex < surveySteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setFormData(prev => ({
        ...prev,
        currentStep: surveySteps[currentStepIndex + 1].key
      }));
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setFormData(prev => ({
        ...prev,
        currentStep: surveySteps[currentStepIndex - 1].key
      }));
    }
  };

  const saveSurvey = async () => {
    try {
      const { saveSurvey: dbSaveSurvey } = await import('@/lib/database');
      const { data, error } = await dbSaveSurvey(formData, user?.id);

      if (error) {
        console.error('Error saving survey:', error);
        alert('Error saving survey. Please try again.');
        return;
      }

      alert('Survey saved successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Error saving survey. Please try again.');
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep.key) {
      case 'demographic':
        return <DemographicForm data={formData} onUpdate={updateFormData} />;
      case 'household':
        return <HouseholdForm data={formData} onUpdate={updateFormData} />;
      case 'cultural':
        return <CulturalForm data={formData} onUpdate={updateFormData} />;
      case 'biometrics':
        return <BiometricsForm data={formData} onUpdate={updateFormData} />;
      case 'location':
        return <LocationForm data={formData} onUpdate={updateFormData} />;
      case 'resettlement':
        return <ResettlementForm data={formData} onUpdate={updateFormData} />;
      case 'livelihood':
        return <LivelihoodForm data={formData} onUpdate={updateFormData} />;
      case 'health':
        return <HealthForm data={formData} onUpdate={updateFormData} />;
      case 'education':
        return <EducationForm data={formData} onUpdate={updateFormData} />;
      case 'land':
        return <LandForm data={formData} onUpdate={updateFormData} />;
      case 'governance':
        return <GovernanceForm data={formData} onUpdate={updateFormData} />;
      case 'vulnerability':
        return <VulnerabilityForm data={formData} onUpdate={updateFormData} />;
      case 'aspirations':
        return <AspirationsForm data={formData} onUpdate={updateFormData} />;
      default:
        return <div>Form not implemented yet</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Baseline Survey
                </h1>
                <p className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {surveySteps.length}
                </p>
              </div>
            </div>
            <Button onClick={saveSurvey} variant="outline" className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Progress</span>
            </Button>
          </div>

          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentStep.title}</CardTitle>
            <CardDescription>{currentStep.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderCurrentForm()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            <Button onClick={saveSurvey} variant="outline">
              Save & Continue Later
            </Button>

            {currentStepIndex === surveySteps.length - 1 ? (
              <Button onClick={saveSurvey} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Complete Survey</span>
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
