/**
 * Impact Statement Templates
 * Detects weak bullet points and provides templates for stronger statements
 * 100% client-side - no external APIs
 */

// Power verbs categorized by type
export const POWER_VERBS = {
  leadership: [
    'Led', 'Directed', 'Orchestrated', 'Spearheaded', 'Championed', 'Drove',
    'Mobilized', 'Mentored', 'Coached', 'Guided', 'Supervised', 'Managed',
    'Oversaw', 'Headed', 'Coordinated', 'Steered', 'Piloted'
  ],
  achievement: [
    'Achieved', 'Exceeded', 'Delivered', 'Accomplished', 'Attained', 'Secured',
    'Won', 'Earned', 'Captured', 'Surpassed', 'Outperformed', 'Realized'
  ],
  improvement: [
    'Improved', 'Enhanced', 'Optimized', 'Accelerated', 'Streamlined',
    'Transformed', 'Revitalized', 'Modernized', 'Upgraded', 'Refined',
    'Boosted', 'Elevated', 'Strengthened', 'Maximized', 'Amplified'
  ],
  creation: [
    'Built', 'Developed', 'Designed', 'Architected', 'Engineered', 'Launched',
    'Pioneered', 'Created', 'Established', 'Introduced', 'Implemented',
    'Initiated', 'Founded', 'Constructed', 'Formulated', 'Devised'
  ],
  analysis: [
    'Analyzed', 'Evaluated', 'Assessed', 'Identified', 'Diagnosed',
    'Investigated', 'Researched', 'Examined', 'Audited', 'Reviewed',
    'Discovered', 'Uncovered', 'Mapped', 'Measured', 'Quantified'
  ],
  communication: [
    'Presented', 'Negotiated', 'Influenced', 'Advocated', 'Collaborated',
    'Facilitated', 'Articulated', 'Communicated', 'Persuaded', 'Conveyed',
    'Liaised', 'Mediated', 'Partnered', 'Aligned', 'Unified'
  ],
  execution: [
    'Executed', 'Implemented', 'Deployed', 'Delivered', 'Completed',
    'Fulfilled', 'Processed', 'Administered', 'Operated', 'Maintained',
    'Resolved', 'Addressed', 'Handled', 'Managed', 'Performed'
  ]
};

// Common metrics by industry/function
export const METRICS_BY_CATEGORY = {
  revenue: ['revenue', 'sales', 'ARR', 'MRR', 'deal size', 'average order value', 'lifetime value'],
  efficiency: ['time saved', 'processing time', 'cycle time', 'turnaround time', 'response time'],
  growth: ['growth rate', 'increase', 'expansion', 'user adoption', 'market share'],
  reduction: ['cost reduction', 'error rate', 'bug count', 'churn rate', 'downtime'],
  scale: ['users', 'customers', 'transactions', 'requests per second', 'data volume'],
  quality: ['accuracy', 'satisfaction score', 'NPS', 'retention rate', 'success rate']
};

// Weak phrase patterns with templates
export const WEAK_PATTERNS = [
  {
    id: 'managed_team',
    patterns: [
      /\bmanaged?\s+(a\s+)?team\b/i,
      /\bled\s+(a\s+)?team\b/i,
      /\bsupervised\s+(a\s+)?(team|staff|group)\b/i,
      /\boversaw\s+(a\s+)?team\b/i,
      /\bin\s+charge\s+of\s+(a\s+)?team\b/i
    ],
    template: {
      base: "Led {teamSize} {teamType} to {achievement} within {timeframe}",
      fields: {
        teamSize: {
          label: "Team size",
          type: "number",
          placeholder: "8",
          suffix: "-person",
          required: true
        },
        teamType: {
          label: "Team type",
          type: "select",
          options: [
            "engineering team",
            "development team",
            "cross-functional team",
            "product team",
            "design team",
            "operations team",
            "support team",
            "sales team",
            "remote team"
          ],
          required: true
        },
        achievement: {
          label: "Key achievement",
          type: "text",
          placeholder: "deliver $2M platform migration on time",
          suggestions: [
            "deliver {project} ahead of schedule",
            "reduce {metric} by {X}%",
            "increase {metric} by {X}%",
            "launch {product/feature} generating ${X} revenue",
            "achieve {X}% improvement in {area}"
          ],
          required: true
        },
        timeframe: {
          label: "Timeframe",
          type: "text",
          placeholder: "6 months",
          suggestions: ["3 months", "6 months", "9 months", "Q1 2024", "first year"],
          required: false
        }
      }
    },
    examples: [
      {
        before: "Managed a team of developers",
        after: "Led 8-person engineering team to deliver $1.5M e-commerce platform 2 weeks ahead of schedule"
      },
      {
        before: "Led team on various projects",
        after: "Led 12-person cross-functional team to reduce deployment time by 70% within 6 months"
      }
    ]
  },
  {
    id: 'responsible_for',
    patterns: [
      /\bresponsible\s+for\b/i,
      /\bin\s+charge\s+of\b/i,
      /\bhandled\b/i,
      /\btasked\s+with\b/i,
      /\baccountable\s+for\b/i
    ],
    template: {
      base: "Owned {scope}, resulting in {outcome}",
      fields: {
        scope: {
          label: "What you owned",
          type: "text",
          placeholder: "end-to-end CI/CD pipeline architecture",
          suggestions: [
            "full product lifecycle for {product}",
            "end-to-end {process} workflow",
            "{system/platform} architecture and maintenance",
            "customer success for {X} enterprise accounts"
          ],
          required: true
        },
        outcome: {
          label: "Measurable result",
          type: "text",
          placeholder: "75% reduction in deployment time",
          suggestions: [
            "{X}% reduction in {metric}",
            "{X}% increase in {metric}",
            "${X}K in annual cost savings",
            "{X}% improvement in {quality metric}"
          ],
          required: true
        }
      }
    },
    examples: [
      {
        before: "Responsible for deployment process",
        after: "Owned CI/CD pipeline architecture, resulting in 75% faster deployments and 90% reduction in rollback incidents"
      },
      {
        before: "Handled customer accounts",
        after: "Owned relationships with 15 enterprise accounts, resulting in 95% retention rate and $500K in upsells"
      }
    ]
  },
  {
    id: 'worked_on',
    patterns: [
      /\bworked\s+on\b/i,
      /\bhelped\s+(with|to)\b/i,
      /\bassisted\s+(with|in)?\b/i,
      /\bparticipated\s+in\b/i,
      /\binvolved\s+in\b/i,
      /\bcontributed\s+to\b/i
    ],
    template: {
      base: "Built {deliverable} that {impact} for {beneficiary}",
      fields: {
        deliverable: {
          label: "What you built/created",
          type: "text",
          placeholder: "real-time analytics dashboard",
          suggestions: [
            "automated {process} system",
            "scalable {service/API}",
            "self-service {tool/portal}",
            "integrated {feature} module"
          ],
          required: true
        },
        impact: {
          label: "Measurable impact",
          type: "text",
          placeholder: "reduced reporting time by 5 hours weekly",
          suggestions: [
            "reduced {metric} by {X}%",
            "saved {X} hours weekly",
            "processed {X}+ transactions daily",
            "improved accuracy by {X}%"
          ],
          required: true
        },
        beneficiary: {
          label: "Who benefited",
          type: "text",
          placeholder: "executive leadership team",
          suggestions: [
            "executive leadership team",
            "{X}+ internal users",
            "{X} enterprise customers",
            "cross-functional teams across {X} departments"
          ],
          required: false
        }
      }
    },
    examples: [
      {
        before: "Worked on reporting tools",
        after: "Built automated reporting dashboard that saved 20 hours weekly for finance team of 15 analysts"
      },
      {
        before: "Helped with the API",
        after: "Built RESTful API layer that handles 10K+ requests/second for 50+ enterprise customers"
      }
    ]
  },
  {
    id: 'improved',
    patterns: [
      /\bimproved\b/i,
      /\benhanced\b/i,
      /\boptimized\b/i,
      /\bstreamlined\b/i,
      /\brefined\b/i,
      /\bupgraded\b/i
    ],
    template: {
      base: "Improved {target} by {metric}, {additionalImpact}",
      fields: {
        target: {
          label: "What you improved",
          type: "text",
          placeholder: "application performance",
          suggestions: [
            "page load performance",
            "database query efficiency",
            "code maintainability",
            "user onboarding flow",
            "system reliability"
          ],
          required: true
        },
        metric: {
          label: "By how much",
          type: "text",
          placeholder: "60%",
          suggestions: ["25%", "40%", "60%", "2x", "3x", "10x"],
          required: true
        },
        additionalImpact: {
          label: "Additional business impact",
          type: "text",
          placeholder: "reducing server costs by $50K annually",
          suggestions: [
            "reducing infrastructure costs by ${X}K annually",
            "increasing conversion rate by {X}%",
            "decreasing customer churn by {X}%",
            "enabling {X}x more concurrent users"
          ],
          required: false
        }
      }
    },
    examples: [
      {
        before: "Improved website performance",
        after: "Improved page load time by 60%, increasing conversion rate by 15% and reducing bounce rate by 25%"
      },
      {
        before: "Optimized database queries",
        after: "Improved query performance by 10x, reducing average response time from 2s to 200ms"
      }
    ]
  },
  {
    id: 'created',
    patterns: [
      /\bcreated\b/i,
      /\bdeveloped\b/i,
      /\bdesigned\b/i,
      /\bimplemented\b/i,
      /\bbuilt\b/i,
      /\bestablished\b/i
    ],
    template: {
      base: "Developed {solution} that {primaryBenefit}, impacting {scope}",
      fields: {
        solution: {
          label: "What you created",
          type: "text",
          placeholder: "automated testing framework",
          suggestions: [
            "microservices architecture",
            "real-time monitoring system",
            "automated deployment pipeline",
            "self-healing infrastructure",
            "machine learning model"
          ],
          required: true
        },
        primaryBenefit: {
          label: "Primary benefit",
          type: "text",
          placeholder: "reduced QA time by 70%",
          suggestions: [
            "reduced {process} time by {X}%",
            "eliminated {X} hours of manual work weekly",
            "increased throughput by {X}x",
            "achieved {X}% accuracy"
          ],
          required: true
        },
        scope: {
          label: "Scale of impact",
          type: "text",
          placeholder: "15 development teams across 3 regions",
          suggestions: [
            "{X} teams across {Y} departments",
            "{X}+ daily active users",
            "${X}M in annual transactions",
            "entire engineering organization of {X}+ developers"
          ],
          required: false
        }
      }
    },
    examples: [
      {
        before: "Created a testing system",
        after: "Developed automated testing framework that reduced QA cycle from 2 weeks to 2 days, adopted by 15 teams globally"
      },
      {
        before: "Built new features",
        after: "Developed recommendation engine that increased average order value by 25%, generating $2M additional revenue"
      }
    ]
  },
  {
    id: 'collaborated',
    patterns: [
      /\bcollaborated\s+(with)?\b/i,
      /\bworked\s+(closely\s+)?with\b/i,
      /\bpartnered\s+with\b/i,
      /\bcoordinated\s+with\b/i,
      /\bteamed\s+up\b/i
    ],
    template: {
      base: "Partnered with {stakeholders} to {initiative}, achieving {result}",
      fields: {
        stakeholders: {
          label: "Who you worked with",
          type: "text",
          placeholder: "product and design teams",
          suggestions: [
            "product, design, and engineering teams",
            "C-suite executives",
            "external vendors and partners",
            "cross-functional stakeholders"
          ],
          required: true
        },
        initiative: {
          label: "What you did together",
          type: "text",
          placeholder: "redesign checkout flow",
          suggestions: [
            "redesign {feature/process}",
            "launch {product/service}",
            "migrate to {new system}",
            "implement {new process}"
          ],
          required: true
        },
        result: {
          label: "Measurable outcome",
          type: "text",
          placeholder: "25% increase in completed purchases",
          suggestions: [
            "{X}% increase in {metric}",
            "{X}% reduction in {metric}",
            "on-time delivery under ${X}K budget",
            "{X}x improvement in {metric}"
          ],
          required: true
        }
      }
    },
    examples: [
      {
        before: "Collaborated with other teams",
        after: "Partnered with product, design, and data teams to redesign onboarding flow, achieving 40% improvement in activation rate"
      },
      {
        before: "Worked with stakeholders",
        after: "Partnered with sales and customer success to implement CRM integration, achieving 30% increase in lead conversion"
      }
    ]
  },
  {
    id: 'communicated',
    patterns: [
      /\bcommunicated\b/i,
      /\bpresented\b/i,
      /\breported\b/i,
      /\bdocumented\b/i,
      /\bbriefed\b/i
    ],
    template: {
      base: "Presented {content} to {audience}, leading to {outcome}",
      fields: {
        content: {
          label: "What you presented",
          type: "text",
          placeholder: "technical roadmap and architecture proposals",
          suggestions: [
            "quarterly business reviews",
            "technical architecture proposals",
            "product strategy and roadmap",
            "performance metrics and insights"
          ],
          required: true
        },
        audience: {
          label: "To whom",
          type: "text",
          placeholder: "C-suite executives",
          suggestions: [
            "C-suite executives",
            "board of directors",
            "enterprise clients",
            "cross-functional leadership"
          ],
          required: true
        },
        outcome: {
          label: "What resulted",
          type: "text",
          placeholder: "approval of $500K infrastructure investment",
          suggestions: [
            "approval of ${X}K budget",
            "securing {X} new enterprise contracts",
            "alignment on {X}-month roadmap",
            "executive buy-in for {initiative}"
          ],
          required: true
        }
      }
    },
    examples: [
      {
        before: "Communicated with stakeholders",
        after: "Presented quarterly security reports to board of directors, leading to approval of $300K security infrastructure investment"
      },
      {
        before: "Reported on project status",
        after: "Presented technical feasibility analysis to VP of Engineering, leading to $1M investment in cloud migration"
      }
    ]
  },
  {
    id: 'reduced_costs',
    patterns: [
      /\breduced?\s+costs?\b/i,
      /\bsaved?\s+money\b/i,
      /\bcut\s+(costs?|expenses?|spending)\b/i,
      /\blowered\s+(costs?|expenses?)\b/i,
      /\bdecreased\s+spending\b/i
    ],
    template: {
      base: "Reduced {costType} by ${amount} annually through {method}",
      fields: {
        costType: {
          label: "Type of cost",
          type: "text",
          placeholder: "cloud infrastructure costs",
          suggestions: [
            "cloud infrastructure costs",
            "operational expenses",
            "vendor licensing fees",
            "maintenance overhead",
            "customer acquisition costs"
          ],
          required: true
        },
        amount: {
          label: "Amount saved (K or M)",
          type: "text",
          placeholder: "150K",
          suggestions: ["50K", "100K", "150K", "200K", "500K", "1M"],
          required: true
        },
        method: {
          label: "How you achieved it",
          type: "text",
          placeholder: "implementing serverless architecture and optimizing cloud resources",
          suggestions: [
            "implementing auto-scaling and reserved instances",
            "renegotiating vendor contracts",
            "automating manual processes",
            "consolidating redundant systems",
            "optimizing resource utilization"
          ],
          required: true
        }
      }
    },
    examples: [
      {
        before: "Reduced costs",
        after: "Reduced cloud infrastructure costs by $200K annually through implementing auto-scaling and reserved instances"
      },
      {
        before: "Saved money on operations",
        after: "Reduced operational costs by $150K annually through automating 80% of manual deployment processes"
      }
    ]
  }
];

/**
 * Detect if text contains a weak phrase pattern
 * @param {string} text - Bullet point text to analyze
 * @returns {Object|null} - Detected pattern info or null
 */
export function detectWeakPattern(text) {
  if (!text || typeof text !== 'string' || text.trim().length < 5) {
    return null;
  }

  const normalizedText = text.toLowerCase().trim();

  for (const pattern of WEAK_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(normalizedText)) {
        return {
          patternId: pattern.id,
          pattern: pattern,
          matchedText: text
        };
      }
    }
  }

  return null;
}

/**
 * Generate a statement from template and field values
 * @param {Object} pattern - Pattern object with template
 * @param {Object} fieldValues - User-provided field values
 * @returns {string} - Generated statement
 */
export function generateStatement(pattern, fieldValues) {
  if (!pattern?.template?.base) return '';

  let result = pattern.template.base;

  Object.entries(pattern.template.fields).forEach(([key, field]) => {
    const value = fieldValues[key];
    let displayValue = value || '';

    // Add suffix if defined (e.g., "8" -> "8-person")
    if (field.suffix && displayValue) {
      displayValue = displayValue + field.suffix;
    }

    // Replace placeholder or show placeholder hint
    const placeholder = displayValue || `[${field.label}]`;
    result = result.replace(`{${key}}`, placeholder);
  });

  // Clean up any trailing commas or empty sections
  result = result.replace(/,\s*\[.*?\]/g, '');
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

/**
 * Calculate strength score for a bullet point
 * @param {string} text - Bullet point text
 * @returns {number} - Score from 0-100
 */
export function getStrengthScore(text) {
  if (!text || typeof text !== 'string') return 0;

  let score = 0;
  const normalizedText = text.toLowerCase();

  // Check for numbers/metrics (+20 each, max 40)
  const numbers = text.match(/\d+%|\$[\d,]+[KMB]?|\d+[x×]|\d+\+?/g) || [];
  score += Math.min(numbers.length * 20, 40);

  // Check for power verbs at start (+15)
  const allPowerVerbs = Object.values(POWER_VERBS).flat();
  const startsWithPowerVerb = allPowerVerbs.some(verb => {
    const verbLower = verb.toLowerCase();
    return normalizedText.startsWith(verbLower) ||
           normalizedText.match(new RegExp(`^${verbLower}\\b`));
  });
  if (startsWithPowerVerb) score += 15;

  // Check for outcome/result words (+15)
  const outcomeWords = [
    'resulting in', 'leading to', 'achieving', 'enabling', 'driving',
    'generating', 'delivering', 'producing', 'yielding', 'contributing to'
  ];
  if (outcomeWords.some(word => normalizedText.includes(word))) score += 15;

  // Check for scope/scale indicators (+10)
  const scopeWords = [
    'team', 'company', 'organization', 'global', 'enterprise', 'users',
    'customers', 'clients', 'departments', 'regions', 'annually', 'monthly',
    'daily', 'worldwide', 'across'
  ];
  if (scopeWords.some(word => normalizedText.includes(word))) score += 10;

  // Check for specific technologies/tools (+5)
  const hasTechTerms = /\b(api|aws|cloud|database|system|platform|infrastructure|pipeline|framework)\b/i.test(text);
  if (hasTechTerms) score += 5;

  // Check for time-based results (+5)
  const hasTimeMetric = /\b(\d+\s*(hours?|days?|weeks?|months?|minutes?))\b/i.test(text);
  if (hasTimeMetric) score += 5;

  // Penalty for weak phrases (-20)
  const weakPhrases = [
    'responsible for', 'helped', 'assisted', 'worked on', 'involved in',
    'participated in', 'contributed to', 'supported', 'handled', 'dealt with',
    'various', 'multiple', 'different', 'many'
  ];
  if (weakPhrases.some(phrase => normalizedText.includes(phrase))) {
    score -= 20;
  }

  // Penalty for vague language (-10)
  const vagueWords = ['things', 'stuff', 'etc', 'various tasks', 'other duties'];
  if (vagueWords.some(word => normalizedText.includes(word))) {
    score -= 10;
  }

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get strength label based on score
 * @param {number} score - Strength score (0-100)
 * @returns {Object} - Label and color
 */
export function getStrengthLabel(score) {
  if (score >= 80) return { label: 'Excellent', color: '#22c55e' };
  if (score >= 60) return { label: 'Strong', color: '#84cc16' };
  if (score >= 40) return { label: 'Fair', color: '#eab308' };
  if (score >= 20) return { label: 'Weak', color: '#f97316' };
  return { label: 'Needs Work', color: '#ef4444' };
}

/**
 * Get all power verbs as a flat array
 * @returns {string[]} - Array of all power verbs
 */
export function getAllPowerVerbs() {
  return Object.values(POWER_VERBS).flat();
}

/**
 * Get power verbs by category
 * @param {string} category - Category name
 * @returns {string[]} - Array of verbs for that category
 */
export function getPowerVerbsByCategory(category) {
  return POWER_VERBS[category] || [];
}

/**
 * Suggest improvements for a bullet point
 * @param {string} text - Original bullet point
 * @returns {Object} - Suggestions object
 */
export function suggestImprovements(text) {
  const score = getStrengthScore(text);
  const pattern = detectWeakPattern(text);
  const suggestions = [];

  if (score < 40) {
    // Check what's missing
    const hasNumbers = /\d/.test(text);
    const hasMetrics = /\d+%|\$[\d,]+/.test(text);

    if (!hasNumbers) {
      suggestions.push({
        type: 'metrics',
        message: 'Add specific numbers (team size, percentages, dollar amounts)'
      });
    }

    if (!hasMetrics) {
      suggestions.push({
        type: 'impact',
        message: 'Quantify your impact (e.g., "increased by 25%", "saved $50K")'
      });
    }

    const startsWithVerb = getAllPowerVerbs().some(v =>
      text.toLowerCase().startsWith(v.toLowerCase())
    );
    if (!startsWithVerb) {
      suggestions.push({
        type: 'verb',
        message: 'Start with a strong action verb (Led, Built, Achieved, etc.)'
      });
    }
  }

  return {
    score,
    label: getStrengthLabel(score),
    pattern,
    suggestions,
    canStrengthen: pattern !== null
  };
}
