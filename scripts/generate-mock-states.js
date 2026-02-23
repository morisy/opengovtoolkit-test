#!/usr/bin/env node
/**
 * Generate mock state markdown files for all 50 states + DC.
 * Skips files that already exist.
 */
const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'data', 'states');

const states = [
  {
    state: "Alabama", abbr: "AL", slug: "alabama",
    foia: "Alabama Open Records Act", foiaCite: "Ala. Code §§ 36-12-40 to 36-12-41",
    oml: "Alabama Open Meetings Act", omlCite: "Ala. Code §§ 36-25A-1 to 36-25A-11",
    response: "Reasonable time (no statutory deadline)",
    fees: "Actual cost of reproduction; search fees vary by agency",
    enforce: "Circuit Court"
  },
  {
    state: "Alaska", abbr: "AK", slug: "alaska",
    foia: "Alaska Public Records Act", foiaCite: "Alaska Stat. §§ 40.25.100–40.25.220",
    oml: "Alaska Open Meetings Act", omlCite: "Alaska Stat. §§ 44.62.310–44.62.312",
    response: "10 business days",
    fees: "Actual cost of copying; no search fees for first 5 pages",
    enforce: "Superior Court"
  },
  {
    state: "Arizona", abbr: "AZ", slug: "arizona",
    foia: "Arizona Public Records Law", foiaCite: "Ariz. Rev. Stat. §§ 39-121 to 39-161",
    oml: "Arizona Open Meeting Law", omlCite: "Ariz. Rev. Stat. §§ 38-431 to 38-431.09",
    response: "Prompt (no specific statutory deadline)",
    fees: "Actual cost of reproduction",
    enforce: "Superior Court; Attorney General"
  },
  {
    state: "Arkansas", abbr: "AR", slug: "arkansas",
    foia: "Arkansas Freedom of Information Act", foiaCite: "Ark. Code §§ 25-19-101 to 25-19-110",
    oml: "Arkansas Freedom of Information Act (meetings)", omlCite: "Ark. Code § 25-19-106",
    response: "3 business days",
    fees: "Actual cost of reproduction; no search fees",
    enforce: "Circuit Court"
  },
  {
    state: "California", abbr: "CA", slug: "california",
    foia: "California Public Records Act (CPRA)", foiaCite: "Cal. Gov. Code §§ 7920.000–7931.000",
    oml: "Ralph M. Brown Act", omlCite: "Cal. Gov. Code §§ 54950–54963",
    response: "10 calendar days (may extend 14 more)",
    fees: "Direct cost of duplication; electronic records at no cost if feasible",
    enforce: "Superior Court"
  },
  {
    state: "Colorado", abbr: "CO", slug: "colorado",
    foia: "Colorado Open Records Act (CORA)", foiaCite: "Colo. Rev. Stat. §§ 24-72-200.1 to 24-72-206",
    oml: "Colorado Open Meetings Law (Sunshine Law)", omlCite: "Colo. Rev. Stat. §§ 24-6-401 to 24-6-402",
    response: "3 business days (may extend 7 more)",
    fees: "Actual cost of reproduction; $33.58/hr after first hour of research",
    enforce: "District Court"
  },
  {
    state: "Connecticut", abbr: "CT", slug: "connecticut",
    foia: "Connecticut Freedom of Information Act", foiaCite: "Conn. Gen. Stat. §§ 1-200 to 1-242",
    oml: "Connecticut Freedom of Information Act (meetings)", omlCite: "Conn. Gen. Stat. §§ 1-225 to 1-232",
    response: "4 business days",
    fees: "Actual cost of copying; $0.50/page maximum",
    enforce: "Freedom of Information Commission; Superior Court"
  },
  {
    state: "Delaware", abbr: "DE", slug: "delaware",
    foia: "Delaware Freedom of Information Act", foiaCite: "Del. Code tit. 29, §§ 10001–10007",
    oml: "Delaware Freedom of Information Act (meetings)", omlCite: "Del. Code tit. 29, §§ 10001–10007",
    response: "15 business days",
    fees: "Reasonable fee for copying and administrative costs",
    enforce: "Attorney General; Court of Chancery"
  },
  {
    state: "District of Columbia", abbr: "DC", slug: "district-of-columbia",
    foia: "DC Freedom of Information Act", foiaCite: "D.C. Code §§ 2-531 to 2-540",
    oml: "DC Open Meetings Act", omlCite: "D.C. Code §§ 2-571 to 2-580",
    response: "15 business days (may extend 10 more)",
    fees: "Actual cost of searching and copying; first 2 hours of search free",
    enforce: "DC Superior Court; Office of Open Government"
  },
  {
    state: "Florida", abbr: "FL", slug: "florida",
    foia: "Florida Public Records Act", foiaCite: "Fla. Stat. § 119",
    oml: "Florida Sunshine Law", omlCite: "Fla. Stat. § 286.011",
    response: "Prompt (no specific statutory deadline)",
    fees: "Actual cost of duplication; $0.15/page for one-sided copies",
    enforce: "Circuit Court; Attorney General"
  },
  {
    state: "Georgia", abbr: "GA", slug: "georgia",
    foia: "Georgia Open Records Act", foiaCite: "O.C.G.A. §§ 50-18-70 to 50-18-77",
    oml: "Georgia Open Meetings Act", omlCite: "O.C.G.A. §§ 50-14-1 to 50-14-6",
    response: "3 business days",
    fees: "Actual cost of reproduction; $0.10/page for letter-size copies",
    enforce: "Superior Court; Attorney General"
  },
  {
    state: "Hawaii", abbr: "HI", slug: "hawaii",
    foia: "Uniform Information Practices Act (UIPA)", foiaCite: "Haw. Rev. Stat. §§ 92F-1 to 92F-42",
    oml: "Hawaii Sunshine Law", omlCite: "Haw. Rev. Stat. §§ 92-1 to 92-13",
    response: "10 business days (may extend 20 more in exceptional cases)",
    fees: "Actual cost of searching, reviewing, and copying",
    enforce: "Office of Information Practices; Circuit Court"
  },
  {
    state: "Idaho", abbr: "ID", slug: "idaho",
    foia: "Idaho Public Records Act", foiaCite: "Idaho Code §§ 74-101 to 74-126",
    oml: "Idaho Open Meeting Law", omlCite: "Idaho Code §§ 74-201 to 74-208",
    response: "3 business days (may extend 10 more)",
    fees: "Actual cost of copying; labor costs for extended searches",
    enforce: "District Court; Attorney General"
  },
  {
    state: "Illinois", abbr: "IL", slug: "illinois",
    foia: "Illinois Freedom of Information Act", foiaCite: "5 ILCS 140/1 et seq.",
    oml: "Illinois Open Meetings Act", omlCite: "5 ILCS 120/1 et seq.",
    response: "5 business days (may extend 5 more)",
    fees: "First 50 pages black-and-white free; $0.15/page after",
    enforce: "Public Access Counselor; Circuit Court"
  },
  {
    state: "Indiana", abbr: "IN", slug: "indiana",
    foia: "Indiana Access to Public Records Act (APRA)", foiaCite: "Ind. Code §§ 5-14-3-1 to 5-14-3-10",
    oml: "Indiana Open Door Law", omlCite: "Ind. Code §§ 5-14-1.5-1 to 5-14-1.5-8",
    response: "Reasonable time; must acknowledge within 7 calendar days",
    fees: "Actual cost of copying; $0.10/page for standard copies",
    enforce: "Public Access Counselor; Circuit Court"
  },
  {
    state: "Iowa", abbr: "IA", slug: "iowa",
    foia: "Iowa Open Records Law", foiaCite: "Iowa Code §§ 22.1–22.14",
    oml: "Iowa Open Meetings Law", omlCite: "Iowa Code §§ 21.1–21.11",
    response: "Prompt and good faith (generally 10–20 days)",
    fees: "Actual cost of copying and postage; reasonable supervisory fee",
    enforce: "Iowa Public Information Board; District Court"
  },
  {
    state: "Kansas", abbr: "KS", slug: "kansas",
    foia: "Kansas Open Records Act (KORA)", foiaCite: "Kan. Stat. §§ 45-215 to 45-223",
    oml: "Kansas Open Meetings Act (KOMA)", omlCite: "Kan. Stat. §§ 75-4317 to 75-4320a",
    response: "3 business days (may request clarification adding 2 more)",
    fees: "Actual cost of providing access; fees must be uniform",
    enforce: "District Court; Attorney General"
  },
  {
    state: "Kentucky", abbr: "KY", slug: "kentucky",
    foia: "Kentucky Open Records Act", foiaCite: "Ky. Rev. Stat. §§ 61.870–61.884",
    oml: "Kentucky Open Meetings Act", omlCite: "Ky. Rev. Stat. §§ 61.800–61.850",
    response: "5 business days (may extend for cause)",
    fees: "Actual cost of non-personal copies; $0.10/page",
    enforce: "Attorney General (binding opinions); Circuit Court"
  },
  {
    state: "Louisiana", abbr: "LA", slug: "louisiana",
    foia: "Louisiana Public Records Act", foiaCite: "La. Rev. Stat. §§ 44:1–44:41",
    oml: "Louisiana Open Meetings Law", omlCite: "La. Rev. Stat. §§ 42:11–42:28",
    response: "3 business days (may extend for cause)",
    fees: "Actual cost of reproduction; no search fees",
    enforce: "District Court; Attorney General"
  },
  {
    state: "Maine", abbr: "ME", slug: "maine",
    foia: "Maine Freedom of Access Act", foiaCite: "Me. Rev. Stat. tit. 1, §§ 400–414",
    oml: "Maine Freedom of Access Act (meetings)", omlCite: "Me. Rev. Stat. tit. 1, §§ 400–414",
    response: "5 business days (reasonable delay permitted)",
    fees: "Actual cost of copying; may charge for staff time over 2 hours",
    enforce: "Superior Court; Public Access Ombudsman"
  },
  {
    state: "Maryland", abbr: "MD", slug: "maryland",
    foia: "Maryland Public Information Act (MPIA)", foiaCite: "Md. Code, Gen. Prov. §§ 4-101 to 4-601",
    oml: "Maryland Open Meetings Act", omlCite: "Md. Code, Gen. Prov. §§ 3-101 to 3-501",
    response: "30 calendar days",
    fees: "Reasonable fees; first 2 hours of search and preparation free",
    enforce: "Circuit Court; Public Information Act Compliance Board"
  },
  // Massachusetts and Michigan already exist — skip
  {
    state: "Minnesota", abbr: "MN", slug: "minnesota",
    foia: "Minnesota Government Data Practices Act (MGDPA)", foiaCite: "Minn. Stat. §§ 13.01–13.99",
    oml: "Minnesota Open Meeting Law", omlCite: "Minn. Stat. § 13D",
    response: "Immediate (if data is public and readily available); otherwise reasonable time",
    fees: "Actual cost of copying; $0.25/page",
    enforce: "Office of Administrative Hearings; District Court"
  },
  {
    state: "Mississippi", abbr: "MS", slug: "mississippi",
    foia: "Mississippi Public Records Act", foiaCite: "Miss. Code §§ 25-61-1 to 25-61-17",
    oml: "Mississippi Open Meetings Act", omlCite: "Miss. Code §§ 25-41-1 to 25-41-17",
    response: "7 business days (may extend 7 more)",
    fees: "Actual cost of reproduction",
    enforce: "Ethics Commission; Chancery Court"
  },
  {
    state: "Missouri", abbr: "MO", slug: "missouri",
    foia: "Missouri Sunshine Law", foiaCite: "Mo. Rev. Stat. §§ 610.010–610.035",
    oml: "Missouri Sunshine Law (meetings)", omlCite: "Mo. Rev. Stat. §§ 610.010–610.035",
    response: "3 business days (may extend to end of third business day after receipt)",
    fees: "Actual cost of document search, duplication, and staff time; $0.10/page",
    enforce: "Circuit Court; Attorney General"
  },
  {
    state: "Montana", abbr: "MT", slug: "montana",
    foia: "Montana Constitution Art. II, § 9; Right to Know", foiaCite: "Mont. Code §§ 2-6-1001 to 2-6-1023",
    oml: "Montana Open Meeting Law", omlCite: "Mont. Code §§ 2-3-201 to 2-3-221",
    response: "Reasonable time (no specific statutory deadline)",
    fees: "Actual cost of producing a copy",
    enforce: "District Court"
  },
  {
    state: "Nebraska", abbr: "NE", slug: "nebraska",
    foia: "Nebraska Public Records Statutes", foiaCite: "Neb. Rev. Stat. §§ 84-712 to 84-712.09",
    oml: "Nebraska Open Meetings Act", omlCite: "Neb. Rev. Stat. §§ 84-1407 to 84-1414",
    response: "4 business days (may extend with written explanation)",
    fees: "Actual cost of reproduction; reasonable special service charge",
    enforce: "District Court; Attorney General"
  },
  {
    state: "Nevada", abbr: "NV", slug: "nevada",
    foia: "Nevada Public Records Act", foiaCite: "Nev. Rev. Stat. §§ 239.005–239.030",
    oml: "Nevada Open Meeting Law", omlCite: "Nev. Rev. Stat. §§ 241.010–241.040",
    response: "5 business days (may extend in extraordinary circumstances)",
    fees: "Actual cost of providing a copy; no fee if records available electronically",
    enforce: "District Court; Attorney General"
  },
  {
    state: "New Hampshire", abbr: "NH", slug: "new-hampshire",
    foia: "New Hampshire Right-to-Know Law", foiaCite: "N.H. Rev. Stat. §§ 91-A:1 to 91-A:10",
    oml: "New Hampshire Right-to-Know Law (meetings)", omlCite: "N.H. Rev. Stat. §§ 91-A:1 to 91-A:10",
    response: "5 business days",
    fees: "Actual cost of providing a copy; $0.25/page for paper copies",
    enforce: "Superior Court; Ombudsman"
  },
  {
    state: "New Jersey", abbr: "NJ", slug: "new-jersey",
    foia: "Open Public Records Act (OPRA)", foiaCite: "N.J. Stat. §§ 47:1A-1 to 47:1A-13",
    oml: "Open Public Meetings Act", omlCite: "N.J. Stat. §§ 10:4-6 to 10:4-21",
    response: "7 business days (may extend with written notice)",
    fees: "Actual cost of duplication; $0.05/letter-size page; $0.07/legal-size page",
    enforce: "Government Records Council; Superior Court"
  },
  {
    state: "New Mexico", abbr: "NM", slug: "new-mexico",
    foia: "New Mexico Inspection of Public Records Act (IPRA)", foiaCite: "N.M. Stat. §§ 14-2-1 to 14-2-12",
    oml: "New Mexico Open Meetings Act", omlCite: "N.M. Stat. §§ 10-15-1 to 10-15-4",
    response: "15 calendar days (may extend with written explanation)",
    fees: "Actual cost of copying; $1.00/page if actual cost not available",
    enforce: "District Court; Attorney General"
  },
  {
    state: "New York", abbr: "NY", slug: "new-york",
    foia: "New York Freedom of Information Law (FOIL)", foiaCite: "N.Y. Pub. Off. Law §§ 84–90",
    oml: "New York Open Meetings Law", omlCite: "N.Y. Pub. Off. Law §§ 100–111",
    response: "5 business days (may acknowledge and take reasonable time)",
    fees: "Actual cost of reproduction; $0.25/page for up to 9x14 inches",
    enforce: "Committee on Open Government; Article 78 proceeding in Supreme Court"
  },
  {
    state: "North Carolina", abbr: "NC", slug: "north-carolina",
    foia: "North Carolina Public Records Law", foiaCite: "N.C. Gen. Stat. §§ 132-1 to 132-10",
    oml: "North Carolina Open Meetings Law", omlCite: "N.C. Gen. Stat. §§ 143-318.9 to 143-318.18",
    response: "Prompt (as promptly as possible; no specific deadline)",
    fees: "Actual cost of reproducing and copying; reasonable special service charges",
    enforce: "Superior Court"
  },
  {
    state: "North Dakota", abbr: "ND", slug: "north-dakota",
    foia: "North Dakota Open Records Law", foiaCite: "N.D. Cent. Code §§ 44-04-18 to 44-04-18.27",
    oml: "North Dakota Open Meetings Law", omlCite: "N.D. Cent. Code §§ 44-04-19 to 44-04-21",
    response: "Reasonable time (one business day for determining if records are open)",
    fees: "Actual cost of copying; $0.25/page; reasonable hourly fee for time exceeding 1 hour",
    enforce: "Attorney General (opinions); District Court"
  },
  {
    state: "Ohio", abbr: "OH", slug: "ohio",
    foia: "Ohio Public Records Act", foiaCite: "Ohio Rev. Code § 149.43",
    oml: "Ohio Open Meetings Act (Sunshine Law)", omlCite: "Ohio Rev. Code § 121.22",
    response: "Reasonable time (prompt preparation)",
    fees: "Actual cost of copying; no search fees; $0.05/page suggested",
    enforce: "Court of Claims; Mandamus in any court; Attorney General",
  },
  {
    state: "Oklahoma", abbr: "OK", slug: "oklahoma",
    foia: "Oklahoma Open Records Act", foiaCite: "Okla. Stat. tit. 51, §§ 24A.1–24A.30",
    oml: "Oklahoma Open Meeting Act", omlCite: "Okla. Stat. tit. 25, §§ 301–314",
    response: "Prompt and reasonable (no specific statutory deadline)",
    fees: "Actual cost of copying; $0.25/page for standard copies",
    enforce: "District Court; District Attorney; Attorney General"
  },
  {
    state: "Oregon", abbr: "OR", slug: "oregon",
    foia: "Oregon Public Records Law", foiaCite: "Or. Rev. Stat. §§ 192.311–192.478",
    oml: "Oregon Public Meetings Law", omlCite: "Or. Rev. Stat. §§ 192.610–192.690",
    response: "5 business days (may extend with written notice)",
    fees: "Actual cost of providing a copy; may include search and review time",
    enforce: "Circuit Court; Attorney General; District Attorney"
  },
  {
    state: "Pennsylvania", abbr: "PA", slug: "pennsylvania",
    foia: "Pennsylvania Right-to-Know Law", foiaCite: "65 Pa. Stat. §§ 67.101–67.3104",
    oml: "Pennsylvania Sunshine Act", omlCite: "65 Pa. Stat. §§ 701–716",
    response: "5 business days (may extend 30 more)",
    fees: "Actual cost of duplication; $0.25/page for paper copies",
    enforce: "Office of Open Records; Commonwealth Court; Court of Common Pleas"
  },
  {
    state: "Rhode Island", abbr: "RI", slug: "rhode-island",
    foia: "Rhode Island Access to Public Records Act (APRA)", foiaCite: "R.I. Gen. Laws §§ 38-2-1 to 38-2-15",
    oml: "Rhode Island Open Meetings Act", omlCite: "R.I. Gen. Laws §§ 42-46-1 to 42-46-14",
    response: "10 business days (may extend 20 more)",
    fees: "Actual cost of copying; $0.15/page",
    enforce: "Attorney General; Superior Court"
  },
  {
    state: "South Carolina", abbr: "SC", slug: "south-carolina",
    foia: "South Carolina Freedom of Information Act", foiaCite: "S.C. Code §§ 30-4-10 to 30-4-165",
    oml: "South Carolina Freedom of Information Act (meetings)", omlCite: "S.C. Code §§ 30-4-60 to 30-4-100",
    response: "15 business days (may extend 10 more with written explanation)",
    fees: "Actual cost of searching and copying; $0.20/page",
    enforce: "Circuit Court"
  },
  {
    state: "South Dakota", abbr: "SD", slug: "south-dakota",
    foia: "South Dakota Open Records Law", foiaCite: "S.D. Codified Laws §§ 1-27-1 to 1-27-1.18",
    oml: "South Dakota Open Meetings Law", omlCite: "S.D. Codified Laws §§ 1-25-1 to 1-25-6",
    response: "Reasonable time (no specific statutory deadline)",
    fees: "Actual cost of providing a copy; reasonable per-page fee",
    enforce: "Circuit Court"
  },
  {
    state: "Tennessee", abbr: "TN", slug: "tennessee",
    foia: "Tennessee Public Records Act", foiaCite: "Tenn. Code §§ 10-7-503 to 10-7-512",
    oml: "Tennessee Open Meetings Act (Sunshine Law)", omlCite: "Tenn. Code §§ 8-44-101 to 8-44-111",
    response: "7 business days (promptly)",
    fees: "Actual cost of reproduction; labor costs for extensive requests",
    enforce: "Chancery Court; Office of Open Records Counsel"
  },
  {
    state: "Texas", abbr: "TX", slug: "texas",
    foia: "Texas Public Information Act (TPIA)", foiaCite: "Tex. Gov. Code §§ 552.001–552.353",
    oml: "Texas Open Meetings Act", omlCite: "Tex. Gov. Code §§ 551.001–551.146",
    response: "10 business days (must request AG ruling within that period if withholding)",
    fees: "Actual cost of reproduction; labor charges for programming/manipulation; $0.10/page",
    enforce: "Attorney General (rulings); District Court"
  },
  {
    state: "Utah", abbr: "UT", slug: "utah",
    foia: "Government Records Access and Management Act (GRAMA)", foiaCite: "Utah Code §§ 63G-2-101 to 63G-2-901",
    oml: "Utah Open and Public Meetings Act", omlCite: "Utah Code §§ 52-4-101 to 52-4-305",
    response: "10 business days (may extend with written explanation)",
    fees: "Actual cost of providing a copy; reasonable hourly rate for compilation",
    enforce: "State Records Committee; District Court"
  },
  {
    state: "Vermont", abbr: "VT", slug: "vermont",
    foia: "Vermont Public Records Act", foiaCite: "Vt. Stat. tit. 1, §§ 315–320",
    oml: "Vermont Open Meeting Law", omlCite: "Vt. Stat. tit. 1, §§ 310–314",
    response: "3 business days (may extend 10 more with notice)",
    fees: "Actual cost of providing a copy; reasonable labor costs",
    enforce: "Superior Court; Secretary of State"
  },
  {
    state: "Virginia", abbr: "VA", slug: "virginia",
    foia: "Virginia Freedom of Information Act (VFOIA)", foiaCite: "Va. Code §§ 2.2-3700 to 2.2-3714",
    oml: "Virginia Freedom of Information Act (meetings)", omlCite: "Va. Code §§ 2.2-3707 to 2.2-3712",
    response: "5 business days (may invoke 7 more working days)",
    fees: "Actual cost of copying, search time, and computer time",
    enforce: "FOIA Council (advisory opinions); General District or Circuit Court"
  },
  {
    state: "Washington", abbr: "WA", slug: "washington",
    foia: "Washington Public Records Act (PRA)", foiaCite: "Wash. Rev. Code §§ 42.56.001–42.56.904",
    oml: "Washington Open Public Meetings Act", omlCite: "Wash. Rev. Code §§ 42.30.010–42.30.920",
    response: "5 business days (must respond; may provide installments)",
    fees: "Default charges set by statute; $0.15/page; no search or review fees",
    enforce: "Superior Court (penalties of $100/day for violations)"
  },
  {
    state: "West Virginia", abbr: "WV", slug: "west-virginia",
    foia: "West Virginia Freedom of Information Act", foiaCite: "W. Va. Code §§ 29B-1-1 to 29B-1-7",
    oml: "West Virginia Open Governmental Proceedings Act", omlCite: "W. Va. Code §§ 6-9A-1 to 6-9A-12",
    response: "5 business days",
    fees: "Actual cost of copying; may charge for search and review time",
    enforce: "Circuit Court"
  },
  {
    state: "Wisconsin", abbr: "WI", slug: "wisconsin",
    foia: "Wisconsin Open Records Law", foiaCite: "Wis. Stat. §§ 19.31–19.39",
    oml: "Wisconsin Open Meetings Law", omlCite: "Wis. Stat. §§ 19.81–19.98",
    response: "10 business days (as soon as practicable without delay)",
    fees: "Actual, necessary, and direct cost of reproduction; location fee limited",
    enforce: "Circuit Court; District Attorney"
  },
  {
    state: "Wyoming", abbr: "WY", slug: "wyoming",
    foia: "Wyoming Public Records Act", foiaCite: "Wyo. Stat. §§ 16-4-201 to 16-4-205",
    oml: "Wyoming Public Meetings Act", omlCite: "Wyo. Stat. §§ 16-4-401 to 16-4-408",
    response: "Reasonable time (no specific statutory deadline)",
    fees: "Actual cost of providing a copy",
    enforce: "District Court"
  }
];

function generateMd(s) {
  return `---
state: "${s.state}"
abbreviation: "${s.abbr}"
foia_law: "${s.foia}"
foia_citation: "${s.foiaCite}"
open_meetings_law: "${s.oml}"
open_meetings_citation: "${s.omlCite}"
response_time: "${s.response}"
fee_structure: "${s.fees}"
enforcement_body: "${s.enforce}"
last_updated: "2025-01-15"
---

## Right Now

**You have the right to request public records in ${s.state}.** Any person can submit a public records request to any public body in ${s.state}. You do not need to give a reason for your request.

**Key points:**
- Requests should be in writing (email is typically acceptable)
- Agencies must respond within ${s.response.toLowerCase().includes('no') ? 'a reasonable time' : s.response.toLowerCase()}
- If denied, the response must cite a specific exemption
- You do not need to be a ${s.state} resident to make a request

**Sample request language you can copy:**

> Pursuant to the ${s.foia}, ${s.foiaCite}, I am requesting copies of the following records: [describe records]. I request a fee waiver or reduction, as disclosure of this information is in the public interest. Please respond within the time period required by law. If any portion of this request is denied, please cite the specific exemption and release all reasonably segregable portions.

## Records Laws

${s.state}'s ${s.foia} provides public access to government records held by state and local agencies.

### What you can request

Public records generally include any document, file, or data created or maintained by a government agency. This includes:
- Documents, emails, and text messages
- Databases and spreadsheets
- Photographs, audio, and video recordings
- Contracts, invoices, and financial records
- Meeting minutes and agendas

### Key exemptions

Common exemptions under ${s.state} law include:
- **Personal privacy** — records containing sensitive personal information (Social Security numbers, medical records)
- **Law enforcement** — investigatory records that could interfere with active investigations
- **Attorney-client privilege** — communications between government attorneys and their clients
- **Trade secrets** — confidential commercial or financial information
- **Deliberative process** — internal pre-decisional communications in some cases

The agency bears the burden of justifying any denial and must release reasonably segregable non-exempt portions.

### Fees

Under ${s.state} law:
- ${s.fees}
- You can request a fee estimate before the agency begins processing
- You can request a fee waiver if disclosure serves the public interest
- Electronic records should generally be provided in the format requested

### Appeals

If your request is denied or you receive an inadequate response:
1. You may appeal to ${s.enforce.includes(';') ? s.enforce.split(';')[0].trim() : 'the head of the agency'}
2. ${s.enforce.includes('Court') ? 'You may file a lawsuit in ' + s.enforce.split(';').pop().trim() : 'You may seek judicial review'}
3. If you prevail, you may be eligible to recover attorney fees and costs

## Open Meetings

${s.state}'s ${s.oml} requires that government bodies conduct their business openly.

### What's covered

A "meeting" generally occurs whenever a quorum of a public body gathers to discuss or act on public business. This includes:
- Regular and special meetings
- Committee and subcommittee meetings
- Work sessions and retreats
- Electronic or telephonic meetings (with conditions)

### Closed session exceptions

Public bodies may meet in closed session only for limited purposes, typically including:
- Personnel matters (hiring, firing, discipline)
- Pending or threatened litigation
- Real estate negotiations
- Labor negotiations or collective bargaining strategy
- Security-related discussions

### Your rights at meetings

- You have the right to attend and observe all open meetings
- You have the right to record meetings (audio and video)
- Agencies must provide advance notice of meetings
- Minutes or recordings must be made available to the public
- Many bodies provide a public comment period

### Enforcement

Violations of ${s.state}'s open meetings law can result in:
- Invalidation of actions taken in improper closed sessions
- Civil fines or penalties against individual members
- Injunctive relief ordering future compliance
- Attorney fees for successful plaintiffs

## Tips and Resources

### Practical tips for ${s.state} public records requests

1. **Be specific** — clearly describe the records you want, including date ranges, departments, and key terms
2. **Ask for electronic copies** — they're usually cheaper and faster to produce
3. **Request a fee estimate** — ask for a detailed cost breakdown before the agency begins processing
4. **Keep records** — save copies of your request, all correspondence, and any fee receipts
5. **Know the appeals process** — if your request is denied, you have the right to appeal to ${s.enforce.includes(';') ? s.enforce.split(';')[0].trim() : 'the courts'}

### Key contacts

- **${s.state} Attorney General's Office** — may provide guidance on public records compliance
- **${s.state} Press Association** — may offer FOI resources and support for journalists
- **Reporters Committee for Freedom of the Press** — free legal support and resources at rcfp.org

### Useful links

- [Reporters Committee FOI guide for ${s.state}](https://www.rcfp.org/open-government-guide/${s.slug}/)
- [National Freedom of Information Coalition](https://www.nfoic.org/)
`;
}

let created = 0;
let skipped = 0;
for (const s of states) {
  const filePath = path.join(statesDir, s.slug + '.md');
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }
  fs.writeFileSync(filePath, generateMd(s));
  created++;
}

console.log(`Created ${created} state file(s), skipped ${skipped} existing file(s).`);
