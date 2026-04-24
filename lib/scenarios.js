// Scenario data for the Brevet Sales Simulation
// 4 industries × 4 motions = 16 scenarios
// Each motion has its own framework (4 cards) and scoring rubric

export const MOTIONS = {
  legacyDisplacement: {
    id: "legacy-displacement",
    number: "01",
    name: "Legacy Displacement",
    roundColor: "#2D4A5B",
    description: "The customer doesn't know they need to change yet. Build the business case that creates the buying decision.",
    frameworkCards: [
      { number: "01", name: "VALUE GAPS", heading: "Value Gaps", prompt: "Where is their current approach falling short of what the business now needs?" },
      { number: "02", name: "ART OF THE POSSIBLE", heading: "Art of the Possible", prompt: "What new capabilities unlock outcomes their current stack cannot reach?" },
      { number: "03", name: "IMPACT", heading: "Impact", prompt: "What measurable business outcomes will this deliver over 12, 24, 36 months?" },
      { number: "04", name: "CUSTOMER STORY", heading: "Customer Story", prompt: "What proof do you have that this works? Name a parallel." },
    ],
    scoringCriteria: [
      { name: "Status Quo Cost", weight: 30, description: "Does the response quantify what the legacy approach is costing the business?", poor: "Generic complaints about old tech with no business impact framing.", champion: "Specific, executive-grade articulation of lost revenue, margin erosion, or competitive exposure." },
      { name: "Strategic Fit", weight: 25, description: "Does the response connect the change to stated strategic priorities?", poor: "Product features disconnected from business strategy.", champion: "Clear line of sight from capabilities to the customer's FY commitments." },
      { name: "Executive Framing", weight: 25, description: "Does the response speak in CFO/CRO/CEO language?", poor: "Feature-level framing that wouldn't survive a boardroom conversation.", champion: "Business case sharp enough for a board-deck appendix." },
      { name: "Proof and Parallel", weight: 20, description: "Is there credible evidence this has worked for comparable companies?", poor: "No proof points, or references that don't match the customer's profile.", champion: "Parallel examples specifically relevant to this customer's industry, size, and maturity." },
    ],
    penalties: [
      "Leads with product features instead of business outcomes",
      "Treats the situation as a procurement process rather than a strategic decision",
      "No reference to the customer's actual stated context or stakeholders",
    ],
  },

  replacement: {
    id: "replacement",
    number: "02",
    name: "Replacement",
    roundColor: "#8B6F47",
    description: "The customer is evaluating alternatives. Compete on differentiated value, not feature parity.",
    frameworkCards: [
      { number: "01", name: "COMPETITIVE CONTEXT", heading: "Competitive Context", prompt: "Who else is being considered, and why? What are the real decision criteria?" },
      { number: "02", name: "DIFFERENTIATED VALUE", heading: "Differentiated Value", prompt: "Where do you uniquely win? Name the wedge that only you own." },
      { number: "03", name: "TRANSITION PLAN", heading: "Transition Plan", prompt: "How do you make the switch safe, fast, and low-risk? Sequencing matters." },
      { number: "04", name: "TRUST CASE", heading: "Trust Case", prompt: "Why you over the others? Proof, references, commitment." },
    ],
    scoringCriteria: [
      { name: "Competitive Clarity", weight: 25, description: "Sophisticated understanding of the competitive landscape and the buyer's real criteria.", poor: "Vague competitor references or assumption that every deal is the same.", champion: "Specific read on each competitor's strengths and weaknesses as they relate to THIS buyer's priorities." },
      { name: "Wedge Precision", weight: 30, description: "Is the differentiated value clear, defensible, and tied to this buyer's outcomes?", poor: "Generic claims like 'we're better integrated' or 'we have more features'.", champion: "A specific, proven wedge that maps directly to one or more of the buyer's top stated needs." },
      { name: "Switch Economics", weight: 25, description: "Does the response address the real cost of switching — time, risk, effort — and compress it?", poor: "Ignores switching cost or hand-waves it.", champion: "Concrete migration plan with risk mitigation, named stakeholders, and a realistic timeline the buyer can trust." },
      { name: "Credibility", weight: 20, description: "Are the proof points credible and comparable to this buyer?", poor: "No references, or references that don't match the buyer's profile.", champion: "Named parallels at comparable companies with outcome specifics the buyer can verify." },
    ],
    penalties: [
      "Feature-matching instead of outcome-framing",
      "Dismissing the incumbent without acknowledging switching cost",
      "Generic differentiation claims not grounded in buyer priorities",
    ],
  },

  defense: {
    id: "defense",
    number: "03",
    name: "Defense",
    roundColor: "#3D5F3D",
    description: "Your account is at risk. Protect the relationship and renew with forward value.",
    frameworkCards: [
      { number: "01", name: "VALUE REALIZED", heading: "Value Realized", prompt: "What measurable value have you delivered to date? Be specific and executive-ready." },
      { number: "02", name: "RISK SIGNALS", heading: "Risk Signals", prompt: "Where is this account at risk? What are you hearing, not hearing, and seeing?" },
      { number: "03", name: "FORWARD VALUE", heading: "Forward Value", prompt: "What's the next chapter? Why stay — and expand — vs. leave?" },
      { number: "04", name: "STAKEHOLDER STRATEGY", heading: "Stakeholder Strategy", prompt: "Who's for you, who's against, who's new? What's your map of power?" },
    ],
    scoringCriteria: [
      { name: "Value Evidence", weight: 30, description: "Can you articulate delivered value in business terms the CFO would accept?", poor: "Usage metrics or activity claims ('they love our product').", champion: "Specific business outcomes with named dollar or percentage impact the champion can defend to their board." },
      { name: "Risk Honesty", weight: 25, description: "Does the response name real risks vs. theoretical ones?", poor: "Denies the risk exists or lists generic 'things to watch'.", champion: "Clear-eyed read on political shifts, competitive threats, and your own delivery gaps." },
      { name: "Forward Case", weight: 25, description: "Is there a compelling reason to stay, not just a contract to renew?", poor: "Hand-waves about 'more of the same' or touts generic roadmap features.", champion: "A new business outcome in year two that justifies continued investment and expansion." },
      { name: "Political Map", weight: 20, description: "Does the response show sophistication about who decides and how?", poor: "Lists titles without describing where the power actually sits.", champion: "Specific map of allies, blockers, new arrivals, and how you're investing in each." },
    ],
    penalties: [
      "Over-claims on value realized without evidence",
      "Dismisses competitive threat instead of engaging with it",
      "Ignores the political shift if a new executive has entered the account",
    ],
  },

  expansion: {
    id: "expansion",
    number: "04",
    name: "Expansion",
    roundColor: "#6B4668",
    description: "The customer is a success story. Grow the footprint by finding the next business outcome.",
    frameworkCards: [
      { number: "01", name: "CURRENT FOOTPRINT", heading: "Current Footprint", prompt: "What's deployed, what's working, what's the story so far?" },
      { number: "02", name: "NEXT OUTCOME", heading: "Next Outcome", prompt: "What's the next business outcome worth pursuing? Why now?" },
      { number: "03", name: "CHAMPION ARCHITECTURE", heading: "Champion Architecture", prompt: "Who sponsors this inside the account? Who blocks?" },
      { number: "04", name: "COMMERCIAL PATH", heading: "Commercial Path", prompt: "How is this structured — new contract, amendment, expansion tier? What's the sequence?" },
    ],
    scoringCriteria: [
      { name: "Success Narrative", weight: 25, description: "Does the response frame current success in business terms, not usage metrics?", poor: "Adoption percentages and feature usage numbers.", champion: "Business impact the account's CFO has already accepted as delivered." },
      { name: "Outcome Hypothesis", weight: 30, description: "Is the next outcome bold, specific, and worth pursuing?", poor: "Generic 'more seats' or 'upsell to tier 2' framing.", champion: "A net-new business outcome that requires executive sponsorship and unlocks material value." },
      { name: "Political Reality", weight: 25, description: "Does the response show who actually has the authority and appetite to expand?", poor: "Champion-only thinking that ignores procurement, finance, or IT.", champion: "A multi-stakeholder sponsorship plan with specific asks of each party." },
      { name: "Deal Architecture", weight: 20, description: "Is the commercial structure practical and sequenced?", poor: "Vague expansion framing without commercial detail.", champion: "A specific deal shape — pilot, phased rollout, co-termed amendment — tied to a timeline the customer has budget for." },
    ],
    penalties: [
      "Confuses usage growth with business value growth",
      "Ignores political or organizational change inside the account",
      "No commercial structure attached to the expansion hypothesis",
    ],
  },
};

// ============================================================================
// SCENARIOS — 4 industries × 4 motions = 16 scenarios
// ============================================================================

export const SCENARIOS = {
  // =========================================================================
  // TECHNOLOGY
  // =========================================================================
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
          { role: "CFO", name: "Priya Natarajan", tagline: "Margin expansion is her job description.", fears: "Sunk capex with uncertain returns.", wants: "Modeled business impact inside year one.", levers: "Risk-adjusted NPV. Staged commitment structure." },
          { role: "CRO", name: "Marcus Chen", tagline: "His quarter is the company's quarter.", fears: "Missing the number a third time.", wants: "Rep productivity he can prove to the board.", levers: "Proof points from comparable enterprise SaaS. Fast ramp for new hires." },
          { role: "VP PRODUCT", name: "Sarah Okafor", tagline: "She's the one who said it out loud.", fears: "Shipping mediocrity for another year.", wants: "A platform her team can build on for a decade.", levers: "Technical rigor. Roadmap partnership. Data integrity through migration." },
        ],
      },
      "replacement": {
        client: {
          name: "VECTOR CLOUD",
          industry: "Technology",
          size: "1,800 employees",
          revenue: "$780M annual",
          currentSolution: "Active evaluation between three vendors including the incumbent",
        },
        motion: MOTIONS.replacement,
        subtitle: "A fast-growth observability SaaS. Active three-vendor bake-off. You're the challenger.",
        context: [
          "Vector Cloud's VP Engineering kicked off a platform replacement review 60 days ago after a customer-impacting incident exposed stitching across their current stack.",
          "Three vendors in the mix: the incumbent (cheap, deeply integrated), a new market leader (feature-rich, expensive), and you.",
          "The selection committee presents to the CTO in 21 days. Whoever owns the narrative by then wins.",
          "The incumbent has been whispering that switching costs will break an already stretched engineering roadmap.",
        ],
        stakes: [
          { value: "$780M", label: "ANNUAL REVENUE", urgent: false },
          { value: "21", label: "DAYS TO DECISION", urgent: true },
          { value: "$3.8M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Win the replacement decision by making switching safe and your wedge undeniable before the CTO review.",
        personas: [
          { role: "CTO", name: "Elena Vasquez", tagline: "She signs the contract and owns the outcome.", fears: "A risky migration that stalls her 2027 roadmap.", wants: "A reference architecture and a migration plan she can defend.", levers: "Technical proof. Named parallels at similar-stage companies." },
          { role: "VP ENGINEERING", name: "Dmitri Volkov", tagline: "He called the incident out loud.", fears: "Picking a vendor whose runbook falls apart under real load.", wants: "Operational partnership, not just a tool.", levers: "Shared on-call protocols. Honest performance benchmarks." },
          { role: "VP PROCUREMENT", name: "Lauren Finch", tagline: "She measures savings in negotiated basis points.", fears: "Being the person who picked 'the shiny new thing' that went sideways.", wants: "Commercial terms she can defend and a clear exit clause.", levers: "Multi-year price lock. Success milestones tied to payments." },
        ],
      },
      "defense": {
        client: {
          name: "NORTHSTREAM",
          industry: "Technology",
          size: "2,600 employees",
          revenue: "$1.3B annual",
          currentSolution: "Incumbent — you — in year four of a five-year deal. Renewal decision coming.",
        },
        motion: MOTIONS.defense,
        subtitle: "A media-tech platform. Year four of a five-year deal. Their new CIO is asking hard questions.",
        context: [
          "Northstream brought in a new CIO six months ago. She's running a vendor audit across the entire tech stack.",
          "Usage has grown 40% YoY. You can prove adoption. What you can't yet prove: business impact the new CIO accepts.",
          "A major competitor has been in Northstream's boardroom twice this quarter with a 'rip and replace' proposal.",
          "Your renewal review is in 56 days. Miss the moment and you'll spend next year fighting for survival.",
        ],
        stakes: [
          { value: "$1.3B", label: "ANNUAL REVENUE", urgent: false },
          { value: "56", label: "DAYS TO RENEWAL", urgent: true },
          { value: "$6.8M", label: "RENEWAL VALUE", urgent: false },
        ],
        mission: "Convert the renewal into an expanded partnership by proving delivered value and offering the next outcome before the new CIO runs her audit.",
        personas: [
          { role: "CIO", name: "Maya Thornton", tagline: "She's six months in and hunting for wins.", fears: "Inheriting vendor sprawl her predecessor let accumulate.", wants: "A shortlist of consolidated partners who earn their spend.", levers: "Honest value review. Exec-level sponsorship on your side." },
          { role: "VP OPERATIONS", name: "Ravi Krishnan", tagline: "He's your long-time champion, but he's been quiet lately.", fears: "Being publicly wrong if the new CIO decides against you.", wants: "Ammunition for the board-level renewal conversation.", levers: "Customer business-review materials. Joint QBR cadence." },
          { role: "CHIEF PROCUREMENT OFFICER", name: "Angela Park", tagline: "She runs every renewal through a framework.", fears: "Missing leverage during the renewal window.", wants: "Commercial concessions plus expansion commitments.", levers: "Multi-year commit with an expansion tier baked in." },
        ],
      },
      "expansion": {
        client: {
          name: "ALTIMETRIC",
          industry: "Technology",
          size: "3,100 employees",
          revenue: "$1.9B annual",
          currentSolution: "Successful deployment across two of their four divisions. Renewal locked.",
        },
        motion: MOTIONS.expansion,
        subtitle: "A customer analytics platform. You've won two of four divisions. The rest is the opportunity.",
        context: [
          "Altimetric's analytics division has measurably improved retention by 8% in 18 months using your platform.",
          "Their new CEO has announced a company-wide 'customer intelligence' strategy that maps directly to your capabilities.",
          "Two divisions — field services and professional services — have never seen your platform and are running legacy tools.",
          "FY planning kicks off in 75 days. You have a window to position expansion as core to the new CEO's strategy before budgets lock.",
        ],
        stakes: [
          { value: "$1.9B", label: "ANNUAL REVENUE", urgent: false },
          { value: "75", label: "DAYS TO FY PLANNING", urgent: true },
          { value: "$9.4M", label: "EXPANSION VALUE", urgent: false },
        ],
        mission: "Turn a successful two-division deployment into a company-wide partnership before FY planning closes.",
        personas: [
          { role: "CEO", name: "Thomas Rivera", tagline: "He just announced the customer intelligence mandate.", fears: "His mandate stalling in the divisions that already do things their own way.", wants: "Visible progress across all four divisions in year one.", levers: "A named executive sponsor story. Quarterly board-level progress metrics." },
          { role: "CFO", name: "Jennifer Chen", tagline: "Every expansion conversation runs through her.", fears: "A cross-divisional rollout that goes sideways on cost.", wants: "A phased investment that aligns to capital planning.", levers: "Co-termed contract. Success-gated expansion milestones." },
          { role: "CHIEF CUSTOMER OFFICER", name: "David Okonkwo", tagline: "He's the architect of the new strategy.", fears: "Division leaders resisting a top-down platform mandate.", wants: "A partner who can navigate divisional politics.", levers: "Division-level pilots. Change management investment from your side." },
        ],
      },
    },
  },

  // =========================================================================
  // FINANCIAL SERVICES
  // =========================================================================
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
          { role: "CFO", name: "Daniel Yoon", tagline: "He measures decisions in basis points.", fears: "Investment cycles that don't land before the next earnings call.", wants: "Visible ROI inside the current capital plan.", levers: "Fee income uplift. Efficiency ratio improvement. Regulatory cover." },
          { role: "Chief Digital Officer", name: "Renée Obasi", tagline: "She owns the Bank of 2030 narrative.", fears: "A platform swap that stalls her roadmap.", wants: "A partner who can co-build, not just sell.", levers: "Reference architectures. Co-investment in shared outcomes. Technical proof." },
          { role: "COO", name: "James Halloran", tagline: "He owns the transformation steering committee.", fears: "Another transformation that misses its numbers.", wants: "Clear delivery milestones and visible early wins.", levers: "A 90-day first value plan. Risk-adjusted implementation sequencing." },
        ],
      },
      "replacement": {
        client: {
          name: "CROSSHATCH CAPITAL",
          industry: "Financial Services",
          size: "1,200 employees",
          revenue: "$820M annual",
          currentSolution: "Active evaluation of wealth platforms after a two-year build-out fell short",
        },
        motion: MOTIONS.replacement,
        subtitle: "A boutique wealth manager. Their in-house build failed. Now they're buying — and you're one of three.",
        context: [
          "Crosshatch spent two years and $18M building a custom advisor platform. It launched last year and advisors revolted.",
          "The board ordered a buy-not-build decision in 90 days. You're in the final three.",
          "The two other vendors are the category leader (large, expensive) and a scrappy fintech (cheap, lean).",
          "The Chief Advisor Officer is running the selection. He's publicly humiliated by the failed build and wants a partner who will make this work.",
        ],
        stakes: [
          { value: "$820M", label: "ANNUAL REVENUE", urgent: false },
          { value: "28", label: "DAYS TO DECISION", urgent: true },
          { value: "$4.5M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Win the replacement by making the transition from their failed build invisible to the advisors and undeniable to the board.",
        personas: [
          { role: "CHIEF ADVISOR OFFICER", name: "Benjamin Hayes", tagline: "He was the sponsor of the failed build.", fears: "Being associated with a second failure.", wants: "A vendor who owns the outcome and makes him look decisive.", levers: "Executive sponsor-to-sponsor commitment. Shared success milestones." },
          { role: "CIO", name: "Aisha Patel", tagline: "She inherited the rubble of the build.", fears: "Integrating a third-party platform that doesn't fit her tech stack.", wants: "Clean APIs and a credible migration plan.", levers: "Architectural review session. Named reference from a comparable wealth firm." },
          { role: "HEAD OF ADVISOR EXPERIENCE", name: "Carol Mendes", tagline: "She leads the advisor council that killed the build.", fears: "Another top-down decision that ignores advisor reality.", wants: "An advisor pilot before company-wide rollout.", levers: "Advisor focus groups. Co-designed onboarding. Change-management commitment." },
        ],
      },
      "defense": {
        client: {
          name: "SILVERLINE TRUST",
          industry: "Financial Services",
          size: "4,200 employees",
          revenue: "$2.4B annual",
          currentSolution: "Your platform, three years in. New executive leadership is reviewing everything.",
        },
        motion: MOTIONS.defense,
        subtitle: "A regional trust bank. Your three-year deal is up for renewal. New CEO, new scrutiny.",
        context: [
          "Silverline's founding CEO retired six months ago. The board brought in a turnaround-specialist CEO who's reviewing every vendor contract above $1M.",
          "Your original champion — the former COO — retired alongside the CEO. You are starting over with the relationship.",
          "A competitive vendor has been hosting the new CEO at their HQ three times in the last quarter.",
          "The renewal decision sits with the CFO. Your original ROI case was built for a growth narrative. The new CEO is focused on efficiency.",
        ],
        stakes: [
          { value: "$2.4B", label: "ANNUAL REVENUE", urgent: false },
          { value: "49", label: "DAYS TO RENEWAL", urgent: true },
          { value: "$3.9M", label: "RENEWAL VALUE", urgent: false },
        ],
        mission: "Rebuild the sponsorship map and re-anchor the value case in the new CEO's efficiency mandate before the renewal vote.",
        personas: [
          { role: "CEO", name: "Patricia Whitfield", tagline: "She's paid to cut cost and focus the portfolio.", fears: "Inheriting vendor commitments that don't map to her strategy.", wants: "A clear, quantified reason to continue.", levers: "Efficiency-focused value case. Executive-sponsor reset meeting." },
          { role: "CFO", name: "Marcus Webb", tagline: "The renewal decision is on his desk.", fears: "Paying legacy rates for commoditized capability.", wants: "Meaningful commercial concessions or a clear expansion path.", levers: "Pricing recalibration. New outcome commitments in the renewal." },
          { role: "NEW COO", name: "Thandi Nkosi", tagline: "She's the CEO's operational enforcer.", fears: "Operational disruption during the transition.", wants: "A partner who can make her first 100 days easier, not harder.", levers: "Operational continuity guarantees. Executive attention." },
        ],
      },
      "expansion": {
        client: {
          name: "HARBOR MUTUAL",
          industry: "Financial Services",
          size: "6,700 employees",
          revenue: "$4.1B annual",
          currentSolution: "Deployed for property & casualty. Life and specialty lines still on legacy.",
        },
        motion: MOTIONS.expansion,
        subtitle: "A diversified insurer. P&C is thriving on your platform. Life and specialty lines are next.",
        context: [
          "Harbor Mutual's P&C combined ratio has improved by 3.2 points since deploying your platform — a story the CEO tells at every earnings call.",
          "The Life division is on a legacy policy admin system that's been 'planned for replacement' for four years without action.",
          "A new President of Life was hired last quarter with a mandate to modernize. She wants to present her plan to the board in 60 days.",
          "Procurement has been hinting at a 'platform consolidation' play that could either accelerate your expansion or let a competitor back in.",
        ],
        stakes: [
          { value: "$4.1B", label: "ANNUAL REVENUE", urgent: false },
          { value: "60", label: "DAYS TO BOARD", urgent: true },
          { value: "$11.2M", label: "EXPANSION VALUE", urgent: false },
        ],
        mission: "Convert P&C success into the anchor for a company-wide Life and specialty modernization before the new President finalizes her board plan.",
        personas: [
          { role: "PRESIDENT OF LIFE", name: "Katherine Nguyen", tagline: "She's new, ambitious, and running out of runway.", fears: "Launching a modernization plan that the board rejects on risk.", wants: "A partner who de-risks her first big bet.", levers: "Executive sponsorship commitment. Named peer-company case studies." },
          { role: "CFO", name: "Simon Petrov", tagline: "He funds every expansion through his lens.", fears: "Platform consolidation promises that don't compound.", wants: "Bundled commercial with multi-division savings.", levers: "Enterprise agreement restructure. Multi-year value-share structure." },
          { role: "CIO", name: "Rachel Abernathy", tagline: "She runs the enterprise architecture council.", fears: "Another bespoke implementation per division.", wants: "A coherent target architecture.", levers: "Reference architecture session. Shared tech investment." },
        ],
      },
    },
  },

  // =========================================================================
  // PROFESSIONAL SERVICES
  // =========================================================================
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
          { role: "CFO", name: "Hannah Reeves", tagline: "Every decision lands on her realization rate.", fears: "Investment that doesn't translate to billable hours.", wants: "Utilization uplift she can show the partnership.", levers: "Consultant productivity gains. Shorter ramp for laterals." },
          { role: "Chief Knowledge Officer", name: "Andre Okonkwo", tagline: "He's spent a decade fighting knowledge silos.", fears: "Another platform where IP gets fragmented.", wants: "Knowledge reuse that compounds across engagements.", levers: "AI-native search. Matter-to-matter learning. Content lifecycle automation." },
          { role: "Managing Partner", name: "Véronique Laurent", tagline: "She signed the offsite invitation.", fears: "Picking a platform that alienates the partnership.", wants: "A clear narrative she can take to partners.", levers: "Change management commitment. Partner pilots. Thought leadership co-branding." },
        ],
      },
      "replacement": {
        client: {
          name: "ARBOR CONSULTING GROUP",
          industry: "Professional Services",
          size: "1,850 consultants",
          revenue: "$780M annual",
          currentSolution: "Active evaluation of project and knowledge platforms following a partner-led review",
        },
        motion: MOTIONS.replacement,
        subtitle: "A growing consulting firm. The partners voted to replace their existing platform. You're one of three.",
        context: [
          "Arbor's partner council voted 7-2 to replace their current platform after a high-profile engagement loss was traced to knowledge-reuse failures.",
          "A cross-partner committee is running a three-vendor evaluation on a tight timeline.",
          "The incumbent is fighting to stay in the mix by discounting aggressively and offering a 'platform refresh' roadmap.",
          "The committee presents to the full partnership in 30 days. Partnership vote closes the decision.",
        ],
        stakes: [
          { value: "$780M", label: "ANNUAL REVENUE", urgent: false },
          { value: "30", label: "DAYS TO VOTE", urgent: true },
          { value: "$2.9M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Win the partnership vote by making your differentiation undeniable and the transition partner-friendly before the committee presents.",
        personas: [
          { role: "MANAGING PARTNER", name: "Oluwaseun Adeyemi", tagline: "He broke the tie on the replacement vote.", fears: "A loud minority of partners sabotaging adoption.", wants: "A rollout plan that shows respect for partner autonomy.", levers: "Partner-led pilot structure. Firm-branded configurations." },
          { role: "PARTNER, HEAD OF KNOWLEDGE", name: "Isabelle Roux", tagline: "She led the evaluation committee.", fears: "Picking a vendor whose AI promises don't survive real engagements.", wants: "Demonstrated AI value in a real Arbor matter.", levers: "Live POC on a real engagement. Knowledge-graph walkthrough." },
          { role: "CHIEF OPERATING PARTNER", name: "Raj Kapoor", tagline: "He owns the firm's operational roadmap.", fears: "A migration that tanks billable hours for a quarter.", wants: "A phased cutover that preserves revenue.", levers: "Parallel-run plan. Named implementation partner commitment." },
        ],
      },
      "defense": {
        client: {
          name: "CALDWELL & STONE",
          industry: "Professional Services",
          size: "1,100 attorneys",
          revenue: "$620M annual",
          currentSolution: "Your platform, four years in. Managing Partner election changed the politics.",
        },
        motion: MOTIONS.defense,
        subtitle: "An AmLaw 100 firm. Your four-year deal is up. A new Managing Partner means new questions.",
        context: [
          "Caldwell & Stone elected a new Managing Partner three months ago. He ran on a 'rationalize the spend' platform and vendor review is item one.",
          "Your original executive sponsor — the previous Managing Partner — retired from firm leadership but remains a senior partner.",
          "A competing platform has been running a coordinated outreach to Caldwell's practice group heads with 'switching incentives' packages.",
          "Your renewal is in 45 days, coinciding with the new Managing Partner's first firm-wide town hall.",
        ],
        stakes: [
          { value: "$620M", label: "ANNUAL REVENUE", urgent: false },
          { value: "45", label: "DAYS TO RENEWAL", urgent: true },
          { value: "$2.2M", label: "RENEWAL VALUE", urgent: false },
        ],
        mission: "Defend the renewal by proving delivered value to the new Managing Partner and pre-empting the competitor's practice-group outreach.",
        personas: [
          { role: "MANAGING PARTNER", name: "Graham Sutherland", tagline: "He campaigned on rationalizing vendor spend.", fears: "Being seen as rubber-stamping his predecessor's decisions.", wants: "A meaningful renegotiation that signals his leadership.", levers: "Commercial restructure. Net-new outcome commitment." },
          { role: "FIRM COO", name: "Linda Martinez", tagline: "She has the numbers on every partner's realization.", fears: "Disrupting the associates who've built habits around the platform.", wants: "Data proving adoption and firm-wide productivity gains.", levers: "Joint QBR with partnership-level metrics. Practice-group-level reporting." },
          { role: "HEAD OF LITIGATION PRACTICE", name: "Martin Hollis", tagline: "The competitor's outreach has him thinking.", fears: "Being tied to a platform that's falling behind.", wants: "Competitive benchmarking he can't easily get from the competitor.", levers: "Practice-group-level value review. Named reference from another AmLaw firm." },
        ],
      },
      "expansion": {
        client: {
          name: "VANGUARD PARTNERS",
          industry: "Professional Services",
          size: "2,400 professionals",
          revenue: "$1.1B annual",
          currentSolution: "Deployed in consulting practice. Audit and advisory practices still on legacy.",
        },
        motion: MOTIONS.expansion,
        subtitle: "A diversified advisory firm. Consulting is thriving on your platform. Audit and advisory are next.",
        context: [
          "Vanguard's consulting practice has grown 23% YoY since deploying your platform — a number the CEO repeats in every investor meeting.",
          "The audit practice has resisted replatforming for years, citing regulatory complexity.",
          "A new Chief Growth Officer has been appointed with a mandate to unify cross-practice revenue motion.",
          "The fiscal year closes in 90 days. Budget decisions for next year happen in the following 30.",
        ],
        stakes: [
          { value: "$1.1B", label: "ANNUAL REVENUE", urgent: false },
          { value: "90", label: "DAYS TO FY CLOSE", urgent: true },
          { value: "$7.3M", label: "EXPANSION VALUE", urgent: false },
        ],
        mission: "Convert consulting success into a unified cross-practice platform commitment before budget decisions lock.",
        personas: [
          { role: "CHIEF GROWTH OFFICER", name: "Nadia Silva", tagline: "She's three months in and looking for a flagship win.", fears: "Cross-practice politics stalling her mandate.", wants: "A partner who can co-sponsor the story across practices.", levers: "Executive co-presentation at firm offsite. Cross-practice analytics." },
          { role: "PARTNER, AUDIT LEAD", name: "Richard Frost", tagline: "He's been the reason audit hasn't modernized.", fears: "Regulatory exposure from a platform change mid-cycle.", wants: "Regulator-aware migration with zero audit disruption.", levers: "Named regulatory proof points. Phased parallel-run commitment." },
          { role: "CFO", name: "Elena Bhatt", tagline: "She funds the expansion.", fears: "A cross-practice rollout that blows budget.", wants: "A staged commitment with visible ROI at each stage.", levers: "Practice-by-practice success gates. Co-termed contract." },
        ],
      },
    },
  },

  // =========================================================================
  // HEALTHCARE
  // =========================================================================
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
          { role: "CFO", name: "William Park", tagline: "Every dollar he spends fights a reimbursement headwind.", fears: "A capital commitment that doesn't move CMS quality metrics.", wants: "Measurable reduction in leakage inside 12 months.", levers: "Cost-per-acquisition modeling. Value-based-care readiness." },
          { role: "Chief Medical Officer", name: "Dr. Asha Ramirez", tagline: "She speaks for the clinicians.", fears: "A platform that adds to clinician burden.", wants: "Patient experience that clinicians feel improves their day.", levers: "Time-to-chart-closure. Closed-loop referrals. EHR integration fidelity." },
          { role: "VP Patient Experience", name: "Jordan Bellows", tagline: "He owns the Patient Experience Committee.", fears: "Another initiative that dies in pilot.", wants: "A pilot plan that proves value in 90 days.", levers: "Co-designed patient journey. Staged rollout. Clear success metrics." },
        ],
      },
      "replacement": {
        client: {
          name: "PINEWOOD MEDICAL",
          industry: "Healthcare",
          size: "9,800 employees",
          revenue: "$2.6B annual",
          currentSolution: "Active evaluation of digital platforms after a failed EHR-adjacent implementation",
        },
        motion: MOTIONS.replacement,
        subtitle: "A regional hospital system. Their previous platform rollout failed. You're one of three in the final review.",
        context: [
          "Pinewood's last digital platform rollout missed its go-live date by eleven months and ran 40% over budget.",
          "The Chief Digital Officer who led the failed project was replaced. The new CDO has 60 days to present a revised plan to the board.",
          "The two competitors have deep EHR vendor relationships you don't match. Your wedge must be elsewhere.",
          "Physician leadership is skeptical of any new platform after last year's disruption.",
        ],
        stakes: [
          { value: "$2.6B", label: "ANNUAL REVENUE", urgent: false },
          { value: "60", label: "DAYS TO BOARD", urgent: true },
          { value: "$4.8M", label: "DEAL SIZE", urgent: false },
        ],
        mission: "Win the replacement by owning the 'make it boring' narrative and giving the new CDO a plan the board can approve.",
        personas: [
          { role: "NEW CHIEF DIGITAL OFFICER", name: "Dr. Priya Krishnan", tagline: "She inherited the aftermath.", fears: "Presenting a plan that echoes the previous failure.", wants: "A partner who owns execution risk with her.", levers: "Shared-accountability implementation. Named references from similar recoveries." },
          { role: "CMO", name: "Dr. Michael Costa", tagline: "He chairs the physician leadership council.", fears: "Another platform that adds documentation burden.", wants: "Clinician-centric design proven in peer systems.", levers: "Peer CMO reference. Physician advisory structure." },
          { role: "CHIEF NURSING OFFICER", name: "Dr. Linda Harper", tagline: "Her nurses took the brunt of the last failure.", fears: "Nurse attrition driven by yet another change.", wants: "Frontline co-design and a real voice in rollout.", levers: "Nurse advisory council. Change-management investment." },
        ],
      },
      "defense": {
        client: {
          name: "LUMINARA CARE",
          industry: "Healthcare",
          size: "5,600 employees",
          revenue: "$1.8B annual",
          currentSolution: "Your platform across their senior care network, three years in.",
        },
        motion: MOTIONS.defense,
        subtitle: "A senior care network. Three years in. New board scrutiny after a parent-company acquisition.",
        context: [
          "Luminara was acquired by a larger healthcare holding company six months ago. The parent is running a vendor consolidation review.",
          "Your original champion — the Luminara CEO — remains, but now reports into the parent CEO.",
          "A competitor with a deeper parent-company relationship is positioning for a network-wide platform swap.",
          "Your renewal is in 70 days, coinciding with the parent's integration-planning review.",
        ],
        stakes: [
          { value: "$1.8B", label: "ANNUAL REVENUE", urgent: false },
          { value: "70", label: "DAYS TO RENEWAL", urgent: true },
          { value: "$3.1M", label: "RENEWAL VALUE", urgent: false },
        ],
        mission: "Defend the renewal by re-anchoring with the parent CEO and making the case that consolidation should go the OTHER direction.",
        personas: [
          { role: "PARENT CEO", name: "Dr. Jonathan Sterling", tagline: "He makes the final consolidation calls.", fears: "Inheriting a vendor relationship he doesn't yet understand.", wants: "A clear, quantified story of value delivered.", levers: "Parent-level executive briefing. Holistic network value case." },
          { role: "LUMINARA CEO", name: "Grace Okonkwo", tagline: "She's your original champion, now fighting for her platform choice.", fears: "Being overruled on strategic decisions post-acquisition.", wants: "Ammunition that makes her a parent-company asset.", levers: "Outcomes data for her to present upward. Executive co-sponsorship." },
          { role: "PARENT CIO", name: "Aaron Lee", tagline: "He owns the integration roadmap.", fears: "Another network standardizing on a platform he didn't pick.", wants: "A platform that could scale across the full parent portfolio.", levers: "Parent-level technical review. Multi-network expansion vision." },
        ],
      },
      "expansion": {
        client: {
          name: "SENTINEL HEALTH SYSTEMS",
          industry: "Healthcare",
          size: "18,200 employees",
          revenue: "$5.4B annual",
          currentSolution: "Deployed in their flagship hospital. Ten regional facilities still on legacy tools.",
        },
        motion: MOTIONS.expansion,
        subtitle: "A multi-facility health system. Flagship hospital is a success story. Ten regionals are the opportunity.",
        context: [
          "Sentinel's flagship hospital has reduced readmissions by 18% since deploying your platform — a number their CEO cites in every industry conference.",
          "The regional facilities operate with significant autonomy and have resisted system-wide platform mandates for years.",
          "A new System CEO has announced a 'One Sentinel' operational unification initiative.",
          "Board-level budget allocation for next fiscal year is set in 80 days.",
        ],
        stakes: [
          { value: "$5.4B", label: "ANNUAL REVENUE", urgent: false },
          { value: "80", label: "DAYS TO BUDGET", urgent: true },
          { value: "$14.8M", label: "EXPANSION VALUE", urgent: false },
        ],
        mission: "Convert flagship success into a system-wide rollout by aligning regional leaders behind the One Sentinel vision before budget allocation.",
        personas: [
          { role: "SYSTEM CEO", name: "Dr. Vanessa Okonkwo", tagline: "She owns the One Sentinel narrative.", fears: "Regional pushback stalling her integration plan.", wants: "A partner who helps her manage the regions, not fight them.", levers: "Regional listening tour. Executive sponsorship at each facility." },
          { role: "SYSTEM CFO", name: "Eric Tanaka", tagline: "He funds the expansion.", fears: "A multi-facility rollout with unpredictable cost.", wants: "A phased deployment model with clear ROI gates.", levers: "Facility-by-facility business case. Co-termed master agreement." },
          { role: "REGIONAL CMO COUNCIL CHAIR", name: "Dr. Rebecca Freeman", tagline: "She speaks for the ten regional CMOs.", fears: "Losing clinical autonomy to system mandates.", wants: "Regional configuration flexibility inside a system standard.", levers: "Clinical advisory council. Regional-specific configuration options." },
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

// Motion order for round progression
export const MOTION_ORDER = [
  "legacy-displacement",
  "replacement",
  "defense",
  "expansion",
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

// Helper: get motion ID for a given round number (1-4)
export function getMotionForRound(roundNumber) {
  return MOTION_ORDER[roundNumber - 1] || MOTION_ORDER[0];
}
