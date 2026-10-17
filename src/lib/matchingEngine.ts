import type { Scholarship, MatchInput, MatchResult } from './types';
import { getDeadlineStatus } from './scholarshipUtils';

export function matchScholarships(
  input: MatchInput,
  scholarships: Scholarship[]
): MatchResult[] {
  const results: MatchResult[] = scholarships.map((scholarship) => {
    let score = 0;
    let maxScore = 0;
    const reasons: string[] = [];
    const concerns: string[] = [];
    const nextSteps: string[] = [];

    // Degree level match (weight: 20)
    maxScore += 20;
    if (scholarship.degree_level.includes(input.desiredDegree)) {
      score += 20;
      reasons.push(`This opportunity supports ${input.desiredDegree} studies, matching your goal.`);
    } else {
      concerns.push(`This opportunity may not offer ${input.desiredDegree} level study. Available levels: ${scholarship.degree_level.join(', ')}.`);
    }

    // Destination match (weight: 20)
    maxScore += 20;
    if (input.preferredDestinations.length > 0) {
      const destMatch = input.preferredDestinations.some(
        (d) => d === scholarship.country || scholarship.country === 'Multiple Countries'
      );
      if (destMatch) {
        score += 20;
        reasons.push(`Located in ${scholarship.country}, which matches your preferred destination.`);
      } else {
        concerns.push(`This opportunity is in ${scholarship.country}, which is not among your preferred destinations.`);
      }
    } else {
      score += 10;
      nextSteps.push('Specify your preferred destinations for better matching.');
    }

    // Subject match (weight: 15)
    maxScore += 15;
    if (input.preferredSubject) {
      const subj = input.preferredSubject.toLowerCase();
      const subjects = [...scholarship.subject_areas, ...scholarship.keywords]
        .join(' ')
        .toLowerCase();
      if (subjects.includes(subj) || scholarship.subject_areas.includes('All fields')) {
        score += 15;
        if (scholarship.subject_areas.includes('All fields')) {
          reasons.push('This opportunity accepts all subject areas, including your preferred field.');
        } else {
          reasons.push(`This opportunity covers ${input.preferredSubject} or related fields.`);
        }
      } else {
        concerns.push(`This opportunity may not cover your preferred subject area. Covered areas: ${scholarship.subject_areas.join(', ')}.`);
      }
    } else {
      score += 7;
    }

    // Research interests match (weight: 10)
    if (input.researchInterests) {
      maxScore += 10;
      const research = input.researchInterests.toLowerCase();
      const searchable = [scholarship.description, scholarship.keywords.join(' '), ...scholarship.subject_areas]
        .join(' ')
        .toLowerCase();
      if (searchable.includes(research)) {
        score += 10;
        reasons.push('Your research interests align with this opportunity\'s focus areas.');
      } else {
        concerns.push('Your specific research interests may not align with this opportunity.');
      }
    }

    // Funding preference match (weight: 15)
    maxScore += 15;
    if (input.fundingPreference === 'fully_funded' && scholarship.funding_type === 'fully_funded') {
      score += 15;
      reasons.push('This is a fully funded opportunity, matching your funding preference.');
    } else if (input.fundingPreference === 'fully_funded' && scholarship.funding_type === 'partially_funded') {
      score += 5;
      concerns.push('This is only partially funded. You preferred fully funded opportunities.');
    } else if (input.fundingPreference === 'any') {
      score += 15;
    } else if (!input.fundingPreference) {
      score += 10;
    }

    // Nationality eligibility (weight: 10)
    maxScore += 10;
    if (scholarship.eligible_nationalities.length > 0) {
      const natList = scholarship.eligible_nationalities.join(' ').toLowerCase();
      const allNations = natList.includes('all nationalities');
      const devCountries = natList.includes('developing countries') || natList.includes('dac list') || natList.includes('lmic');
      const commonwealth = natList.includes('commonwealth');
      const eea = natList.includes('eea');

      if (allNations) {
        score += 10;
        reasons.push('Open to all nationalities, so you are eligible to apply.');
      } else if (input.nationality) {
        const nat = input.nationality.toLowerCase();
        const matchesCountry = natList.includes(nat);
        const isDevelopingCountry = devCountries && (
          natList.includes('africa') || natList.includes('asia') ||
          natList.includes('selected countries') || natList.includes(nat)
        );

        if (matchesCountry || (devCountries && isDevelopingCountry)) {
          score += 10;
          reasons.push('Based on your nationality, you appear to be eligible.');
        } else if (commonwealth && nat) {
          concerns.push('This opportunity is for Commonwealth countries. Verify whether your country qualifies.');
          score += 3;
        } else if (eea && nat) {
          concerns.push('This opportunity excludes EEA nationals. You may be eligible if you are from outside the EEA.');
          score += 5;
        } else {
          concerns.push('Citizenship requirements may not match your nationality. Verify on the official website.');
          score += 2;
        }
      } else {
        nextSteps.push('Provide your nationality for better eligibility matching.');
        score += 3;
      }
    } else {
      nextSteps.push('Eligible nationalities are not confirmed — verify on the official website.');
      score += 3;
    }

    // English language (weight: 5)
    if (input.englishTestStatus && input.englishTestStatus !== 'none') {
      maxScore += 5;
      if (scholarship.language_requirements) {
        score += 5;
        reasons.push('Language requirements are documented — check if your scores meet the minimum.');
      } else {
        nextSteps.push('Language requirements are not listed — confirm on the official website.');
        score += 2;
      }
    }

    // Deadline status (weight: 5)
    maxScore += 5;
    const dlStatus = getDeadlineStatus(scholarship);
    if (dlStatus === 'open' || dlStatus === 'closing_soon') {
      score += 5;
      if (dlStatus === 'closing_soon') {
        nextSteps.push('The deadline is approaching soon — prioritize this application.');
      }
    } else if (dlStatus === 'upcoming') {
      score += 3;
      nextSteps.push('Applications have not opened yet — check the opening date.');
    } else if (dlStatus === 'closed') {
      concerns.push('The application deadline has passed. Check if applications reopen next cycle.');
      score += 0;
    } else {
      nextSteps.push('Deadline is not confirmed — check the official website regularly.');
      score += 2;
    }

    // Academic level check
    if (input.currentEducationLevel) {
      const edu = input.currentEducationLevel.toLowerCase();
      if (input.desiredDegree === 'PhD' && (edu.includes('bachelor') || edu.includes('undergraduate'))) {
        concerns.push('Most PhD programmes require a Master\'s degree. Check if you qualify with your current education level.');
      }
      if (input.desiredDegree === "Master's" && edu.includes('high school')) {
        concerns.push('A Bachelor\'s degree is typically required for Master\'s programmes.');
      }
    }

    if (nextSteps.length === 0) {
      nextSteps.push('Review the full eligibility criteria on the official website before applying.');
    }

    const percentage = Math.round((score / maxScore) * 100);
    let matchLevel: MatchResult['matchLevel'];
    if (percentage >= 70) {
      matchLevel = 'appears_to_match';
    } else if (percentage >= 40) {
      matchLevel = 'needs_verification';
    } else {
      matchLevel = 'likely_not_eligible';
    }

    return {
      scholarship,
      score: percentage,
      matchLevel,
      reasons,
      concerns,
      nextSteps,
    };
  });

  return results.sort((a, b) => b.score - a.score);
}

export function matchLevelLabel(level: MatchResult['matchLevel']): string {
  switch (level) {
    case 'appears_to_match': return 'Appears to Match';
    case 'needs_verification': return 'Needs Further Verification';
    case 'likely_not_eligible': return 'Likely Not Eligible';
  }
}

export function matchLevelColor(level: MatchResult['matchLevel']): string {
  switch (level) {
    case 'appears_to_match': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'needs_verification': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'likely_not_eligible': return 'bg-red-50 text-red-700 border-red-200';
  }
}
