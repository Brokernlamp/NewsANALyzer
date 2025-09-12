// Topic humanization mapping
const TOPIC_MAPPING: Record<string, string> = {
  'polity-governance': 'Polity & Governance',
  'security': 'Security',
  'economy': 'Economy',
  'environment': 'Environment',
  'science-technology': 'Science & Technology',
  'international-relations': 'International Relations',
  'social-issues': 'Social Issues',
  'history-culture': 'History & Culture',
  'geography': 'Geography',
  'current-affairs': 'Current Affairs',
  'ethics': 'Ethics',
  'public-administration': 'Public Administration',
  'disaster-management': 'Disaster Management',
  'agriculture': 'Agriculture',
  'health': 'Health',
  'education': 'Education',
  'infrastructure': 'Infrastructure',
  'energy': 'Energy',
  'transport': 'Transport',
  'communication': 'Communication',
  'tourism': 'Tourism',
  'sports': 'Sports',
  'art-culture': 'Art & Culture',
  'literature': 'Literature',
  'philosophy': 'Philosophy',
  'sociology': 'Sociology',
  'psychology': 'Psychology',
  'anthropology': 'Anthropology',
  'political-science': 'Political Science',
  'public-policy': 'Public Policy',
  'governance': 'Governance',
  'constitution': 'Constitution',
  'fundamental-rights': 'Fundamental Rights',
  'directive-principles': 'Directive Principles',
  'fundamental-duties': 'Fundamental Duties',
  'parliamentary-system': 'Parliamentary System',
  'judiciary': 'Judiciary',
  'executive': 'Executive',
  'legislature': 'Legislature',
  'election-commission': 'Election Commission',
  'comptroller-auditor-general': 'Comptroller & Auditor General',
  'union-public-service-commission': 'Union Public Service Commission',
  'finance-commission': 'Finance Commission',
  'planning-commission': 'Planning Commission',
  'niti-aayog': 'NITI Aayog',
  'reserve-bank-of-india': 'Reserve Bank of India',
  'securities-and-exchange-board-of-india': 'Securities and Exchange Board of India',
  'insurance-regulatory-and-development-authority': 'Insurance Regulatory and Development Authority',
  'pension-fund-regulatory-and-development-authority': 'Pension Fund Regulatory and Development Authority',
  'competition-commission-of-india': 'Competition Commission of India',
  'central-vigilance-commission': 'Central Vigilance Commission',
  'central-information-commission': 'Central Information Commission',
  'national-human-rights-commission': 'National Human Rights Commission',
  'national-commission-for-women': 'National Commission for Women',
  'national-commission-for-minorities': 'National Commission for Minorities',
  'national-commission-for-scheduled-castes': 'National Commission for Scheduled Castes',
  'national-commission-for-scheduled-tribes': 'National Commission for Scheduled Tribes',
  'national-commission-for-backward-classes': 'National Commission for Backward Classes',
  'national-commission-for-protection-of-child-rights': 'National Commission for Protection of Child Rights',
  'national-commission-for-senior-citizens': 'National Commission for Senior Citizens',
  'national-commission-for-safai-karamcharis': 'National Commission for Safai Karamcharis',
  'national-commission-for-linguistic-minorities': 'National Commission for Linguistic Minorities',
  'national-commission-for-religious-and-linguistic-minorities': 'National Commission for Religious and Linguistic Minorities',
  'national-commission-for-minority-educational-institutions': 'National Commission for Minority Educational Institutions'
}

// Newspaper title case mapping
const NEWSPAPER_MAPPING: Record<string, string> = {
  'the-hindu': 'The Hindu',
  'indian-express': 'Indian Express',
  'times-of-india': 'Times of India',
  'hindustan-times': 'Hindustan Times',
  'economic-times': 'Economic Times',
  'business-standard': 'Business Standard',
  'mint': 'Mint',
  'livemint': 'Livemint',
  'financial-express': 'Financial Express',
  'business-line': 'Business Line',
  'deccan-herald': 'Deccan Herald',
  'the-telegraph': 'The Telegraph',
  'the-tribune': 'The Tribune',
  'the-pioneer': 'The Pioneer',
  'the-asian-age': 'The Asian Age',
  'deccan-chronicle': 'Deccan Chronicle',
  'new-indian-express': 'New Indian Express',
  'the-hans-india': 'The Hans India',
  'sakshi': 'Sakshi',
  'andhra-jyothy': 'Andhra Jyothy',
  'eenadu': 'Eenadu',
  'vaartha': 'Vaartha',
  'andhra-prabha': 'Andhra Prabha',
  'andhra-bhoomi': 'Andhra Bhoomi',
  'andhra-patrika': 'Andhra Patrika'
}

export function humanizeTopic(slug: string): string {
  return TOPIC_MAPPING[slug] || titleCase(slug)
}

export function humanizeNewspaper(slug: string): string {
  return NEWSPAPER_MAPPING[slug] || titleCase(slug)
}

export function titleCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function getTodayIST(): string {
  // Get current date in Indian Standard Time (IST)
  const now = new Date()
  const indiaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
  const year = indiaTime.getFullYear()
  const month = String(indiaTime.getMonth() + 1).padStart(2, '0')
  const day = String(indiaTime.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayISTForInput(): string {
  // Get current date in IST for HTML date input
  return getTodayIST()
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00+05:30') // IST timezone
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  })
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00+05:30') // IST timezone
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  })
}

export function isValidISTDate(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00+05:30') // IST timezone
  return date instanceof Date && !isNaN(date.getTime()) && !!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)
}
