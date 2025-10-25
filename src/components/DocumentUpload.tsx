"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, AlertCircle, CheckCircle, Brain, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadProps {
  onUploadComplete?: (document: any) => void;
  onDemoUpload?: () => void;
}

export function DocumentUpload({ onUploadComplete, onDemoUpload }: DocumentUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    country: "",
    expiryDate: "",
    documentNumber: ""
  });

  const analysisSteps = [
    "Scanning document...",
    "Extracting text data...",
    "Analyzing document type...",
    "Identifying expiry dates...",
    "Checking dependencies...",
    "Generating insights..."
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Auto-fill title from filename
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, "") // Remove extension
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsAnalyzing(false);
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!formData.title || !formData.type || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate AI analysis
      await simulateAIAnalysis();
      
      const document = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        type: formData.type,
        country: formData.country,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        expiryDate: formData.expiryDate,
        documentNumber: formData.documentNumber,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      };

      toast.success("Document uploaded and analyzed successfully!");
      onUploadComplete?.(document);
      
      // Reset form
      setUploadedFile(null);
      setFormData({
        title: "",
        description: "",
        type: "",
        country: "",
        expiryDate: "",
        documentNumber: ""
      });
      setIsOpen(false);
      
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  const handleDemoUpload = async () => {
    setIsUploading(true);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    try {
      // Simulate AI analysis for demo
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Create demo document that fixes the dependency issue
      const demoDocument = {
        id: Date.now().toString(),
        title: "US Passport - John Smith",
        description: "Renewed US Passport with extended validity",
        type: "passport",
        country: "USA",
        fileName: "passport_renewed_2024.pdf",
        fileSize: 2048576,
        expiryDate: "2030-03-15", // This fixes the dependency issue!
        documentNumber: "N9876543",
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      };

      toast.success("🎉 Demo document uploaded! This fixes your passport dependency issue!");
      onDemoUpload?.();
      
    } catch (error) {
      toast.error("Demo upload failed");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <>
      {/* Demo Upload Button */}
      <Button 
        onClick={handleDemoUpload}
        disabled={isUploading}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 shadow-lg"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {isAnalyzing ? analysisSteps[analysisStep] : "Uploading..."}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Demo: Upload New Passport (Valid 2026-2030)
          </>
        )}
      </Button>

      {/* Regular Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Document Upload
            </DialogTitle>
            <DialogDescription>
              Upload your important documents and let AI extract key information automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* AI Analysis Progress */}
            {isAnalyzing && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                      <span className="text-sm font-medium text-blue-900">
                        {analysisSteps[analysisStep]}
                      </span>
                    </div>
                    <Progress value={(analysisStep + 1) * (100 / analysisSteps.length)} className="h-2" />
                    <div className="text-xs text-blue-700">
                      AI is analyzing your document structure and extracting key data...
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Upload Area */}
            <div>
              <Label className="text-sm font-medium">Document File</Label>
              <div
                {...getRootProps()}
                className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : uploadedFile 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                {uploadedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                    <p className="text-sm font-medium text-green-700">{uploadedFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm font-medium text-gray-700">
                      {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF, PNG, JPG files up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Information Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Passport, Emirates ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Document Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="uae_visa">UAE Visa</SelectItem>
                    <SelectItem value="emirates_id">Emirates ID</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="ejari">Ejari</SelectItem>
                    <SelectItem value="health_insurance">Health Insurance</SelectItem>
                    <SelectItem value="labor_card">Labor Card</SelectItem>
                    <SelectItem value="bank_statement">Bank Statement</SelectItem>
                    <SelectItem value="tax_document">Tax Document</SelectItem>
                    <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                    <SelectItem value="marriage_certificate">Marriage Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="UAE">United Arab Emirates</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CANADA">Canada</SelectItem>
                    <SelectItem value="AUSTRALIA">Australia</SelectItem>
                    <SelectItem value="INDIA">India</SelectItem>
                    <SelectItem value="PAKISTAN">Pakistan</SelectItem>
                    <SelectItem value="PHILIPPINES">Philippines</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                  placeholder="e.g., A1234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional notes about this document..."
                rows={3}
              />
            </div>

            {/* AI Features Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">AI-Powered Features</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Our AI will automatically extract text, identify expiry dates, check dependencies, and generate smart insights for your documents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!uploadedFile || isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


