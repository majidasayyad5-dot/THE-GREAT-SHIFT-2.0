import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    mode: isProd ? 'production' : 'development',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Response JSON schema for Gemini 3.8 Flash structured interpretation
const aiInsightsSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description:
        'A concise 2-3 sentence executive summary explaining the high-level business findings in clear, friendly language without buzzwords.',
    },
    key_insights: {
      type: Type.ARRAY,
      description:
        'List of evidence-backed insights organized across supported categories (Sales, Products, Customers, Inventory, Expenses, Operations, Growth).',
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description:
              'Supported business category: Sales, Products, Customers, Inventory, Expenses, Operations, or Growth.',
          },
          title: {
            type: Type.STRING,
            description: 'Short, clear insight title (e.g. Concentrated Revenue in Lead SKU).',
          },
          evidence: {
            type: Type.STRING,
            description: 'Observed evidence: What the actual data shows with verified figures.',
          },
          interpretation: {
            type: Type.STRING,
            description: 'AI interpretation: What the pattern could indicate without claiming causation.',
          },
          importance: {
            type: Type.STRING,
            description: 'Why it matters: Why the business owner may want to examine it.',
          },
          data_limitation: {
            type: Type.STRING,
            description: 'Data limitation: What information is missing, unmeasured, or uncertain.',
          },
        },
        required: ['category', 'title', 'evidence', 'interpretation', 'importance'],
      },
    },
    areas_to_review: {
      type: Type.ARRAY,
      description:
        'Suggested areas or potential operational bottlenecks for the business owner to review.',
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description:
              'Supported category: Sales, Products, Customers, Inventory, Expenses, Operations, or Growth.',
          },
          issue: {
            type: Type.STRING,
            description: 'Suggested area to review (phrased constructively).',
          },
          evidence: {
            type: Type.STRING,
            description: 'Direct factual evidence calculated by the deterministic engine.',
          },
          possible_reason: {
            type: Type.STRING,
            description: 'Possible commercial or market reason.',
          },
          consider_reviewing: {
            type: Type.STRING,
            description:
              'Constructive, non-commanding recommendation (e.g., Consider reviewing safety buffer levels...).',
          },
        },
        required: ['category', 'issue', 'evidence', 'possible_reason'],
      },
    },
    opportunities: {
      type: Type.ARRAY,
      description:
        'Potential commercial opportunities derived strictly from positive data signals.',
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description:
              'Supported category: Sales, Products, Customers, Inventory, Expenses, Operations, or Growth.',
          },
          opportunity: {
            type: Type.STRING,
            description: 'Potential commercial opportunity.',
          },
          evidence: {
            type: Type.STRING,
            description: 'Data evidence supporting this opportunity.',
          },
          possible_action: {
            type: Type.STRING,
            description:
              'Possible action the owner might explore (framed respectfully, not as a command).',
          },
        },
        required: ['category', 'opportunity', 'evidence', 'possible_action'],
      },
    },
    data_limitations: {
      type: Type.ARRAY,
      description:
        'Explicit list of missing data or unmeasured attributes that would improve diagnostic certainty.',
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ['summary', 'key_insights', 'areas_to_review', 'opportunities', 'data_limitations'],
};

// Server-side Gemini AI Insights endpoint
app.post('/api/gemini/insights', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI interpretation is temporarily unavailable.',
      });
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        error: 'Invalid payload provided.',
      });
    }

    const {
      businessLevel = 'Local / Micro Business',
      businessType = 'Commercial Products & Inventory',
      locale = 'English',
      localeCode = 'en',
      dataSources,
      metrics,
      patterns,
      businessAlerts,
      dataQualityWarnings,
    } = payload;

    // Strict system instruction adhering to zero-hallucination boundary
    const systemInstruction = `You are a business analysis assistant.
Interpret only the evidence provided by the application's deterministic analysis engine.
Do not invent statistics.
Do not invent transactions.
Do not assume missing information.
Do not present assumptions as facts.
If evidence is insufficient, explicitly state that more data is required.
Distinguish observed facts from possible explanations.
Do not claim that an AI/ML model has been trained unless the application has actually trained one.
Use clear language suitable for small-business owners.
Your role is to support human decision-making, not make decisions for the business.

LANGUAGE INSTRUCTION:
Respond in the user's selected application language: ${locale} (${localeCode}).
Keep technical AI/ML method names (such as "Time-Series Forecasting", "K-Means Clustering", "Collaborative Filtering", "Anomaly Detection", "Regression") in English where translation would reduce clarity, but explain them in ${locale}.
All user-facing text strings (summary, titles, evidence explanations, interpretations, importance, issues, possible reasons, opportunities, possible actions, data limitations) must be written in fluent, natural ${locale}.

HUMAN-CONTROL WORDING:
Never display AI recommendations as commands or directives.
Always use non-prescriptive, supportive phrasing such as:
"Possible action", "Suggested area to review", "Potential opportunity", "Consider reviewing".
The business owner remains responsible for the final decision.

STRICT CATEGORY DISCIPLINE:
Categorize insights into: Sales, Products, Customers, Inventory, Expenses, Operations, Growth.
Only generate insights for categories that are actively supported by the provided data.
If an area has no data (e.g. no expenses logged), do not invent findings for it.`;

    // Compact prompt with evidence only
    const userPrompt = `Please interpret the following verified deterministic business analysis evidence:

BUSINESS CONTEXT:
- Operating Scale: ${businessLevel}
- Business Type: ${businessType}
- Active Data Sources: ${dataSources?.summary || 'Standard Business Records'} (${dataSources?.totalRecords || 0} records)
- Data Sufficiency Status: ${dataSources?.sufficiencyStatus || 'Evaluated'}
- Unrecorded Fields / Data Gaps: ${dataSources?.missingFields?.join(', ') || 'None flagged'}

VERIFIED KEY METRICS (Observed directly from records):
- Total Recorded Revenue: ${metrics?.revenue || 'Not recorded'}
- Total Recorded Expenses: ${metrics?.expenses || 'Not recorded'}
- Potential Operating Margin / Net Difference: ${metrics?.netDifference || 'Indeterminate'}
- Total Orders Logged: ${metrics?.orderCount || '0'}
- Active Catalog SKUs: ${metrics?.productCount || '0'}
- Customer Directory Accounts: ${metrics?.customerCount || '0'}
- Items At or Below Safety Buffer: ${metrics?.lowStockCount || '0'}
- Items Completely Out of Stock: ${metrics?.outOfStockCount || '0'}

OBSERVED COMMERCIAL PATTERNS:
- Sales Velocity: ${patterns?.salesVelocity || 'No periodic dates'}
- Top Contributing Products: ${patterns?.topProducts?.join('; ') || 'Not available'}
- Lowest Contributing Products: ${patterns?.lowestProducts?.join('; ') || 'Not available'}
- Category Distribution: ${patterns?.topCategories?.join('; ') || 'Not available'}
- Regional Distribution: ${patterns?.regionalBreakdown?.join('; ') || 'Single region / not specified'}
- Inventory Imbalances: ${patterns?.inventoryImbalances?.join('; ') || 'No acute imbalances detected'}
- Operating Expense Shares: ${patterns?.expenseBreakdown?.join('; ') || 'No operating expenses logged'}

DETERMINISTIC BUSINESS ALERTS FLAGGED:
${
  businessAlerts && businessAlerts.length > 0
    ? businessAlerts.map((a: any) => `- [${a.type || 'Notice'}] ${a.title}: ${a.evidence}`).join('\n')
    : '- No anomalous alerts flagged by the deterministic engine.'
}

DATA QUALITY & GOVERNANCE WARNINGS:
${
  dataQualityWarnings && dataQualityWarnings.length > 0
    ? dataQualityWarnings.map((w: string) => `- ${w}`).join('\n')
    : '- All ingested records conform to schema validation.'
}

Return your structured interpretation in valid JSON matching the requested schema.`;

    // Initialize Gemini API client on server side
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: aiInsightsSchema,
        temperature: 0.2, // Low temperature for high adherence to provided facts
      },
    });

    const rawText = response.text || '';
    let parsed: any;

    try {
      parsed = JSON.parse(rawText.trim());
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output');
      return res.status(502).json({
        error: 'AI interpretation is temporarily unavailable.',
      });
    }

    // Validate essential keys
    if (!parsed.summary || !Array.isArray(parsed.key_insights)) {
      return res.status(502).json({
        error: 'AI interpretation is temporarily unavailable.',
      });
    }

    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini AI Insights Error occurred on server');
    return res.status(500).json({
      error: 'AI interpretation is temporarily unavailable.',
    });
  }
});

/**
 * Global Guidance Assistant Endpoint: /api/assistant
 * Powers THE GREAT SHIFT ASSISTANT with page context, data awareness,
 * and reliable fallback mechanisms.
 */
app.post('/api/assistant', async (req: Request, res: Response) => {
  const {
    message,
    pageContext = 'Dashboard',
    businessContext = {},
    metrics = {},
    locale = 'en',
    history = [],
  } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Domain rule-based generator for fallback or offline states
  const generateRuleBasedAnswer = (userQuery: string, context: string): string => {
    const q = userQuery.toLowerCase();

    // Asha demo
    if (q.includes('asha') || q.includes('demo')) {
      return "You can click 'TRY ASHA'S DEMO' from the Dashboard or Top Bar to instantly load the fictional handmade apparel dataset. It walks through data quality checks, revenue diagnostics, AI insights, archetype recommendations, and the Human Decision protocol without typing anything.";
    }

    // How to start
    if (q.includes('start') || q.includes('how do i begin') || q.includes('first step')) {
      return "To get started with THE GREAT SHIFT 2.0:\n1. Choose your Business Level (Local, City, or International).\n2. Upload your sales/inventory spreadsheet (CSV/XLSX) in 'Analyze Business', or use 'Manage Affairs' to log items directly.\n3. Run the deterministic analysis to view verified metrics, quality score, and evidence-backed recommendations.\n4. Review and decide on recommendations in the Human Decision Hub.";
    }

    // Upload data
    if (q.includes('upload') || q.includes('format') || q.includes('csv') || q.includes('excel')) {
      return "In 'Analyze Business', you can upload CSV, XLSX, JSON, or PDF summaries. Recommended columns include: Product Name, Date, Selling Price, Cost Price, Quantity, Customer Name, and Category. The system automatically inspects data quality, flags missing values, and checks completeness.";
    }

    // Data quality / Completeness
    if (q.includes('completeness') || q.includes('quality') || q.includes('missing')) {
      return "Data Completeness measures the percentage of required cells that are non-empty and mathematically valid. Missing prices, null dates, or negative values reduce the score. A completeness above 85% ensures reliable diagnostics and forecasting.";
    }

    // Chart meaning
    if (q.includes('chart') || q.includes('graph') || q.includes('trend')) {
      if (metrics.revenue) {
        return `The current charts display your business trajectory based on recorded data: Total Revenue of ${metrics.revenue}, Operating Expenses of ${metrics.expenses || 'Not logged'}, and SKU breakdown. They reveal volume peaks, top contributor shares, and expense distribution.`;
      }
      return "Charts visualize verified figures: Revenue trends over time, Product SKU contributions, and Expense allocations. If no data has been uploaded yet, upload your records or click 'Try Asha's Demo' to see interactive sample charts.";
    }

    // Recommendations & Methods
    if (q.includes('recommendation') || q.includes('method') || q.includes('algorithm') || q.includes('k-means') || q.includes('forecasting')) {
      if (q.includes('k-means') || q.includes('cluster')) {
        return "K-Means Clustering groups customers or items with similar behavioral attributes (e.g. order frequency vs monetary value) to uncover natural segments without predefined bias.";
      }
      if (q.includes('time-series') || q.includes('forecast')) {
        return "Time-Series Forecasting analyzes chronological order sequences to project future inventory demand patterns and seasonal safety buffers.";
      }
      return "THE GREAT SHIFT 2.0 matches appropriate AI/ML methods (Time-Series Forecasting, K-Means Clustering, Regression, Anomaly Detection) directly to observed data gaps. Remember: AI provides recommendations, but you as the business owner make the final decision.";
    }

    // Human decision
    if (q.includes('decision') || q.includes('human') || q.includes('accept') || q.includes('reject')) {
      return "The core principle is 'AI analyzes. Humans decide.' The system never enforces automated decisions. In the Human Decision Hub, you can Accept, Modify, or Reject any recommendation, add strategic rationale notes, and maintain an audit history.";
    }

    // Data-aware product inquiry
    if (q.includes('product') || q.includes('performing') || q.includes('poorly') || q.includes('best seller')) {
      if (metrics.topProducts && metrics.topProducts.length > 0) {
        return `Based on your analyzed records, top performing items include: ${metrics.topProducts.join(', ')}. If any SKU has low turnover, inspect it in 'Manage Affairs > Products' to consider adjusting pricing or inventory buffers.`;
      }
      return "I don't have enough data to answer that reliably. Please upload your sales records or enter product items in 'Manage Affairs' to evaluate SKU performance.";
    }

    // Context-dependent response based on page
    if (context.toLowerCase().includes('data')) {
      return "You are on the Data module. Here you can inspect raw records, column mappings, duplicate checks, and field coverage before running calculations.";
    }
    if (context.toLowerCase().includes('chart')) {
      return "You are viewing Analytics Charts. These plots map your verified ledger entries. Tooltips show exact values without smoothing or guesswork.";
    }
    if (context.toLowerCase().includes('decision')) {
      return "In the Human Decision Hub, every AI recommendation requires explicit human sign-off. You can record your choice (Accept, Modify, or Reject) along with notes.";
    }

    return "THE GREAT SHIFT 2.0 assists your business by evaluating verified records, flagging inventory & revenue concentration patterns, and suggesting algorithmic ML techniques. The final decision always remains in your hands. How can I assist you with your current analysis?";
  };

  // If no Gemini key is provided, return rich rule-based answer
  if (!apiKey) {
    const text = generateRuleBasedAnswer(message, pageContext);
    return res.json({ text, fallback: true });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const systemInstruction = `You are "THE GREAT SHIFT ASSISTANT", an embedded expert intelligence guide inside THE GREAT SHIFT 2.0: AI Business Intelligence & Growth Analyzer.
Motto: "AI analyzes. Humans decide."

GUIDELINES:
1. Conciseness: Keep responses short, structured, and easy for busy business owners to read (2-4 brief paragraphs or concise bullet points).
2. Data Truthfulness: NEVER fabricate business numbers, revenues, or performance. If data is missing or incomplete, explicitly state: "I don't have enough data to answer that reliably."
3. AI/ML Methods: When asked about methods (Time-Series Forecasting, Regression, K-Means Clustering, Collaborative Filtering, NLP, Anomaly Detection), explain what they do in plain business terms.
4. Human Decision: Emphasize that AI recommends, but the human business owner always decides (Accept, Modify, Reject).
5. Language: Answer in the requested locale (${locale}). If locale is 'hi', answer in Hindi; if 'mr', answer in Marathi; if 'en', answer in English, etc.
6. Page Context: The user is currently on the "${pageContext}" page. Connect your guidance directly to what is on their screen.`;

    const userPrompt = `USER QUERY: ${message}

CURRENT PAGE: ${pageContext}
BUSINESS PROFILE: Name: ${businessContext.name || 'Small Business'}, Level: ${businessContext.level || 'Local'}, Type: ${businessContext.type || 'Retail/Commerce'}
AVAILABLE DATA SUMMARY:
- Revenue: ${metrics.revenue || 'Not recorded'}
- Expenses: ${metrics.expenses || 'Not recorded'}
- Net Diff: ${metrics.netDifference || 'Not evaluated'}
- Products: ${metrics.productCount || 0}
- Low Stock SKUs: ${metrics.lowStockCount || 0}
- Sufficiency Status: ${metrics.sufficiencyStatus || 'Evaluated'}

Please provide clear, concise, actionable guidance.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    });

    const replyText = response.text || '';
    if (!replyText.trim()) {
      const fallbackText = generateRuleBasedAnswer(message, pageContext);
      return res.json({ text: fallbackText, fallback: true });
    }

    return res.json({ text: replyText.trim(), fallback: false });
  } catch (err: any) {
    console.warn('Gemini Assistant API error / quota limit reached; using deterministic domain guide:', err?.message || err);
    const fallbackText = generateRuleBasedAnswer(message, pageContext);
    return res.json({ text: fallbackText, fallback: true });
  }
});

// Mount Vite or static dist
async function initServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`THE GREAT SHIFT 2.0 Server listening on port ${PORT} (prod=${isProd})`);
  });
}

initServer().catch((err) => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});
