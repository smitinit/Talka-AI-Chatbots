// "use client";

// import { useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Building2,
//   Package,
//   FileText,
//   ShoppingCart,
//   Phone,
//   User,
//   Shield,
//   Globe,
//   Search,
//   Lightbulb,
//   AlertTriangle,
//   Plus,
//   Trash2,
//   Edit,
//   Sparkles,
//   Save,
//   Download,
//   Copy,
// } from "lucide-react";

// // Zod schema for form validation
// const botConfigSchema = z.object({
//   businessName: z.string().min(2, "Business name is required"),
//   businessType: z.string().min(1, "Business type is required"),
//   productName: z.string().min(2, "Product name is required"),
//   description: z.string().min(50, "Description must be at least 50 characters"),
//   websiteUrl: z
//     .string()
//     .url("Please enter a valid URL")
//     .optional()
//     .or(z.literal("")),
//   supportContact: z
//     .string()
//     .email("Please enter a valid email")
//     .optional()
//     .or(z.literal("")),
//   brandTone: z.enum([
//     "professional",
//     "friendly",
//     "casual",
//     "formal",
//     "enthusiastic",
//   ]),
//   targetAudience: z.string().optional(),
//   keyFeatures: z.array(z.string()).default([]),
//   customQuestions: z
//     .array(
//       z.object({
//         id: z.string(),
//         category: z.string(),
//         question: z.string(),
//         answer: z.string(),
//         intent: z.string(),
//       })
//     )
//     .default([]),
// });

// type BotConfigForm = z.infer<typeof botConfigSchema>;

// // Predefined question categories with examples
// const questionCategories = [
//   {
//     id: "business",
//     title: "About the Business / Website",
//     icon: <Building2 className="h-4 w-4" />,
//     questions: [
//       "What is this website about?",
//       "What do you guys do?",
//       "Who is behind this website?",
//       "How long have you been around?",
//       "Where are you located?",
//       "Do you have a physical office or store?",
//     ],
//   },
//   {
//     id: "products",
//     title: "Products / Services",
//     icon: <Package className="h-4 w-4" />,
//     questions: [
//       "What products/services do you offer?",
//       "Can I see a list of your services?",
//       "How much does this cost?",
//       "How do I get started?",
//       "Do you offer a free trial/sample?",
//       "What's included in each package/plan?",
//       "Do you have any discounts or offers?",
//     ],
//   },
//   {
//     id: "content",
//     title: "Content-Specific",
//     icon: <FileText className="h-4 w-4" />,
//     questions: [
//       "Where can I find your latest blog post?",
//       "Can you recommend something to read/watch?",
//       "Do you cover topic X?",
//       "Can I subscribe to your newsletter?",
//     ],
//   },
//   {
//     id: "shopping",
//     title: "Shopping / E-Commerce",
//     icon: <ShoppingCart className="h-4 w-4" />,
//     questions: [
//       "How do I place an order?",
//       "What is your return policy?",
//       "Do you ship internationally?",
//       "How long does delivery take?",
//       "Can I track my order?",
//       "Is my payment information secure?",
//     ],
//   },
//   {
//     id: "support",
//     title: "Support / Contact",
//     icon: <Phone className="h-4 w-4" />,
//     questions: [
//       "How can I get in touch?",
//       "Is there a phone number I can call?",
//       "Do you offer live chat?",
//       "How long does it take to get a response?",
//       "Where's your contact page?",
//     ],
//   },
//   {
//     id: "account",
//     title: "Account & User Questions",
//     icon: <User className="h-4 w-4" />,
//     questions: [
//       "How do I sign up?",
//       "I forgot my password — what should I do?",
//       "How can I change my account details?",
//       "How do I delete my account?",
//     ],
//   },
//   {
//     id: "policies",
//     title: "Policies & Legal",
//     icon: <Shield className="h-4 w-4" />,
//     questions: [
//       "What is your privacy policy?",
//       "Do you use cookies?",
//       "Is my data safe?",
//       "What are your terms of service?",
//     ],
//   },
//   {
//     id: "language",
//     title: "Language / Region",
//     icon: <Globe className="h-4 w-4" />,
//     questions: [
//       "Can I view this site in another language?",
//       "Do you support other currencies?",
//       "Is this service available in my country?",
//     ],
//   },
//   {
//     id: "navigation",
//     title: "Search & Navigation",
//     icon: <Search className="h-4 w-4" />,
//     questions: [
//       "Where can I find X page?",
//       "Do you have a sitemap?",
//       "How do I get back to the homepage?",
//       "Where's the login button?",
//     ],
//   },
//   {
//     id: "recommendations",
//     title: "Suggestions / Recommendations",
//     icon: <Lightbulb className="h-4 w-4" />,
//     questions: [
//       "What do you recommend I do first?",
//       "What's popular on your site?",
//       "Show me your top products/services/posts.",
//     ],
//   },
//   {
//     id: "issues",
//     title: "Error / Issue Reporting",
//     icon: <AlertTriangle className="h-4 w-4" />,
//     questions: [
//       "This page isn't loading — what should I do?",
//       "I found a broken link — can you fix it?",
//       "The site looks weird on my phone.",
//     ],
//   },
// ];

// const businessTypes = [
//   "E-commerce",
//   "SaaS",
//   "Healthcare",
//   "Education",
//   "Finance",
//   "Real Estate",
//   "Food & Beverage",
//   "Health & Fitness",
//   "Technology",
//   "Consulting",
//   "Marketing",
//   "Entertainment",
//   "Travel",
//   "Fashion",
//   "Other",
// ];

// const brandTones = [
//   { value: "professional", label: "Professional" },
//   { value: "friendly", label: "Friendly" },
//   { value: "casual", label: "Casual" },
//   { value: "formal", label: "Formal" },
//   { value: "enthusiastic", label: "Enthusiastic" },
// ];

// // Question Answer Dialog Component
// function QuestionAnswerDialog({
//   question,
//   category,
//   onSave,
//   existingAnswer = "",
//   isOpen,
//   onClose,
// }: {
//   question: string;
//   category: string;
//   onSave: (answer: string, intent: string) => void;
//   existingAnswer?: string;
//   isOpen: boolean;
//   onClose: () => void;
// }) {
//   const [answer, setAnswer] = useState(existingAnswer);
//   const [intent, setIntent] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   const generateWithAI = async () => {
//     setIsGenerating(true);
//     // Simulate AI generation - replace with actual AI call
//     setTimeout(() => {
//       const sampleAnswers = {
//         business: `We are a ${category} company focused on providing excellent service to our customers. We've been in business for several years and are committed to quality and customer satisfaction.`,
//         products: `Our products/services are designed to meet your specific needs. We offer competitive pricing and various packages to suit different requirements.`,
//         support: `You can reach our support team through multiple channels. We're here to help and typically respond within 24 hours.`,
//       };

//       const generatedAnswer =
//         sampleAnswers[category as keyof typeof sampleAnswers] ||
//         `This is a generated answer for the question: "${question}". Please customize this response to match your business needs.`;

//       setAnswer(generatedAnswer);
//       setIsGenerating(false);
//     }, 2000);
//   };

//   const handleSave = () => {
//     if (answer.trim()) {
//       const generatedIntent =
//         intent ||
//         question
//           .toLowerCase()
//           .replace(/[^a-z0-9]/g, "_")
//           .replace(/_+/g, "_");
//       onSave(answer, generatedIntent);
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Edit className="h-5 w-5" />
//             Answer Question
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="p-4 bg-muted/50 rounded-lg">
//             <p className="font-medium text-sm text-muted-foreground mb-1">
//               Question:
//             </p>
//             <p className="text-sm">{question}</p>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">
//               Intent Name (optional)
//             </label>
//             <Input
//               placeholder="e.g., product_info, contact_support"
//               value={intent}
//               onChange={(e) => setIntent(e.target.value)}
//             />
//             <p className="text-xs text-muted-foreground">
//               Leave empty to auto-generate from question
//             </p>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <label className="text-sm font-medium">Answer</label>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={generateWithAI}
//                 disabled={isGenerating}
//                 className="gap-2 bg-transparent"
//               >
//                 {isGenerating ? (
//                   <>
//                     <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-3 w-3" />
//                     Generate with AI
//                   </>
//                 )}
//               </Button>
//             </div>
//             <Textarea
//               placeholder="Enter your answer here..."
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               className="min-h-[120px] resize-none"
//             />
//           </div>

//           <div className="flex gap-2 justify-end pt-4">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={!answer.trim()}>
//               Save Answer
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default function BotConfigurationWizard() {
//   const [selectedQuestion, setSelectedQuestion] = useState<{
//     question: string;
//     category: string;
//     answer?: string;
//   } | null>(null);
//   const [customQuestion, setCustomQuestion] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("business");
//   const [generatedConfig, setGeneratedConfig] = useState<any>(null);

//   const form = useForm<BotConfigForm>({
//     resolver: zodResolver(botConfigSchema),
//     defaultValues: {
//       businessName: "",
//       businessType: "",
//       productName: "",
//       description: "",
//       websiteUrl: "",
//       supportContact: "",
//       brandTone: "friendly",
//       targetAudience: "",
//       keyFeatures: [],
//       customQuestions: [],
//     },
//   });

//   const {
//     fields: questionFields,
//     append: appendQuestion,
//     remove: removeQuestion,
//   } = useFieldArray({
//     control: form.control,
//     name: "customQuestions",
//   });

//   const {
//     fields: featureFields,
//     append: appendFeature,
//     remove: removeFeature,
//   } = useFieldArray({
//     control: form.control,
//     name: "keyFeatures",
//   });

//   const addPredefinedQuestion = (question: string, category: string) => {
//     setSelectedQuestion({ question, category });
//   };

//   const addCustomQuestion = () => {
//     if (customQuestion.trim()) {
//       setSelectedQuestion({
//         question: customQuestion,
//         category: selectedCategory,
//       });
//       setCustomQuestion("");
//     }
//   };

//   const saveQuestionAnswer = (answer: string, intent: string) => {
//     if (selectedQuestion) {
//       const newQuestion = {
//         id: Date.now().toString(),
//         category: selectedQuestion.category,
//         question: selectedQuestion.question,
//         answer,
//         intent,
//       };
//       appendQuestion(newQuestion);
//     }
//   };

//   const generateBotConfig = (data: BotConfigForm) => {
//     const botId = `bot_${Date.now()}`;

//     // Generate intents from questions
//     const intents = data.customQuestions.map((q) => ({
//       intent: q.intent,
//       examples: [q.question],
//       answer: q.answer,
//     }));

//     // Generate business config
//     const businessConfig = {
//       bot_id: botId,
//       business_name: data.businessName,
//       business_type: data.businessType,
//       product_name: data.productName,
//       short_description: data.description,
//       key_features: data.keyFeatures,
//       target_audience: data.targetAudience || "",
//       brand_tone: data.brandTone,
//       website_url: data.websiteUrl || "",
//       support_contact: data.supportContact || "",
//       common_questions: data.customQuestions.map((q) => q.question),
//       intents,
//     };

//     setGeneratedConfig(businessConfig);
//   };

//   const copyToClipboard = () => {
//     if (generatedConfig) {
//       navigator.clipboard.writeText(JSON.stringify(generatedConfig, null, 2));
//     }
//   };

//   const downloadConfig = () => {
//     if (generatedConfig) {
//       const blob = new Blob([JSON.stringify(generatedConfig, null, 2)], {
//         type: "application/json",
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${generatedConfig.business_name
//         .toLowerCase()
//         .replace(/\s+/g, "-")}-bot-config.json`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-8">
//       <div className="text-center space-y-2">
//         <h1 className="text-3xl font-bold">Bot Configuration Wizard</h1>
//         <p className="text-muted-foreground text-lg">
//           Configure your AI bot with business information and common questions
//         </p>
//       </div>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(generateBotConfig)}
//           className="space-y-8"
//         >
//           {/* Business Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Building2 className="h-5 w-5" />
//                 Business Information
//               </CardTitle>
//               <CardDescription>
//                 Tell us about your business and what you offer
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="businessName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Business Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g., FitFuel" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="businessType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Business Type</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select business type" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {businessTypes.map((type) => (
//                               <SelectItem key={type} value={type}>
//                                 {type}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="productName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Product/Service Name</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="e.g., Subscription Box"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Business & Product Description</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Describe your business, products, and services in detail..."
//                         className="min-h-[120px] resize-none"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Provide a comprehensive description of what your business
//                       does and what you offer
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="websiteUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Website URL (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="https://example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="supportContact"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Support Email (Optional)</FormLabel>
//                       <FormControl>
//                         <Input placeholder="support@example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="brandTone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Brand Tone</FormLabel>
//                       <FormControl>
//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select brand tone" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {brandTones.map((tone) => (
//                               <SelectItem key={tone.value} value={tone.value}>
//                                 {tone.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="targetAudience"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Target Audience (Optional)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="e.g., Fitness enthusiasts aged 20-40"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Key Features */}
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <FormLabel>Key Features</FormLabel>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => appendFeature("")}
//                     className="gap-2"
//                   >
//                     <Plus className="h-3 w-3" />
//                     Add Feature
//                   </Button>
//                 </div>
//                 <div className="space-y-2">
//                   {featureFields.map((field, index) => (
//                     <div key={field.id} className="flex gap-2">
//                       <FormField
//                         control={form.control}
//                         name={`keyFeatures.${index}`}
//                         render={({ field }) => (
//                           <FormItem className="flex-1">
//                             <FormControl>
//                               <Input
//                                 placeholder="Enter a key feature"
//                                 {...field}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="icon"
//                         onClick={() => removeFeature(index)}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Questions Configuration */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <FileText className="h-5 w-5" />
//                 Questions & Answers
//               </CardTitle>
//               <CardDescription>
//                 Configure common questions your customers might ask
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs defaultValue="predefined" className="space-y-6">
//                 <TabsList className="grid w-full grid-cols-2">
//                   <TabsTrigger value="predefined">
//                     Predefined Questions
//                   </TabsTrigger>
//                   <TabsTrigger value="custom">Custom Questions</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="predefined" className="space-y-6">
//                   <div className="grid gap-4">
//                     {questionCategories.map((category) => (
//                       <Card key={category.id}>
//                         <CardHeader className="pb-3">
//                           <CardTitle className="flex items-center gap-2 text-base">
//                             {category.icon}
//                             {category.title}
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid gap-2">
//                             {category.questions.map((question, index) => (
//                               <Button
//                                 key={index}
//                                 type="button"
//                                 variant="outline"
//                                 className="justify-start h-auto p-3 text-left bg-transparent"
//                                 onClick={() =>
//                                   addPredefinedQuestion(question, category.id)
//                                 }
//                               >
//                                 <div className="flex items-center gap-2 w-full">
//                                   <Plus className="h-3 w-3 shrink-0" />
//                                   <span className="flex-1">{question}</span>
//                                 </div>
//                               </Button>
//                             ))}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="custom" className="space-y-6">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-base">
//                         Add Custom Question
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="flex gap-2">
//                         <Select
//                           value={selectedCategory}
//                           onValueChange={setSelectedCategory}
//                         >
//                           <SelectTrigger className="w-48">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {questionCategories.map((category) => (
//                               <SelectItem key={category.id} value={category.id}>
//                                 {category.title}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <Input
//                           placeholder="Enter your custom question..."
//                           value={customQuestion}
//                           onChange={(e) => setCustomQuestion(e.target.value)}
//                           className="flex-1"
//                         />
//                         <Button
//                           type="button"
//                           onClick={addCustomQuestion}
//                           disabled={!customQuestion.trim()}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </Tabs>

//               {/* Added Questions */}
//               {questionFields.length > 0 && (
//                 <div className="space-y-4">
//                   <Separator />
//                   <div>
//                     <h3 className="font-medium mb-4">
//                       Configured Questions ({questionFields.length})
//                     </h3>
//                     <div className="space-y-2">
//                       {questionFields.map((field, index) => (
//                         <div
//                           key={field.id}
//                           className="flex items-center gap-2 p-3 border rounded-lg"
//                         >
//                           <div className="flex-1">
//                             <p className="text-sm font-medium">
//                               {field.question}
//                             </p>
//                             <div className="flex items-center gap-2 mt-1">
//                               <Badge variant="secondary" className="text-xs">
//                                 {
//                                   questionCategories.find(
//                                     (c) => c.id === field.category
//                                   )?.title
//                                 }
//                               </Badge>
//                               <span className="text-xs text-muted-foreground">
//                                 Intent: {field.intent}
//                               </span>
//                             </div>
//                           </div>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               setSelectedQuestion({
//                                 question: field.question,
//                                 category: field.category,
//                                 answer: field.answer,
//                               })
//                             }
//                           >
//                             <Edit className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => removeQuestion(index)}
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Generate Configuration */}
//           <div className="flex gap-4 justify-end">
//             <Button type="submit" size="lg" className="gap-2">
//               <Save className="h-4 w-4" />
//               Generate Bot Configuration
//             </Button>
//           </div>
//         </form>
//       </Form>

//       {/* Generated Configuration Display */}
//       {generatedConfig && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               Generated Configuration
//             </CardTitle>
//             <CardDescription>
//               Your bot configuration in JSON format
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 onClick={copyToClipboard}
//                 className="gap-2 bg-transparent"
//               >
//                 <Copy className="h-3 w-3" />
//                 Copy to Clipboard
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={downloadConfig}
//                 className="gap-2 bg-transparent"
//               >
//                 <Download className="h-3 w-3" />
//                 Download JSON
//               </Button>
//             </div>
//             <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
//               {JSON.stringify(generatedConfig, null, 2)}
//             </pre>
//           </CardContent>
//         </Card>
//       )}

//       {/* Question Answer Dialog */}
//       {selectedQuestion && (
//         <QuestionAnswerDialog
//           question={selectedQuestion.question}
//           category={selectedQuestion.category}
//           existingAnswer={selectedQuestion.answer}
//           onSave={saveQuestionAnswer}
//           isOpen={!!selectedQuestion}
//           onClose={() => setSelectedQuestion(null)}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Building2,
  Package,
  FileText,
  Phone,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Save,
  Download,
  Copy,
  Settings,
  Bot,
  Zap,
} from "lucide-react";

// Comprehensive Zod schema combining all three forms
const unifiedBotSchema = z.object({
  // Business Information (from wizard)
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  productName: z.string().min(2, "Product name is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  supportContact: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  brandTone: z.enum([
    "professional",
    "friendly",
    "casual",
    "formal",
    "enthusiastic",
  ]),
  targetAudience: z.string().optional(),
  keyFeatures: z.array(z.string()).default([]),

  // Bot Configuration (from config form)
  defaultLanguage: z.enum(["en", "hi", "fr", "de", "es", "zh"]).default("en"),
  languagePreference: z
    .enum(["en", "hi", "fr", "de", "es", "zh"])
    .default("en"),
  persona: z.string().min(10, "Persona is required"),
  botthesis: z.string().min(10, "Bot thesis is required"),
  backstory: z.string().optional(),
  goals: z.string().optional(),
  personaTags: z.array(z.string()).default([]),
  doDont: z.string().optional(),
  preferredExamples: z.string().optional(),
  toneStyle: z
    .enum(["formal", "friendly", "professional", "casual", "humorous"])
    .optional(),
  writingStyle: z
    .enum(["concise", "elaborate", "technical", "narrative"])
    .optional(),
  responseStyle: z
    .enum(["direct", "indirect", "balanced", "inquisitive"])
    .optional(),
  outputFormat: z.string().optional(),
  useEmojis: z.boolean().default(false),
  includeCitations: z.boolean().default(true),
  expertise: z.enum(["finance", "health", "technology", "education", "custom"]),
  customexpertise: z.string().optional(),

  // Runtime Settings (from runtime form)
  greeting: z.string().min(5, "Greeting is required"),
  fallback: z.string().min(5, "Fallback message is required"),
  status: z.enum(["active", "archived", "deleted"]).default("active"),
  billingPlan: z.enum(["free", "pro", "enterprise"]).default("free"),
  memoryType: z
    .enum(["per-user", "global", "session-only"])
    .default("per-user"),
  memoryExpiration: z
    .enum(["session", "24h", "7d", "30d", "perm"])
    .default("session"),
  avatar: z.string().url().optional().or(z.literal("")),
  voice: z.string().optional(),
  gender: z.enum(["male", "female", "neutral"]).default("neutral"),
  voiceMode: z.boolean().default(false),
  webhookUrl: z.string().url().optional().or(z.literal("")),
  siteUrl: z.string().url().optional().or(z.literal("")),
  rateLimitPerMin: z.number().min(1).max(1000).optional(),
  loggingEnabled: z.boolean().default(true),
  useWebSearch: z.boolean().default(true),

  // AI Model Settings (from settings form)
  maxTokens: z.number().min(100).max(4000).default(2048),
  topP: z.number().min(0).max(1).default(0.9),
  temperature: z.number().min(0).max(2).default(0.7),
  stopSequences: z.string().optional(),
  focusDomains: z.string().optional(),
  jsonMode: z.boolean().default(false),

  // Questions (from wizard)
  customQuestions: z
    .array(
      z.object({
        id: z.string(),
        category: z.string(),
        question: z.string(),
        answer: z.string(),
        intent: z.string(),
      })
    )
    .default([]),
});

type UnifiedBotForm = z.infer<typeof unifiedBotSchema>;

// Predefined question categories (same as before)
const questionCategories = [
  {
    id: "business",
    title: "About the Business / Website",
    icon: <Building2 className="h-4 w-4" />,
    questions: [
      "What is this website about?",
      "What do you guys do?",
      "Who is behind this website?",
      "How long have you been around?",
      "Where are you located?",
      "Do you have a physical office or store?",
    ],
  },
  {
    id: "products",
    title: "Products / Services",
    icon: <Package className="h-4 w-4" />,
    questions: [
      "What products/services do you offer?",
      "Can I see a list of your services?",
      "How much does this cost?",
      "How do I get started?",
      "Do you offer a free trial/sample?",
      "What's included in each package/plan?",
      "Do you have any discounts or offers?",
    ],
  },
  {
    id: "support",
    title: "Support / Contact",
    icon: <Phone className="h-4 w-4" />,
    questions: [
      "How can I get in touch?",
      "Is there a phone number I can call?",
      "Do you offer live chat?",
      "How long does it take to get a response?",
      "Where's your contact page?",
    ],
  },
  // Add more categories as needed...
];

const businessTypes = [
  "E-commerce",
  "SaaS",
  "Healthcare",
  "Education",
  "Finance",
  "Real Estate",
  "Food & Beverage",
  "Health & Fitness",
  "Technology",
  "Consulting",
  "Marketing",
  "Entertainment",
  "Travel",
  "Fashion",
  "Other",
];

// Question Answer Dialog Component
function QuestionAnswerDialog({
  question,
  category,
  onSave,
  existingAnswer = "",
  isOpen,
  onClose,
}: {
  question: string;
  category: string;
  onSave: (answer: string, intent: string) => void;
  existingAnswer?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState(existingAnswer);
  const [intent, setIntent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const sampleAnswers = {
        business: `We are a ${category} company focused on providing excellent service to our customers. We've been in business for several years and are committed to quality and customer satisfaction.`,
        products: `Our products/services are designed to meet your specific needs. We offer competitive pricing and various packages to suit different requirements.`,
        support: `You can reach our support team through multiple channels. We're here to help and typically respond within 24 hours.`,
      };

      const generatedAnswer =
        sampleAnswers[category as keyof typeof sampleAnswers] ||
        `This is a generated answer for the question: "${question}". Please customize this response to match your business needs.`;

      setAnswer(generatedAnswer);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSave = () => {
    if (answer.trim()) {
      const generatedIntent =
        intent ||
        question
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .replace(/_+/g, "_");
      onSave(answer, generatedIntent);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Answer Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="font-medium text-sm text-muted-foreground mb-1">
              Question:
            </p>
            <p className="text-sm">{question}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Intent Name (optional)
            </label>
            <Input
              placeholder="e.g., product_info, contact_support"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate from question
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Answer</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateWithAI}
                disabled={isGenerating}
                className="gap-2 bg-transparent"
              >
                {isGenerating ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            <Textarea
              placeholder="Enter your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!answer.trim()}>
              Save Answer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UnifiedBotWizard() {
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: string;
    category: string;
    answer?: string;
  } | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("business");
  const [generatedConfig, setGeneratedConfig] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UnifiedBotForm>({
    resolver: zodResolver(unifiedBotSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      productName: "",
      description: "",
      websiteUrl: "",
      supportContact: "",
      brandTone: "friendly",
      targetAudience: "",
      keyFeatures: [],
      defaultLanguage: "en",
      languagePreference: "en",
      persona: "",
      botthesis: "",
      backstory: "",
      goals: "",
      personaTags: [],
      doDont: "",
      preferredExamples: "",
      useEmojis: false,
      includeCitations: true,
      expertise: "technology",
      customexpertise: "",
      greeting: "",
      fallback: "",
      status: "active",
      billingPlan: "free",
      memoryType: "per-user",
      memoryExpiration: "session",
      avatar: "",
      voice: "",
      gender: "neutral",
      voiceMode: false,
      webhookUrl: "",
      siteUrl: "",
      rateLimitPerMin: 60,
      loggingEnabled: true,
      useWebSearch: true,
      maxTokens: 2048,
      topP: 0.9,
      temperature: 0.7,
      stopSequences: "",
      focusDomains: "",
      jsonMode: false,
      customQuestions: [],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "customQuestions",
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control: form.control,
    name: "keyFeatures",
  });

  const watchExpertise = form.watch("expertise");
  const { isDirty, isSubmitting } = form.formState;

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const warnUser = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warnUser);
    return () => window.removeEventListener("beforeunload", warnUser);
  }, [form.formState.isDirty]);

  const addPredefinedQuestion = (question: string, category: string) => {
    setSelectedQuestion({ question, category });
  };

  const addCustomQuestion = () => {
    if (customQuestion.trim()) {
      setSelectedQuestion({
        question: customQuestion,
        category: selectedCategory,
      });
      setCustomQuestion("");
    }
  };

  const saveQuestionAnswer = (answer: string, intent: string) => {
    if (selectedQuestion) {
      const newQuestion = {
        id: Date.now().toString(),
        category: selectedQuestion.category,
        question: selectedQuestion.question,
        answer,
        intent,
      };
      appendQuestion(newQuestion);
    }
  };

  const onSubmit = (data: UnifiedBotForm) => {
    startTransition(async () => {
      try {
        // Generate bot configuration
        const botId = `bot_${Date.now()}`;

        const intents = data.customQuestions.map((q) => ({
          intent: q.intent,
          examples: [q.question],
          answer: q.answer,
        }));

        const completeConfig = {
          bot_id: botId,
          business_name: data.businessName,
          business_type: data.businessType,
          product_name: data.productName,
          short_description: data.description,
          key_features: data.keyFeatures,
          target_audience: data.targetAudience || "",
          brand_tone: data.brandTone,
          website_url: data.websiteUrl || "",
          support_contact: data.supportContact || "",
          common_questions: data.customQuestions.map((q) => q.question),

          // Bot Configuration
          default_language: data.defaultLanguage,
          language_preference: data.languagePreference,
          persona: data.persona,
          botthesis: data.botthesis,
          backstory: data.backstory,
          goals: data.goals,
          persona_tags: data.personaTags,
          do_dont: data.doDont,
          preferred_examples: data.preferredExamples,
          tone_style: data.toneStyle,
          writing_style: data.writingStyle,
          response_style: data.responseStyle,
          output_format: data.outputFormat,
          use_emojis: data.useEmojis,
          include_citations: data.includeCitations,
          expertise: data.expertise,
          customexpertise: data.customexpertise,

          // Runtime Settings
          greeting: data.greeting,
          fallback: data.fallback,
          status: data.status,
          billing_plan: data.billingPlan,
          memory_type: data.memoryType,
          memory_expiration: data.memoryExpiration,
          avatar: data.avatar,
          voice: data.voice,
          gender: data.gender,
          voice_mode: data.voiceMode,
          webhook_url: data.webhookUrl,
          site_url: data.siteUrl,
          rate_limit_per_min: data.rateLimitPerMin,
          logging_enabled: data.loggingEnabled,
          use_web_search: data.useWebSearch,

          // AI Model Settings
          max_tokens: data.maxTokens,
          top_p: data.topP,
          temperature: data.temperature,
          stop_sequences: data.stopSequences,
          focus_domains: data.focusDomains,
          json_mode: data.jsonMode,

          intents,
        };

        setGeneratedConfig(completeConfig);
        toast.success("Bot configuration generated successfully!");

        // Here you would typically save to your backend
        // await saveBotConfiguration(completeConfig)
      } catch (error) {
        toast.error("Failed to generate bot configuration");
        console.error(error);
      }
    });
  };

  const copyToClipboard = () => {
    if (generatedConfig) {
      navigator.clipboard.writeText(JSON.stringify(generatedConfig, null, 2));
      toast.success("Configuration copied to clipboard!");
    }
  };

  const downloadConfig = () => {
    if (generatedConfig) {
      const blob = new Blob([JSON.stringify(generatedConfig, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedConfig.business_name
        .toLowerCase()
        .replace(/\s+/g, "-")}-bot-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Complete Bot Configuration Wizard
        </h1>
        <p className="text-muted-foreground text-lg">
          Configure your AI bot with business information, personality, runtime
          settings, and AI parameters
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="business" className="gap-2">
                <Building2 className="h-4 w-4" />
                Business
              </TabsTrigger>
              <TabsTrigger value="personality" className="gap-2">
                <Bot className="h-4 w-4" />
                Personality
              </TabsTrigger>
              <TabsTrigger value="runtime" className="gap-2">
                <Settings className="h-4 w-4" />
                Runtime
              </TabsTrigger>
              <TabsTrigger value="ai-model" className="gap-2">
                <Zap className="h-4 w-4" />
                AI Model
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <FileText className="h-4 w-4" />
                Questions
              </TabsTrigger>
            </TabsList>

            {/* Business Information Tab */}
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your business and what you offer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., FitFuel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product/Service Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Subscription Box"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business & Product Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business, products, and services in detail..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive description of what your
                          business does and what you offer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supportContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="support@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brandTone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Tone</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand tone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="professional">
                                  Professional
                                </SelectItem>
                                <SelectItem value="friendly">
                                  Friendly
                                </SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="formal">Formal</SelectItem>
                                <SelectItem value="enthusiastic">
                                  Enthusiastic
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Fitness enthusiasts aged 20-40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Key Features */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>Key Features</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendFeature("")}
                        className="gap-2"
                      >
                        <Plus className="h-3 w-3" />
                        Add Feature
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {featureFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`keyFeatures.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Enter a key feature"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeFeature(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personality Tab */}
            <TabsContent value="personality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Bot Personality & Character
                  </CardTitle>
                  <CardDescription>
                    Define your bot's personality, communication style, and
                    expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">Hindi</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expertise Area</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select expertise" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="technology">
                                  Technology
                                </SelectItem>
                                <SelectItem value="education">
                                  Education
                                </SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {watchExpertise === "custom" && (
                    <FormField
                      control={form.control}
                      name="customexpertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Expertise</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe your custom expertise area"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="persona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Persona</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your bot's personality and character traits..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="botthesis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Mission & Thesis</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="What's your bot's purpose, goal, or philosophy?"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="backstory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backstory (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Bot's background story..."
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goals (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Bot's objectives and goals..."
                              className="min-h-[80px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="toneStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone Style</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="formal">Formal</SelectItem>
                                <SelectItem value="friendly">
                                  Friendly
                                </SelectItem>
                                <SelectItem value="professional">
                                  Professional
                                </SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="humorous">
                                  Humorous
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="writingStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Writing Style</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="concise">Concise</SelectItem>
                                <SelectItem value="elaborate">
                                  Elaborate
                                </SelectItem>
                                <SelectItem value="technical">
                                  Technical
                                </SelectItem>
                                <SelectItem value="narrative">
                                  Narrative
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responseStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Response Style</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="direct">Direct</SelectItem>
                                <SelectItem value="indirect">
                                  Indirect
                                </SelectItem>
                                <SelectItem value="balanced">
                                  Balanced
                                </SelectItem>
                                <SelectItem value="inquisitive">
                                  Inquisitive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="useEmojis"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                          <div className="space-y-1">
                            <FormLabel>Use Emojis</FormLabel>
                            <FormDescription>
                              Allow bot to use emojis in responses
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="includeCitations"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                          <div className="space-y-1">
                            <FormLabel>Include Citations</FormLabel>
                            <FormDescription>
                              Add source citations to responses
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Runtime Settings Tab */}
            <TabsContent value="runtime" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Runtime Settings
                  </CardTitle>
                  <CardDescription>
                    Configure operational settings and bot behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="greeting"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Greeting Message</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Welcome! How can I help you today?"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Initial message users see when starting a
                            conversation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bot Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                                <SelectItem value="deleted">Deleted</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="fallback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fallback Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="I'm sorry, I don't understand that. Could you please rephrase your question?"
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Message shown when the bot cannot answer a question
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="billingPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Plan</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select plan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="enterprise">
                                  Enterprise
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memoryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memory Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select memory type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="per-user">
                                  Per User
                                </SelectItem>
                                <SelectItem value="global">Global</SelectItem>
                                <SelectItem value="session-only">
                                  Session Only
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memoryExpiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memory Expiration</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="session">
                                  Session Only
                                </SelectItem>
                                <SelectItem value="24h">24 Hours</SelectItem>
                                <SelectItem value="7d">7 Days</SelectItem>
                                <SelectItem value="30d">30 Days</SelectItem>
                                <SelectItem value="perm">Permanent</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="useWebSearch"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                          <div className="space-y-1">
                            <FormLabel>Web Search</FormLabel>
                            <FormDescription>
                              Allow bot to search the web for information
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loggingEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                          <div className="space-y-1">
                            <FormLabel>Logging Enabled</FormLabel>
                            <FormDescription>
                              Store chat logs for analytics
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Model Settings Tab */}
            <TabsContent value="ai-model" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Model Configuration
                  </CardTitle>
                  <CardDescription>
                    Fine-tune AI model parameters and response generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxTokens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={100}
                              max={4000}
                              placeholder="2048"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum response length (100-4000)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topP"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Top P</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              max={1}
                              placeholder="0.9"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Nucleus sampling parameter (0-1)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              max={2}
                              placeholder="0.7"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Controls randomness (0-2)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="focusDomains"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Focus Domains</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Machine Learning, Web Development, Data Science"
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specify domains to focus the bot's responses on
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stopSequences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stop Sequences</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'END', 'STOP'"
                            className="min-h-[80px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Sequences that will stop the generation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jsonMode"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                        <div className="space-y-1">
                          <FormLabel>JSON Mode</FormLabel>
                          <FormDescription>
                            Force responses in JSON format
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Questions & Answers
                  </CardTitle>
                  <CardDescription>
                    Configure common questions your customers might ask
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="predefined" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="predefined">
                        Predefined Questions
                      </TabsTrigger>
                      <TabsTrigger value="custom">Custom Questions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="predefined" className="space-y-6">
                      <div className="grid gap-4">
                        {questionCategories.map((category) => (
                          <Card key={category.id}>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base">
                                {category.icon}
                                {category.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-2">
                                {category.questions.map((question, index) => (
                                  <Button
                                    key={index}
                                    type="button"
                                    variant="outline"
                                    className="justify-start h-auto p-3 text-left bg-transparent"
                                    onClick={() =>
                                      addPredefinedQuestion(
                                        question,
                                        category.id
                                      )
                                    }
                                  >
                                    <div className="flex items-center gap-2 w-full">
                                      <Plus className="h-3 w-3 shrink-0" />
                                      <span className="flex-1">{question}</span>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Add Custom Question
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex gap-2">
                            <Select
                              value={selectedCategory}
                              onValueChange={setSelectedCategory}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {questionCategories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Enter your custom question..."
                              value={customQuestion}
                              onChange={(e) =>
                                setCustomQuestion(e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={addCustomQuestion}
                              disabled={!customQuestion.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Added Questions */}
                  {questionFields.length > 0 && (
                    <div className="space-y-4">
                      <Separator />
                      <div>
                        <h3 className="font-medium mb-4">
                          Configured Questions ({questionFields.length})
                        </h3>
                        <div className="space-y-2">
                          {questionFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex items-center gap-2 p-3 border rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {field.question}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {
                                      questionCategories.find(
                                        (c) => c.id === field.category
                                      )?.title
                                    }
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Intent: {field.intent}
                                  </span>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedQuestion({
                                    question: field.question,
                                    category: field.category,
                                    answer: field.answer,
                                  })
                                }
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeQuestion(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end pt-6 border-t">
            <Button
              type="submit"
              size="lg"
              disabled={isPending || isSubmitting}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isPending || isSubmitting
                ? "Generating..."
                : "Generate Complete Bot Configuration"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Generated Configuration Display */}
      {generatedConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Complete Configuration
            </CardTitle>
            <CardDescription>
              Your comprehensive bot configuration in JSON format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="gap-2 bg-transparent"
              >
                <Copy className="h-3 w-3" />
                Copy to Clipboard
              </Button>
              <Button
                variant="outline"
                onClick={downloadConfig}
                className="gap-2 bg-transparent"
              >
                <Download className="h-3 w-3" />
                Download JSON
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify(generatedConfig, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Question Answer Dialog */}
      {selectedQuestion && (
        <QuestionAnswerDialog
          question={selectedQuestion.question}
          category={selectedQuestion.category}
          existingAnswer={selectedQuestion.answer}
          onSave={saveQuestionAnswer}
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
}
