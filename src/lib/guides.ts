export interface GuideSection {
  heading: string;
  body: string;
  checklist?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  sections: GuideSection[];
  resources: { label: string; url: string }[];
}

export const guides: Guide[] = [
  {
    slug: 'fully-funded-masters-scholarships',
    title: 'How to Find Fully Funded Master\'s Scholarships',
    excerpt: 'A practical guide to identifying and applying for Master\'s programmes that cover tuition, living costs, and more.',
    readTime: '6 min read',
    sections: [
      {
        heading: 'Understand what "fully funded" means',
        body: 'A fully funded scholarship typically covers full tuition fees, a monthly or annual stipend for living expenses, travel costs, and sometimes health insurance. Government scholarships like Chevening, DAAD, and Australia Awards are well-known examples. University-specific scholarships like Gates Cambridge, Clarendon, and Knight-Hennessy also offer full funding. Always verify what "fully funded" includes on the official scholarship page — some cover tuition only, while others include all living costs.',
      },
      {
        heading: 'Where to search',
        body: 'Start with government scholarship programmes from your target countries. Many governments offer scholarships for international students as part of their diplomatic and development strategies. University websites are another key source — look for graduate funding pages. Platforms like ScholarPath aggregate these opportunities so you can search across multiple sources. Focus on scholarships from the UK, Germany, Netherlands, Sweden, Australia, Canada, and the US, as these countries have well-established international scholarship programmes.',
      },
      {
        heading: 'Key fully funded Master\'s scholarships',
        body: 'Some of the most well-known fully funded Master\'s scholarships include: Chevening (UK), DAAD EPOS (Germany), Erasmus Mundus (EU), Swedish Institute SISGP (Sweden), Australia Awards (Australia), Commonwealth Scholarships (UK), Eiffel Scholarship (France, partial), and Holland Scholarship (Netherlands, partial). University-specific options include Gates Cambridge, Clarendon at Oxford, Knight-Hennessy at Stanford, and ETH Zurich ESOP.',
      },
      {
        heading: 'Build a strong application',
        body: 'Fully funded scholarships are highly competitive. You need: strong academic transcripts, a compelling personal statement, relevant work or volunteer experience, and strong references. Start preparing 6-12 months before the deadline.',
        checklist: [
          'Research 10+ scholarships and note their deadlines',
          'Identify your top 5 and read their eligibility criteria carefully',
          'Prepare your CV in the format expected by each scholarship',
          'Draft your personal statement and get feedback',
          'Contact referees at least 2 months before the deadline',
          'Take any required English language tests early',
          'Apply to your chosen university programmes in parallel',
          'Submit all documents before the deadline — do not wait until the last day',
        ],
      },
    ],
    resources: [
      { label: 'Chevening Scholarships', url: 'https://www.chevening.org/scholarships/' },
      { label: 'DAAD Scholarships', url: 'https://www.daad.de/en/' },
      { label: 'Erasmus Mundus', url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus_en' },
    ],
  },
  {
    slug: 'funded-phd-programmes',
    title: 'How to Find Funded PhD Programmes',
    excerpt: 'Discover the different routes to securing full funding for your doctoral studies abroad.',
    readTime: '7 min read',
    sections: [
      {
        heading: 'Types of PhD funding',
        body: 'PhD funding comes in several forms: studentships (employed as a university staff member with a salary), graduate research scholarships (tuition + stipend), teaching or research assistantships (work-based funding), and external fellowships (from governments or foundations). In many European countries like Sweden, Denmark, Finland, and the Netherlands, PhD students are employed as full-time staff and receive a salary. In the UK and US, PhD funding typically comes through scholarships and assistantships.',
      },
      {
        heading: 'Finding the right supervisor',
        body: 'For research-based PhD programmes, identifying and contacting a potential supervisor is often the most important step. Before applying, research faculty members whose work aligns with your research interests. Send them a concise email with your CV and a brief research proposal. A supervisor who is interested in your profile can often help secure funding or direct you to available positions.',
        checklist: [
          'Identify 5-10 faculty whose research aligns with yours',
          'Read 2-3 of their recent papers',
          'Send a personalised email with your CV and research interests',
          'Follow up after 2 weeks if no response',
          'Ask about available funding and positions',
        ],
      },
      {
        heading: 'Countries with salaried PhD positions',
        body: 'In Sweden, Denmark, Finland, Norway, and the Netherlands, PhD students are typically employed by the university as full-time staff. This means you receive a salary, not just a stipend, and there are no tuition fees. Look for job postings on university websites. In Germany, DAAD offers funded PhD positions through structured programmes. In Switzerland, ETH Zurich and EPFL offer competitive doctoral positions with salaries.',
      },
      {
        heading: 'Key funded PhD opportunities',
        body: 'Notable funded PhD programmes include: Vanier Canada Graduate Scholarships, University of Melbourne Graduate Research Scholarships, Adelaide Scholarships International, Nanyang President\'s Graduate Scholarship (Singapore), SINGA (Singapore), University of Copenhagen PhD Scholarships, Aalto University Doctoral Programme (Finland), and Örebro University Doctoral Studentships (Sweden).',
      },
    ],
    resources: [
      { label: 'Vanier Canada Graduate Scholarships', url: 'https://vanier.gc.ca/' },
      { label: 'FindAPhD.com', url: 'https://www.findaphd.com/' },
      { label: 'DAAD PhD Funding', url: 'https://www.daad.de/en/' },
    ],
  },
  {
    slug: 'apply-for-international-scholarships',
    title: 'How to Apply for International Scholarships',
    excerpt: 'A step-by-step walkthrough of the scholarship application process from research to submission.',
    readTime: '8 min read',
    sections: [
      {
        heading: 'Step 1: Research and shortlist',
        body: 'Start researching scholarships at least 12 months before your intended start date. Many scholarships have deadlines 8-10 months before the programme begins. Create a spreadsheet to track scholarship names, deadlines, eligibility criteria, required documents, and links to official sources. Use ScholarPath to search and filter opportunities by your field, destination, and funding needs.',
      },
      {
        heading: 'Step 2: Check eligibility carefully',
        body: 'Read the eligibility criteria on the official scholarship website — not just summaries. Pay attention to nationality requirements, academic qualifications, work experience requirements, age limits, and language requirements. Applying for scholarships you are not eligible for wastes valuable time.',
        checklist: [
          'Nationality/citizenship requirements',
          'Minimum academic qualifications',
          'Work experience requirements',
          'Age restrictions',
          'Language proficiency requirements',
          'Field of study restrictions',
          'Available funding levels (full vs partial)',
        ],
      },
      {
        heading: 'Step 3: Prepare your documents',
        body: 'Most scholarship applications require: academic transcripts, degree certificates, a CV/resume, a personal statement or motivation letter, reference letters, language test scores, and a research proposal (for PhD). Prepare these well in advance. Get your transcripts certified and translated if required. Request reference letters at least 2 months before deadlines.',
      },
      {
        heading: 'Step 4: Write a compelling personal statement',
        body: 'Your personal statement is your chance to show who you are beyond your grades. Explain your academic journey, your motivation for studying abroad, your career goals, and how the scholarship will help you contribute to your home country or community. Be specific, be honest, and be concise. Tailor each statement to the specific scholarship.',
      },
      {
        heading: 'Step 5: Submit and follow up',
        body: 'Submit your application well before the deadline — do not wait until the last day, as websites may be slow or down. After submission, check your email regularly for confirmation and follow-up requests. Some scholarships require interviews — prepare by researching common questions and practising your responses.',
      },
    ],
    resources: [
      { label: 'Scholarships Portal (ScholarPath)', url: '/explore' },
      { label: 'Prospects Hobbies — Study Abroad', url: 'https://www.prospects.ac.uk/study-abroad' },
    ],
  },
  {
    slug: 'prepare-scholarship-application',
    title: 'How to Prepare a Scholarship Application',
    excerpt: 'Everything you need to prepare before you start your scholarship applications.',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Gather your academic documents',
        body: 'Start by collecting all your academic transcripts and degree certificates. If they are not in English, get certified translations. Some scholarships require apostille or notarised copies. Check the specific requirements of each scholarship.',
        checklist: [
          'Official transcripts from all universities attended',
          'Degree certificates (certified copies)',
          'Certified English translations if originals are not in English',
          'Grading system explanation if your institution uses a non-standard scale',
        ],
      },
      {
        heading: 'Prepare your CV',
        body: 'Create a clear, professional CV that highlights your academic achievements, work experience, volunteer work, publications (if any), and extracurricular activities. Keep it to 1-2 pages. Use a clean format with clear headings. Tailor your CV for each scholarship if needed.',
      },
      {
        heading: 'Build your reference network',
        body: 'Most scholarships require 2-3 reference letters. Identify potential referees early — academic supervisors, professors who taught you, or employers who can speak to your skills. Give them at least 2 months notice. Provide them with your CV, transcript, and the scholarship details so they can write a relevant letter.',
        checklist: [
          'Identify 3-4 potential referees',
          'Contact them at least 2 months before deadlines',
          'Share your CV, transcript, and scholarship details',
          'Remind them 2 weeks before the deadline',
          'Thank them after submission',
        ],
      },
      {
        heading: 'Take required tests early',
        body: 'If you need IELTS, TOEFL, GRE, or GMAT scores, book your test at least 3-4 months before scholarship deadlines. This gives you time to retake the test if needed. Send official score reports to institutions well in advance — they can take 4-6 weeks to arrive.',
      },
    ],
    resources: [
      { label: 'IELTS Official Site', url: 'https://www.ielts.org/' },
      { label: 'TOEFL Official Site', url: 'https://www.ets.org/toefl' },
    ],
  },
  {
    slug: 'ielts-english-requirements',
    title: 'Understanding IELTS and English-Language Requirements',
    excerpt: 'What English tests you need, what scores to aim for, and how to prepare.',
    readTime: '5 min read',
    sections: [
      {
        heading: 'Common English language tests',
        body: 'The most widely accepted English language tests are IELTS (International English Language Testing System) and TOEFL (Test of English as a Foreign Language). Most universities accept both, but some prefer one over the other. Check the specific requirements of each university and scholarship. Other accepted tests include PTE Academic, Cambridge English qualifications (C1 Advanced, C2 Proficiency), and Duolingo English Test (increasingly accepted, especially post-pandemic).',
      },
      {
        heading: 'Score requirements',
        body: 'For most Master\'s programmes, the minimum IELTS requirement is 6.5 overall (with no band below 6.0), or TOEFL 90-100. For PhD programmes, requirements may be higher — IELTS 7.0 or TOEFL 100+. Competitive scholarships like Chevening require you to meet the English language requirement of your chosen university programme. Some scholarships have their own minimum requirements in addition to the university\'s.',
        checklist: [
          'IELTS 6.5 overall, no band below 6.0 — most Master\'s programmes',
          'IELTS 7.0 overall — competitive programmes and some PhDs',
          'TOEFL 90 (iBT) — minimum for many programmes',
          'TOEFL 100 (iBT) — competitive programmes',
          'Check both university AND scholarship requirements',
        ],
      },
      {
        heading: 'Preparing for IELTS',
        body: 'The IELTS has four sections: Listening, Reading, Writing, and Speaking. Each section is scored from 0-9, and the overall score is an average. To prepare, use official IELTS practice materials, take practice tests under timed conditions, and focus on your weakest sections. The British Council and IDP offer free practice resources online. Aim to take the test at least 3 months before your earliest deadline.',
      },
      {
        heading: 'Test validity',
        body: 'IELTS and TOEFL scores are valid for 2 years from the test date. Plan accordingly — if you are applying for scholarships with deadlines spread over several months, make sure your scores will still be valid for all of them.',
      },
    ],
    resources: [
      { label: 'IELTS Preparation (British Council)', url: 'https://www.britishcouncil.org/exam/ielts/preparation' },
      { label: 'TOEFL Preparation (ETS)', url: 'https://www.ets.org/toefl/prepare' },
      { label: 'Duolingo English Test', url: 'https://englishtest.duolingo.com/' },
    ],
  },
  {
    slug: 'writing-statement-of-purpose',
    title: 'Writing a Statement of Purpose',
    excerpt: 'How to write a compelling statement of purpose that stands out to scholarship committees.',
    readTime: '6 min read',
    sections: [
      {
        heading: 'What is a statement of purpose?',
        body: 'A statement of purpose (SOP) — also called a personal statement, motivation letter, or cover letter — is your opportunity to tell the scholarship committee who you are, why you want to study your chosen field, why you chose their programme, and what you plan to do with the knowledge. It is often the most important part of your application after your academic record.',
      },
      {
        heading: 'Structure your SOP',
        body: 'A strong SOP typically follows this structure: an engaging introduction that captures your motivation, your academic background and key achievements, relevant work or research experience, why you chose this specific programme and university, your future goals and how this scholarship helps achieve them, and a strong conclusion. Keep it to 500-1000 words unless a different limit is specified.',
        checklist: [
          'Introduction — your motivation and story',
          'Academic background and achievements',
          'Relevant experience (work, research, volunteering)',
          'Why this programme and university specifically',
          'Future career goals and impact',
          'Conclusion — restate your commitment',
        ],
      },
      {
        heading: 'Do\'s and don\'ts',
        body: 'Do: be specific and personal, use concrete examples, show rather than tell, proofread carefully, and tailor each SOP to the specific scholarship. Don\'t: copy templates or sample SOPs, use clichés like "ever since I was a child", exceed the word limit, list your CV in paragraph form, or write generic statements that could apply to any programme.',
      },
      {
        heading: 'Get feedback',
        body: 'After writing your first draft, get feedback from at least two people — ideally a mentor, professor, or someone who has successfully applied for similar scholarships. Revise based on their feedback. Read your SOP aloud to check flow and clarity. Make sure every sentence serves a purpose.',
      },
    ],
    resources: [
      { label: 'Purdue OWL — Personal Statements', url: 'https://owl.purdue.edu/' },
    ],
  },
  {
    slug: 'scholarships-without-ielts',
    title: 'Finding Scholarships Without IELTS',
    excerpt: 'Many programmes accept alternative English proofs or waive the requirement entirely — here\'s how to find them.',
    readTime: '4 min read',
    sections: [
      {
        heading: 'When IELTS may not be required',
        body: 'Some universities waive the English language test requirement if: your previous degree was taught entirely in English, you are from a country where English is an official language, or you can provide a letter from your university confirming the medium of instruction was English. Always check the official university admissions page — not just the scholarship page — for their English language policy.',
      },
      {
        heading: 'Alternative English tests',
        body: 'Many universities accept alternatives to IELTS: TOEFL, PTE Academic, Cambridge C1 Advanced (CAE) or C2 Proficiency (CPE), and the Duolingo English Test. The Duolingo test is significantly cheaper and can be taken online from home. Some universities also conduct their own English interviews or written assessments.',
      },
      {
        heading: 'Countries with flexible English requirements',
        body: 'Germany is notably flexible — many DAAD-funded programmes accept a medium-of-instruction certificate from your undergraduate university instead of IELTS. Some universities in Sweden, Norway, and Finland also accept alternative proofs. In China, many English-taught programmes under the CSC scholarship do not require IELTS if your previous education was in English. However, never assume — always verify on the official programme page.',
        checklist: [
          'Check if your previous degree was taught in English',
          'Request a medium-of-instruction letter from your university',
          'Look for universities accepting Duolingo or PTE as alternatives',
          'Check if the university conducts its own English assessment',
          'Always verify on the official programme website',
        ],
      },
      {
        heading: 'Important caveat',
        body: 'Even when a scholarship does not require IELTS, the university programme might. The scholarship and university admission are often separate processes — you need to meet both sets of requirements. If the university requires IELTS for admission, you will need it regardless of the scholarship\'s policy. Always check both.',
      },
    ],
    resources: [
      { label: 'DAAD — English Language Requirements', url: 'https://www.daad.de/en/' },
      { label: 'Duolingo English Test', url: 'https://englishtest.duolingo.com/' },
    ],
  },
];
