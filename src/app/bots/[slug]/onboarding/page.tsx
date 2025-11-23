"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { validateBusinessDataForGibberish } from "@/lib/utils/gibberish-detection";

const TOTAL_STEPS = 9;

const getBusinessDescriptionSuggestions = (businessType: string): string[] => {
  const suggestions: Record<string, string[]> = {
    SaaS: [
      "Cloud-based software solutions",
      "Subscription management platform",
      "Project management tools",
      "CRM and sales automation",
      "Analytics and reporting software",
      "API and integration services",
      "Workflow automation platform",
      "Team collaboration software",
      "Customer support platform",
      "Marketing automation tools",
    ],
    "E-commerce": [
      "Online retail marketplace",
      "Dropshipping platform",
      "Digital product sales",
      "Subscription box service",
      "B2B wholesale platform",
      "Custom product manufacturing",
      "Multi-vendor marketplace",
      "Grocery delivery service",
      "Fashion and apparel retail",
      "Electronics and tech products",
    ],
    Agency: [
      "Digital marketing services",
      "Web design and development",
      "Brand identity and design",
      "Content creation and strategy",
      "Social media management",
      "SEO and SEM services",
      "Advertising campaign management",
      "Public relations services",
      "Video production and editing",
      "Event planning and management",
    ],
    Consulting: [
      "Business strategy consulting",
      "Management consulting",
      "IT and technology consulting",
      "Financial advisory services",
      "HR and talent consulting",
      "Operations optimization",
      "Change management consulting",
      "Digital transformation consulting",
      "Marketing strategy consulting",
      "Legal and compliance consulting",
    ],
    Healthcare: [
      "Telemedicine platform",
      "Electronic health records",
      "Patient management system",
      "Medical appointment scheduling",
      "Health monitoring devices",
      "Pharmacy services",
      "Mental health services",
      "Wellness and fitness programs",
      "Medical billing software",
      "Healthcare analytics platform",
    ],
    Education: [
      "Online learning platform",
      "Educational content creation",
      "Student management system",
      "Tutoring and coaching services",
      "Educational assessment tools",
      "Learning management system",
      "Skill development courses",
      "Certification programs",
      "Educational consulting",
      "E-learning content delivery",
    ],
    Finance: [
      "Investment advisory services",
      "Personal finance management",
      "Payment processing platform",
      "Cryptocurrency exchange",
      "Loan and credit services",
      "Financial planning tools",
      "Accounting software",
      "Tax preparation services",
      "Insurance services",
      "Wealth management platform",
    ],
    "Real Estate": [
      "Property listing platform",
      "Real estate brokerage",
      "Property management services",
      "Real estate investment platform",
      "Home buying and selling services",
      "Property valuation services",
      "Real estate analytics",
      "Rental property management",
      "Commercial real estate services",
      "Real estate consulting",
    ],
    Manufacturing: [
      "Custom manufacturing services",
      "Industrial equipment production",
      "Electronics manufacturing",
      "Automotive parts manufacturing",
      "Food and beverage production",
      "Textile and apparel manufacturing",
      "Medical device manufacturing",
      "Packaging solutions",
      "Quality control services",
      "Supply chain management",
    ],
    Retail: [
      "Brick-and-mortar retail stores",
      "Specialty retail products",
      "Consumer goods distribution",
      "Retail franchise operations",
      "Pop-up shop services",
      "Retail analytics and insights",
      "Inventory management solutions",
      "Customer loyalty programs",
      "Retail consulting services",
      "Omnichannel retail platform",
    ],
    Technology: [
      "Software development services",
      "IT infrastructure solutions",
      "Cybersecurity services",
      "Cloud computing services",
      "Data analytics and AI solutions",
      "Mobile app development",
      "Blockchain solutions",
      "IoT device development",
      "Tech consulting services",
      "DevOps and automation",
    ],
    Marketing: [
      "Marketing automation platform",
      "Email marketing services",
      "Content marketing agency",
      "Influencer marketing platform",
      "Marketing analytics tools",
      "Lead generation services",
      "Marketing strategy consulting",
      "Brand awareness campaigns",
      "Performance marketing",
      "Marketing technology solutions",
    ],
  };

  return (
    suggestions[businessType] || [
      "Business solutions and services",
      "Professional consulting",
      "Custom solutions development",
      "Client-focused services",
      "Innovative business services",
    ]
  );
};

const steps = [
  {
    id: 1,
    question: "What type of bot are you creating?",
    field: "bot_type",
    placeholder: "Select bot type",
    type: "chips" as const,
    options: ["Business", "Personal Project"],
    multiSelect: false,
  },
  {
    id: 2,
    question: "What's your business name?",
    field: "business_name",
    placeholder: "e.g., TechCorp Solutions",
    type: "text" as const,
  },
  {
    id: 3,
    question: "What type of business is it?",
    field: "business_type",
    placeholder: "e.g., SaaS, E-commerce, Agency",
    type: "chips" as const,
    options: [
      "SaaS",
      "E-commerce",
      "Agency",
      "Consulting",
      "Healthcare",
      "Education",
      "Finance",
      "Real Estate",
      "Manufacturing",
      "Retail",
      "Technology",
      "Marketing",
    ],
    multiSelect: false,
    allowCustom: true,
  },
  {
    id: 4,
    question: "What does your business do?",
    field: "business_description",
    placeholder: "Describe your business and what it does...",
    type: "chips" as const,
    options: [], // Dynamic based on business_type
    multiSelect: true,
    allowCustomTextarea: true,
  },
  {
    id: 5,
    question: "What's your product or service name?",
    field: "product_name",
    placeholder: "e.g., CloudSync Pro",
    type: "text" as const,
  },
  {
    id: 6,
    question: "Describe your product or service",
    field: "product_description",
    placeholder: "What features and benefits does it offer?",
    type: "textarea" as const,
  },
  {
    id: 7,
    question: "Who is your target audience?",
    field: "target_audience",
    placeholder: "e.g., Small businesses, Enterprise IT managers",
    type: "chips" as const,
    options: [
      "Small Businesses",
      "Enterprise",
      "Startups",
      "Individual Consumers",
      "Developers",
      "Marketing Teams",
      "Sales Teams",
      "HR Professionals",
      "Students",
      "Healthcare Providers",
      "Educators",
      "Other",
    ],
    multiSelect: true,
    allowCustom: true,
  },
  {
    id: 8,
    question: "What problem does your business solve?",
    field: "problem",
    placeholder: "Describe the main problem your business addresses...",
    type: "chips" as const,
    options: [
      "Time Management",
      "Cost Reduction",
      "Data Security",
      "Customer Support",
      "Process Automation",
      "Communication Gaps",
      "Information Overload",
      "Manual Workflows",
      "Scalability Issues",
      "Integration Challenges",
      "User Experience",
      "Resource Optimization",
      "Decision Making",
      "Knowledge Management",
      "Other",
    ],
    multiSelect: true,
    allowCustom: true,
  },
  {
    id: 9,
    question: "What is your brand voice?",
    field: "brand_voice",
    placeholder: "Select a voice style",
    type: "select" as const,
    options: ["formal", "friendly", "professional", "casual", "humorous"],
  },
];

const personalProjectSteps = [
  {
    id: 2,
    question: "What's your project name?",
    field: "business_name",
    placeholder: "e.g., My Portfolio Bot",
    type: "text" as const,
  },
  {
    id: 3,
    question: "What type of personal project is it?",
    field: "business_type",
    placeholder: "Select project type",
    type: "chips" as const,
    options: [
      "Portfolio",
      "Personal Blog",
      "Creative Project",
      "Learning Project",
      "Hobby Project",
      "Personal Assistant",
      "Other",
    ],
    multiSelect: false,
    allowCustom: true,
  },
  {
    id: 4,
    question: "Describe your project",
    field: "business_description",
    placeholder: "What is this project about?",
    type: "textarea" as const,
  },
  {
    id: 5,
    question: "What's your project/bot name?",
    field: "product_name",
    placeholder: "e.g., Portfolio Assistant",
    type: "text" as const,
  },
  {
    id: 6,
    question: "What does your bot do?",
    field: "product_description",
    placeholder: "Describe what your bot helps with...",
    type: "textarea" as const,
  },
  {
    id: 7,
    question: "Who will use this bot?",
    field: "target_audience",
    placeholder: "e.g., Visitors, Friends, Myself",
    type: "chips" as const,
    options: [
      "Personal Use",
      "Portfolio Visitors",
      "Friends & Family",
      "Public Audience",
      "Specific Community",
      "Other",
    ],
    multiSelect: true,
    allowCustom: true,
  },
  {
    id: 8,
    question: "What purpose does this bot serve?",
    field: "problem",
    placeholder: "What does this bot help with?",
    type: "chips" as const,
    options: [
      "Showcase Work",
      "Answer Questions",
      "Provide Information",
      "Entertainment",
      "Learning & Education",
      "Creative Expression",
      "Personal Branding",
      "Other",
    ],
    multiSelect: true,
    allowCustom: true,
  },
  {
    id: 9,
    question: "What tone should your bot have?",
    field: "brand_voice",
    placeholder: "Select a voice style",
    type: "select" as const,
    options: [
      "formal",
      "friendly",
      "professional",
      "casual",
      "humorous",
      "creative",
    ],
  },
];

interface OnboardingData {
  bot_type: string;
  business_name: string;
  business_type: string;
  business_description: string | string[];
  product_name: string;
  product_description: string;
  target_audience: string | string[];
  problem: string | string[];
  brand_voice: string;
}

interface StepConfig {
  id: number;
  question: string;
  field: string;
  placeholder: string;
  type: "text" | "textarea" | "chips" | "select";
  options?: string[];
  multiSelect?: boolean;
  allowCustom?: boolean;
  allowCustomTextarea?: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const botId = params.slug as string;

  const [isInitializing, setIsInitializing] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OnboardingData>({
    bot_type: "",
    business_name: "",
    business_type: "",
    business_description: [],
    product_name: "",
    product_description: "",
    target_audience: [],
    problem: [],
    brand_voice: "",
  });
  const [rawInputValues, setRawInputValues] = useState<Record<string, string>>({
    business_description: "",
    target_audience: "",
    problem: "",
  });

  const isPersonalProject = formData.bot_type === "Personal Project";
  const activeSteps: StepConfig[] =
    isPersonalProject && formData.bot_type
      ? [steps[0], ...personalProjectSteps]
      : steps;

  const currentStepData = activeSteps[currentStep - 1];
  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Get options for current step (dynamic for business_description)
  const getCurrentOptions = (): string[] => {
    if (
      currentStepData.field === "business_description" &&
      !isPersonalProject &&
      formData.business_type
    ) {
      return getBusinessDescriptionSuggestions(formData.business_type);
    }
    return currentStepData.options || [];
  };

  // Check if current step is a multi-select field
  const isMultiSelect = (): boolean => {
    return currentStepData.multiSelect === true;
  };

  const handleInputChange = (value: string, field: keyof OnboardingData) => {
    if (generationError) {
      setGenerationError(null);
    }
    setFormData((prev) => {
      if (field === "bot_type" && prev.bot_type !== value) {
        return {
          bot_type: value,
          business_name: "",
          business_type: "",
          business_description: [],
          product_name: "",
          product_description: "",
          target_audience: [],
          problem: [],
          brand_voice: "",
        };
      }

      const multiSelectFields: (keyof OnboardingData)[] = [
        "business_description",
        "target_audience",
        "problem",
      ];

      if (multiSelectFields.includes(field) && currentStepData.multiSelect) {
        const currentValue = prev[field];
        const currentArray = Array.isArray(currentValue)
          ? currentValue
          : currentValue
          ? [currentValue]
          : [];

        const newArray = currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value];

        return { ...prev, [field]: newArray };
      } else {
        return { ...prev, [field]: value };
      }
    });

    if (field === "bot_type") {
      setCurrentStep(2);
    }
  };

  // Check if current step has valid input
  const isCurrentStepValid = (): boolean => {
    const currentField = currentStepData.field as keyof OnboardingData;
    const currentValue = formData[currentField];

    return typeof currentValue === "string"
      ? !!currentValue?.trim()
      : Array.isArray(currentValue) && currentValue.length > 0;
  };

  const handleNext = () => {
    if (isTransitioning) return;

    const currentField = currentStepData.field as keyof OnboardingData;
    const currentValue = formData[currentField];

    const isEmpty =
      typeof currentValue === "string"
        ? !currentValue?.trim()
        : !Array.isArray(currentValue) || currentValue.length === 0;

    if (isEmpty) {
      toast.error("Please answer this question before continuing");
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setIsTransitioning(true);
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => setIsTransitioning(false), 350);
    }
  };

  const handleBack = () => {
    if (isTransitioning) return;

    if (currentStep > 1) {
      setIsTransitioning(true);
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => setIsTransitioning(false), 350);
    }
  };

  const handleGenerate = async () => {
    const currentField = currentStepData.field as keyof OnboardingData;
    const currentValue = formData[currentField];

    const isEmpty =
      typeof currentValue === "string"
        ? !currentValue?.trim()
        : !Array.isArray(currentValue) || currentValue.length === 0;

    if (isEmpty) {
      toast.error("Please answer this question before continuing");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const businessDescriptionStr = Array.isArray(
        formData.business_description
      )
        ? formData.business_description.join(", ")
        : formData.business_description;
      const targetAudienceStr = Array.isArray(formData.target_audience)
        ? formData.target_audience.join(", ")
        : formData.target_audience;
      const problemStr = Array.isArray(formData.problem)
        ? formData.problem.join(", ")
        : formData.problem;

      const gibberishError = validateBusinessDataForGibberish({
        business_name: formData.business_name,
        business_type: formData.business_type,
        business_description: businessDescriptionStr,
        product_name: formData.product_name,
        product_description: formData.product_description,
        target_audience: targetAudienceStr,
        problem: problemStr,
        brand_voice: formData.brand_voice,
      });

      if (gibberishError) {
        const message =
          gibberishError ||
          "The information you provided appears to be unclear. Please provide clear, meaningful information.";
        setGenerationError(message);
        toast.error(message);
        setIsGenerating(false);
        return;
      }

      const apiData = {
        botId,
        ...formData,
        business_description: businessDescriptionStr,
        target_audience: targetAudienceStr,
        problem: problemStr,
      };

      const response = await fetch("/api/generate-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Failed to generate config" }));

        if (error.error === "NO_UNDERSTANDING") {
          const message =
            error.message ||
            "The AI could not understand your business information. Please provide more detailed and clear information.";
          setGenerationError(message);
          toast.error(message);
          setIsGenerating(false);
          return;
        }

        throw new Error(
          error.error || "Failed to generate chatbot configuration"
        );
      }

      const data = await response.json();

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `generated_bot_data_${botId}`,
          JSON.stringify(data)
        );
      }

      await saveBotGeneratedData(botId, data);

      toast.success("Chatbot generated and saved successfully!");
      router.push(`/bots/${botId}/configure`);
    } catch (error) {
      console.error("Generation error:", error);
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate chatbot. Please try again.";
      setGenerationError(fallbackMessage);
      toast.error(fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBotGeneratedData = async (
    botId: string,
    data: {
      bot_configs: unknown;
      bot_settings: unknown;
      bot_runtime_settings: unknown;
      bot_ui_settings?: unknown;
    }
  ) => {
    const response = await fetch("/api/save-generated-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId, ...data }),
    });

    if (!response.ok) {
      throw new Error("Failed to save generated configuration");
    }

    return response.json();
  };

  const handleCommaSeparatedInput = (
    rawValue: string,
    field: keyof OnboardingData
  ) => {
    if (generationError) {
      setGenerationError(null);
    }
    setRawInputValues((prev) => ({ ...prev, [field]: rawValue }));

    const parts = rawValue.split(",");
    const processedValues: string[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i < parts.length - 1) {
        const trimmed = part.trim();
        if (trimmed.length > 0) processedValues.push(trimmed);
      } else {
        if (part.trim().length > 0) processedValues.push(part);
      }
    }

    setFormData((prev) => ({ ...prev, [field]: processedValues }));
  };

  const handleInputBlur = (field: keyof OnboardingData) => {
    const rawValue = rawInputValues[field] || "";
    const values = rawValue
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    setFormData((prev) => ({ ...prev, [field]: values }));
    setRawInputValues((prev) => ({ ...prev, [field]: values.join(", ") }));
    if (generationError) {
      setGenerationError(null);
    }
  };

  const getDisplayValue = (field: keyof OnboardingData): string => {
    const raw = rawInputValues[field as keyof typeof rawInputValues];
    if (raw !== undefined && raw !== "") return raw;

    const value = formData[field];
    if (Array.isArray(value)) return value.join(", ");
    return (value as string) || "";
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-6 text-primary" />
          <p className="text-sm text-muted-foreground">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  const renderChipsInput = () => {
    const options = getCurrentOptions();
    const field = currentStepData.field as keyof OnboardingData;
    const currentValue = formData[field];
    const multi = isMultiSelect();

    return (
      <div className="space-y-4">
        {/* Chip options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((option) => {
            const isSelected = multi
              ? Array.isArray(currentValue) && currentValue.includes(option)
              : currentValue === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleInputChange(option, field)}
                className={`px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border hover:border-primary/50 bg-background hover:bg-muted"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Selected count for multi-select */}
        {multi && Array.isArray(currentValue) && currentValue.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {currentValue.length} item{currentValue.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}

        {/* Custom input for multi-select with textarea */}
        {currentStepData.allowCustomTextarea && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Or write your own (comma-separated):
            </p>
            <Textarea
              placeholder={currentStepData.placeholder}
              value={getDisplayValue(field)}
              onChange={(e) => handleCommaSeparatedInput(e.target.value, field)}
              onBlur={() => handleInputBlur(field)}
              className="min-h-[120px] resize-none text-base"
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Spacebar") e.stopPropagation();
              }}
            />
          </div>
        )}

        {/* Custom input for single or multi-select with text input */}
        {currentStepData.allowCustom &&
          !currentStepData.allowCustomTextarea && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                {multi
                  ? "Or enter your own (comma-separated):"
                  : "Or enter your own:"}
              </p>
              {multi ? (
                <Input
                  type="text"
                  placeholder={currentStepData.placeholder}
                  value={getDisplayValue(field)}
                  onChange={(e) =>
                    handleCommaSeparatedInput(e.target.value, field)
                  }
                  onBlur={() => handleInputBlur(field)}
                  className="h-10 text-base"
                />
              ) : (
                <Input
                  type="text"
                  placeholder={currentStepData.placeholder}
                  value={(currentValue as string) || ""}
                  onChange={(e) => handleInputChange(e.target.value, field)}
                  className="h-10 text-base"
                />
              )}
            </div>
          )}
      </div>
    );
  };

  const renderSelectInput = () => {
    const field = currentStepData.field as keyof OnboardingData;

    return (
      <div className="space-y-2">
        {currentStepData.options?.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleInputChange(option, field)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
              formData[field] === option
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50 bg-background"
            }`}
          >
            <span className="capitalize font-medium">{option}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderTextareaInput = () => {
    const field = currentStepData.field as keyof OnboardingData;

    return (
      <Textarea
        placeholder={currentStepData.placeholder}
        value={(formData[field] as string) || ""}
        onChange={(e) => handleInputChange(e.target.value, field)}
        className="min-h-[120px] resize-none text-base"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Spacebar") e.stopPropagation();
        }}
      />
    );
  };

  const renderTextInput = () => {
    const field = currentStepData.field as keyof OnboardingData;

    return (
      <Input
        type="text"
        placeholder={currentStepData.placeholder}
        value={(formData[field] as string) || ""}
        onChange={(e) => handleInputChange(e.target.value, field)}
        className="h-12 text-base"
        autoFocus
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            currentStep < TOTAL_STEPS &&
            !isTransitioning
          ) {
            e.preventDefault();
            handleNext();
          }
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="w-full px-8 pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-4xl w-full">
          {generationError && (
            <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">
                    We couldn&apos;t generate your chatbot
                  </p>
                  <p className="text-sm text-destructive/80">
                    {generationError}
                  </p>
                </div>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Question Side */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <span className="font-medium">Question {currentStep}</span>
                  <span className="text-muted-foreground/50">/</span>
                  <span>{TOTAL_STEPS}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {currentStepData.question}
                </h2>
                {currentStep < TOTAL_STEPS && (
                  <p className="text-muted-foreground text-sm">
                    Answer this question to continue to the next step
                  </p>
                )}
              </div>

              {/* Input Side */}
              <div className="space-y-6">
                {currentStepData.type === "chips" && renderChipsInput()}
                {currentStepData.type === "select" && renderSelectInput()}
                {currentStepData.type === "textarea" && renderTextareaInput()}
                {currentStepData.type === "text" && renderTextInput()}

                {/* Validation Message */}
                {!isCurrentStepValid() && (
                  <p className="text-sm text-orange-500 flex items-center gap-2">
                    <span>
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <span>
                      Make sure to select an option or provide an answer before
                      continuing
                    </span>
                  </p>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isGenerating || isTransitioning}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        isGenerating || isTransitioning || !isCurrentStepValid()
                      }
                      className="flex-1"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Spinner className="w-4 h-4 mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate My Chatbot
                        </>
                      )}
                      `{" "}
                    </Button>
                  )}
                  `{" "}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
