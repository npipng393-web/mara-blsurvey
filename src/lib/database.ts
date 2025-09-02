import { supabase } from './supabase';
import { SurveyFormData } from './types';

// Simple survey operations
export async function saveSurvey(surveyData: SurveyFormData, userId?: string) {
  const { data, error } = await supabase
    .from('surveys')
    .upsert({
      household_id: surveyData.demographicInfo?.householdId || '',
      family_id: surveyData.demographicInfo?.familyId || '',
      household_head: surveyData.householdStructure?.householdHead || '',
      household_size: surveyData.householdStructure?.householdSize || 1,
      clan_name: surveyData.culturalIdentity?.clanName || '',
      current_location: surveyData.currentLocation?.campVillageName || 'TBD',
      status: 'draft',
      created_by: userId,
      last_modified_by: userId,
      data: surveyData
    });

  // Save household members with biometric data
  if (surveyData.demographicInfo?.members && data) {
    await saveHouseholdMembers((data as any)[0].id, surveyData.demographicInfo.members, surveyData.biometricsInfo);
  }

  return { data, error };
}

// Save household members with biometric data
export async function saveHouseholdMembers(surveyId: string, members: any[], biometricsInfo?: any) {
  try {
    // Delete existing members
    await supabase
      .from('household_members')
      .delete()
      .eq('survey_id', surveyId);

    // Prepare member data with biometrics
    const membersToInsert = members.map(member => {
      const memberBiometric = biometricsInfo?.memberBiometrics?.find(
        (mb: any) => mb.memberId === member.id
      );

      return {
        survey_id: surveyId,
        full_name: member.fullName,
        sex: member.sex,
        date_of_birth: member.dateOfBirth,
        age: member.age,
        marital_status: member.maritalStatus,
        relationship_to_head: member.relationshipToHead,
        education_level: member.educationLevel,
        occupation: member.occupation,
        skills: member.skills,
        disability_status: member.disabilityStatus,
        // Biometric data
        biometric_id: memberBiometric?.biometricData?.biometricId,
        photo_blob: memberBiometric?.biometricData?.photoBlob,
        fingerprint_data: memberBiometric?.biometricData?.fingerprints ?
          JSON.stringify(memberBiometric.biometricData.fingerprints) : null,
        biometric_captured_at: memberBiometric?.biometricData?.capturedAt,
        biometric_captured_by: memberBiometric?.biometricData?.capturedBy,
        verification_status: memberBiometric?.biometricData?.verificationStatus || 'pending'
      };
    });

    // Insert updated members
    const { error } = await supabase
      .from('household_members')
      .insert(membersToInsert);

    if (error) {
      console.error('Error saving household members:', error);
    }
  } catch (error) {
    console.error('Error in saveHouseholdMembers:', error);
  }
}

export async function getAllSurveys() {
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getStats() {
  const { data: surveys, error } = await supabase
    .from('surveys')
    .select('*');

  if (error) return { data: null, error };

  const stats = {
    totalSurveys: surveys.length,
    completedSurveys: surveys.filter(s => s.status === 'completed').length,
    totalPeople: surveys.reduce((sum, s) => sum + (s.household_size || 0), 0),
    uniqueClans: new Set(surveys.map(s => s.clan_name).filter(Boolean)).size,
  };

  return { data: stats, error: null };
}
