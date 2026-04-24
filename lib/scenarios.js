// Scenario data for the Brevet Sales Simulation
// Structure: industry > round (motion) > full scenario brief
// All four industries share the same four motions (Legacy Displacement, Replacement, Defense, Expansion)
// For the initial demo, we've fully built out Round 1 across all four industries.
// Rounds 2-4 can be filled in with the same structure.

export const MOTIONS = {
  legacyDisplacement: {
    id: "legacy-displacement",
    number: "01",
    name: "Legacy Displacement",
    roundColor: "var(--r1-slate)",
    description: "The customer doesn't know they need to change yet. Build the business case that creates the buying decision.",
    frameworkCards: [
      {
        number: "01",
        name: "VALUE GAPS",
        heading: "Value Gaps",
        prompt: "Where is their current approach falling short of what the business now needs?",
      },
      {
        number: "02",
        name: "ART OF THE POSSIBLE",
        heading: "Art of the Possible",
        prompt: "What new capabilities unlock outcomes their current stack cannot reach?",
      },
      {
        number: "03",
        name: "IMPACT",
        heading: "Impact",
        prompt: "What measurable business outcomes will this deliver over 12, 24, 36 months?",
      },
      {
        number: "04",
        name: "CUSTOMER STORY",
        heading: "Customer Story",
        prompt: "What proof do you have that this works? Name a parallel.",
      },
    ],
    scoringCriteria: [
      {
        name: "Status Quo Cost",
        weight: 30,
        description: "Does the response quantify or vividly articulate what the legacy approach is costing the business?",
        poor: "Generic complaints about old tech with no business impact framing.",
        champion: "Specific, executive-grade articulation of lost revenue, margin erosion, talent drain, or competitive exposure tied to this customer's actual situation.",
      },
      {
        name: "Strategic Fit",
        weight: 25,
        description: "Does the response connect the proposed change to the customer's strategic priorities?",
        poor: "Product features disconnected from business strategy.",
        champion: "Clear line of sight from capabilities to the customer's stated strategic priorities and fiscal-year commitments.",
      },
      {
        name: "Executive Framing",
        weight: 25,
        description: "Does the response speak in the language of a CFO, CRO, or CEO — not a buyer persona below the decision line?",
        poor: "Feature-level or operational framing that would never survive a boardroom conversation.",
        champion: "Business case sharp enough for a board-deck appendix — risk-adjusted, time-bound, and tied to enterprise outcomes.",
      },
      {
        name: "Proof and Parallel",
        weight: 20,
        description: "Is there credible evidence that this has worked for comparable companies?",
        poor: "No proof points, or references that don't match the customer's profile.",
        champion: "Parallel examples that are specifically relevant to this customer's industry, size, and maturity — with outcome specificity.",
      },
    ],
    penalties: [
      "Leads with product features instead of business outcomes",
      "Treats the situation as a procurement process rather than a strategic decision",
      "No reference to the customer's actual stated context or stakeholders",
    ],
  },
  // Rounds 2-4 to be filled in with the same structure
  replacement: {
    id: "replacement",
    number: "02",
    name: "Replacement",
    roundColor: "var(--r2-umber)",
    description: "The customer is evaluating alternatives. Compete on value, not features.",
    frameworkCards: [], // TBD
    scoringCriteria: [], // TBD
    penalties: [],
  },
  defense: {
    id: "defense",
    number: "03",
    name: "Defense",
    roundColor: "var(--r3-forest)",
    description: "Your account is at risk. Protect the relationship and renew with value.",
    frameworkCards: [],
    scoringCriteria: [],
    penalties: [],
  },
  expansion: {
    id: "expansion",
    number: "04",
    name: "Expansion",
    roundColor: "var(--r4-plum)",
    description: "The customer is a success story. Grow the footprint by finding the next outcome.",
    frameworkCards: [],
    scoringCriteria: [],
    penalties: [],
  },
};

// Industry-specific scenarios. Each industry × motion = one scenario.
// For demo today, we've fully built out Round 1 (Legacy Displacement) for Technology.
// Adding scenarios for the other industries follows the same shape.

export const SCENARIOS = {
  technology: {
    id: "technology",
    name: "Technology",
    description: "Enterprise SaaS, cloud, AI",
    iconKey: "network",
    rounds: {
      "legacy-displacement": {
        client: {
          name: "HALO SYSTEMS",
          industry: "Technology",
          size: "4,200 employees",
          revenue: "$2.1B annual",
          currentSolution: "Legacy revenue tech stack, 9 years in production",
        },
        motion: MOTIONS.legacyDisplacement,
        subtitle: "A $2.1B enterprise SaaS. Nine years on their current stack. Your largest account.",
        context: [
          "Last month, Halo's VP of Product called their platform 'mature, not modern' in a company-wide product address.",
          "Their CRO has missed quota two quarters running. AI-native competitors are winning enterprise deals Halo used to own.",
          "Halo's board approves FY27 tech strategy in 42 days.",
          "There is no RFP. There is no procurement process. There is a window before the budget closes — if you can frame the business cost of the status quo, the CEO will accelerate a platform decision.",
        ],
        stakes: [
          { value: "$2.1B", label: "ANNUAL REVENUE", urgent: false },
          { value: "42", label: "DAYS TO BOARD", urgent: true },
          { value: "$4.2M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Build the business case for Legacy Displacement strong enough that Halo's CEO acts before the board meeting.",
        personas: [
          {
            role: "CFO",
            name: "Priya Natarajan",
            tagline: "Margin expansion is her job description.",
            fears: "Sunk capex with uncertain returns.",
            wants: "Modeled business impact inside year one.",
            levers: "Risk-adjusted NPV. Staged commitment structure.",
          },
          {
            role: "CRO",
            name: "Marcus Chen",
            tagline: "His quarter is the company's quarter.",
            fears: "Missing the number a third time.",
            wants: "Rep productivity he can prove to the board.",
            levers: "Proof points from comparable enterprise SaaS. Fast ramp for new hires.",
          },
          {
            role: "VP PRODUCT",
            name: "Sarah Okafor",
            tagline: "She's the one who said it out loud.",
            fears: "Shipping mediocrity for another year.",
            wants: "A platform her team can build on for a decade.",
            levers: "Technical rigor. Roadmap partnership. Data integrity through migration.",
          },
        ],
      },
    },
  },
  financialServices: {
    id: "financial-services",
    name: "Financial Services",
    description: "Banks, fintech, insurance",
    iconKey: "chart",
    rounds: {
      "legacy-displacement": {
        client: {
          name: "KEYSTONE FINANCIAL",
          industry: "Financial Services",
          size: "8,500 employees",
          revenue: "$5.8B annual",
          currentSolution: "Legacy banking core + fragmented digital channels, 14 years in production",
        },
        motion: MOTIONS.legacyDisplacement,
        subtitle: "A regional super-community bank. Fourteen years on their core. Deposit outflows accelerating.",
        context: [
          "Keystone has lost 4.2% of deposits to digital-first competitors over the last six quarters.",
          "Their Chief Digital Officer just presented a 'Bank of 2030' vision to the board. The CEO endorsed it publicly.",
          "Regulators approved their next capital plan 60 days ago. They have a window to invest.",
          "There is no RFP. But their COO has a transformation steering committee that meets every two weeks, and you have a seat at the next one.",
        ],
        stakes: [
          { value: "$5.8B", label: "ANNUAL REVENUE", urgent: false },
          { value: "14", label: "DAYS TO COMMITTEE", urgent: true },
          { value: "$6.1M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Build the business case for Legacy Displacement strong enough that Keystone's COO accelerates the Bank of 2030 investment.",
        personas: [
          {
            role: "CFO",
            name: "Daniel Yoon",
            tagline: "He measures decisions in basis points.",
            fears: "Investment cycles that don't land before the next earnings call.",
            wants: "Visible ROI inside the current capital plan.",
            levers: "Fee income uplift. Efficiency ratio improvement. Regulatory cover.",
          },
          {
            role: "Chief Digital Officer",
            name: "Renée Obasi",
            tagline: "She owns the Bank of 2030 narrative.",
            fears: "A platform swap that stalls her roadmap.",
            wants: "A partner who can co-build, not just sell.",
            levers: "Reference architectures. Co-investment in shared outcomes. Technical proof.",
          },
          {
            role: "COO",
            name: "James Halloran",
            tagline: "He owns the transformation steering committee.",
            fears: "Another transformation that misses its numbers.",
            wants: "Clear delivery milestones and visible early wins.",
            levers: "A 90-day first value plan. Risk-adjusted implementation sequencing.",
          },
        ],
      },
    },
  },
  professionalServices: {
    id: "professional-services",
    name: "Professional Services",
    description: "Consulting, legal, advisory",
    iconKey: "geometry",
    rounds: {
      "legacy-displacement": {
        client: {
          name: "MERIDIAN ADVISORY",
          industry: "Professional Services",
          size: "3,200 consultants",
          revenue: "$1.4B annual",
          currentSolution: "Legacy engagement platform + knowledge management, 11 years in production",
        },
        motion: MOTIONS.legacyDisplacement,
        subtitle: "A mid-tier global consulting firm. Eleven years on their engagement platform. Utilization slipping.",
        context: [
          "Meridian's utilization dropped from 78% to 71% over the last year. Partners are quietly flagging the tooling.",
          "Their Managing Partner just announced a firm-wide 'Consultant of the Future' initiative at the partner retreat.",
          "Annual partner strategy offsite is in 38 days. Next year's budget is set there.",
          "There is no RFP. There is a chance to shape the initiative before budget locks.",
        ],
        stakes: [
          { value: "$1.4B", label: "ANNUAL REVENUE", urgent: false },
          { value: "38", label: "DAYS TO OFFSITE", urgent: true },
          { value: "$3.6M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Build the business case for Legacy Displacement strong enough that Meridian's Managing Partner anchors the Consultant of the Future initiative on your platform.",
        personas: [
          {
            role: "CFO",
            name: "Hannah Reeves",
            tagline: "Every decision lands on her realization rate.",
            fears: "Investment that doesn't translate to billable hours.",
            wants: "Utilization uplift she can show the partnership.",
            levers: "Consultant productivity gains. Shorter ramp for laterals.",
          },
          {
            role: "Chief Knowledge Officer",
            name: "Andre Okonkwo",
            tagline: "He's spent a decade fighting knowledge silos.",
            fears: "Another platform where IP gets fragmented.",
            wants: "Knowledge reuse that compounds across engagements.",
            levers: "AI-native search. Matter-to-matter learning. Content lifecycle automation.",
          },
          {
            role: "Managing Partner",
            name: "Véronique Laurent",
            tagline: "She signed the offsite invitation.",
            fears: "Picking a platform that alienates the partnership.",
            wants: "A clear narrative she can take to partners.",
            levers: "Change management commitment. Partner pilots. Thought leadership co-branding.",
          },
        ],
      },
    },
  },
  healthcare: {
    id: "healthcare",
    name: "Healthcare",
    description: "Health systems, pharma, devices",
    iconKey: "heart",
    rounds: {
      "legacy-displacement": {
        client: {
          name: "EVERWELL HEALTH",
          industry: "Healthcare",
          size: "12,400 employees",
          revenue: "$3.2B annual",
          currentSolution: "Legacy EHR integration layer + patient engagement stack, 8 years in production",
        },
        motion: MOTIONS.legacyDisplacement,
        subtitle: "A regional health system. Eight years on their patient engagement stack. Patient leakage up 9%.",
        context: [
          "Everwell's patient leakage to competing systems has risen 9% over the last year. Their CMO is under pressure.",
          "The board just approved a new Patient Experience strategic pillar. Funding is set at their next capital meeting.",
          "CMS quality measures are shifting in 2027 — their current stack can't report the new metrics.",
          "There is no RFP. There is a Patient Experience Committee meeting in 35 days that sets direction.",
        ],
        stakes: [
          { value: "$3.2B", label: "ANNUAL REVENUE", urgent: false },
          { value: "35", label: "DAYS TO COMMITTEE", urgent: true },
          { value: "$5.3M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Build the business case for Legacy Displacement strong enough that Everwell's CMO anchors the Patient Experience pillar on your platform.",
        personas: [
          {
            role: "CFO",
            name: "William Park",
            tagline: "Every dollar he spends fights a reimbursement headwind.",
            fears: "A capital commitment that doesn't move CMS quality metrics.",
            wants: "Measurable reduction in leakage inside 12 months.",
            levers: "Cost-per-acquisition modeling. Value-based-care readiness.",
          },
          {
            role: "Chief Medical Officer",
            name: "Dr. Asha Ramirez",
            tagline: "She speaks for the clinicians.",
            fears: "A platform that adds to clinician burden.",
            wants: "Patient experience that clinicians feel improves their day.",
            levers: "Time-to-chart-closure. Closed-loop referrals. EHR integration fidelity.",
          },
          {
            role: "VP Patient Experience",
            name: "Jordan Bellows",
            tagline: "He owns the Patient Experience Committee.",
            fears: "Another initiative that dies in pilot.",
            wants: "A pilot plan that proves value in 90 days.",
            levers: "Co-designed patient journey. Staged rollout. Clear success metrics.",
          },
        ],
      },
    },
  },
};

// Industry picker list for the welcome screen
export const INDUSTRIES = [
  { id: "technology", ...SCENARIOS.technology },
  { id: "financial-services", ...SCENARIOS.financialServices },
  { id: "professional-services", ...SCENARIOS.professionalServices },
  { id: "healthcare", ...SCENARIOS.healthcare },
];

// Helper: get a scenario by industry + motion
export function getScenario(industryId, motionId = "legacy-displacement") {
  const industryMap = {
    "technology": "technology",
    "financial-services": "financialServices",
    "professional-services": "professionalServices",
    "healthcare": "healthcare",
  };
  const industry = SCENARIOS[industryMap[industryId]];
  if (!industry) return null;
  return industry.rounds[motionId] || null;
}
