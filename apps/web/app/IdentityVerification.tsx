"use client"

import { useState } from 'react';
import { 
  Shield, Upload, CheckCircle, AlertCircle, 
  Camera, Loader2, X, ChevronRight, HelpCircle,
  UserCheck, FileText, CreditCard, Calendar
} from 'lucide-react';

// Step type definition
type VerificationStep = 'intro' | 'personal-info' | 'document-upload' | 'selfie' | 'review' | 'complete';

// Interface for user personal info
interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Props interface
interface IdentityVerificationProps {
  onComplete: () => void;
  onCancel: () => void;
}

const IdentityVerification = ({ onComplete, onCancel }: IdentityVerificationProps) => {
  // State for managing the verification flow
  const [currentStep, setCurrentStep] = useState<VerificationStep>('intro');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // State for document uploads
  const [idFrontUploaded, setIdFrontUploaded] = useState<boolean>(false);
  const [idBackUploaded, setIdBackUploaded] = useState<boolean>(false);
  const [selfieUploaded, setSelfieUploaded] = useState<boolean>(false);
  
  // State for personal information
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  // Progress percentage for the verification process
  const getProgressPercentage = (): number => {
    switch (currentStep) {
      case 'intro': return 0;
      case 'personal-info': return 25;
      case 'document-upload': return 50;
      case 'selfie': return 75;
      case 'review': return 90;
      case 'complete': return 100;
      default: return 0;
    }
  };
  
  // Handle input changes for personal info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Validate personal info before proceeding
  const validatePersonalInfo = (): boolean => {
    // Simple validation - check if all fields are filled
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'address', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredFields) {
      if (!personalInfo[field as keyof PersonalInfo]) {
        setErrorMessage(`Please complete all required fields`);
        return false;
      }
    }
    
    // Validate date of birth (user must be 18+)
    const dob = new Date(personalInfo.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age < 18) {
      setErrorMessage('You must be at least 18 years old to verify your identity');
      return false;
    }
    
    return true;
  };
  
  // Simulate document upload
  const simulateUpload = (type: 'idFront' | 'idBack' | 'selfie'): void => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate upload delay
    setTimeout(() => {
      setIsLoading(false);
      
      switch (type) {
        case 'idFront':
          setIdFrontUploaded(true);
          break;
        case 'idBack':
          setIdBackUploaded(true);
          break;
        case 'selfie':
          setSelfieUploaded(true);
          break;
      }
    }, 1500);
  };
  
  // Go to next step
  const goToNextStep = () => {
    setErrorMessage('');
    
    // Validate current step
    switch (currentStep) {
      case 'personal-info':
        if (!validatePersonalInfo()) return;
        break;
      case 'document-upload':
        if (!idFrontUploaded || !idBackUploaded) {
          setErrorMessage('Please upload both sides of your ID');
          return;
        }
        break;
      case 'selfie':
        if (!selfieUploaded) {
          setErrorMessage('Please upload a selfie');
          return;
        }
        break;
      case 'review':
        // Simulate verification process
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setCurrentStep('complete');
        }, 2000);
        return;
      case 'complete':
        onComplete();
        return;
    }
    
    // Determine next step
    const steps: VerificationStep[] = ['intro', 'personal-info', 'document-upload', 'selfie', 'review', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const nextStep = steps[currentIndex + 1];
    setCurrentStep(nextStep);
  };
  
  // Render the introduction step
  const renderIntroStep = () => (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <Shield className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Identity</h2>
      <p className="text-gray-600 mb-8">
        To comply with regulations and ensure a safe betting environment, we need to verify your identity before you can place real money bets.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8 text-left">
        <h3 className="font-medium text-blue-800 mb-2">What you'll need:</h3>
        <ul className="space-y-2">
          <li className="flex items-center text-blue-700">
            <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
            Personal information
          </li>
          <li className="flex items-center text-blue-700">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            A valid government-issued ID (passport, driver's license, or ID card)
          </li>
          <li className="flex items-center text-blue-700">
            <Camera className="w-5 h-5 mr-2 text-blue-600" />
            A device with a camera for taking a selfie
          </li>
        </ul>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          onClick={onCancel}
        >
          Do This Later
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center"
          onClick={goToNextStep}
        >
          Begin Verification
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
  
  // Render the personal information step
  const renderPersonalInfoStep = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
      <p className="text-gray-600 mb-6">
        Please provide your legal name and current address as they appear on your ID.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
            <input
              type="text"
              name="firstName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={personalInfo.state}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code*</label>
            <input
              type="text"
              name="zipCode"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={personalInfo.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
          <select
            name="country"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={personalInfo.country}
            onChange={handleInputChange}
            required
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setCurrentStep('intro')}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center"
            onClick={goToNextStep}
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
    </div>
  );
  
  // Render the document upload step
  const renderDocumentUploadStep = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Document Verification</h2>
      <p className="text-gray-600 mb-6">
        Please upload clear photos of the front and back of your government-issued ID.
      </p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID Front Upload */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${idFrontUploaded ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}>
            {!idFrontUploaded ? (
              <div>
                <div className="mb-4 flex justify-center">
                  <CreditCard className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Upload front of ID</p>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center mx-auto"
                  onClick={() => simulateUpload('idFront')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-sm text-green-700 font-medium mb-2">Front of ID uploaded</p>
                <button
                  className="text-xs text-green-600 hover:text-green-800"
                  onClick={() => setIdFrontUploaded(false)}
                >
                  Replace
                </button>
              </div>
            )}
          </div>
          
          {/* ID Back Upload */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${idBackUploaded ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}>
            {!idBackUploaded ? (
              <div>
                <div className="mb-4 flex justify-center">
                  <CreditCard className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">Upload back of ID</p>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center mx-auto"
                  onClick={() => simulateUpload('idBack')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <p className="text-sm text-green-700 font-medium mb-2">Back of ID uploaded</p>
                <button
                  className="text-xs text-green-600 hover:text-green-800"
                  onClick={() => setIdBackUploaded(false)}
                >
                  Replace
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg text-blue-700 text-sm flex items-start">
          <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Tips for a successful verification:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Make sure all four corners of your ID are visible</li>
              <li>Ensure there's good lighting with no glare or shadows</li>
              <li>All text on the ID should be clearly readable</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setCurrentStep('personal-info')}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center"
            onClick={goToNextStep}
            disabled={isLoading}
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
    </div>
  );
  
  // Render the selfie upload step
  const renderSelfieStep = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Selfie Verification</h2>
      <p className="text-gray-600 mb-6">
        Please take a clear selfie to verify that you match your ID.
      </p>
      
      <div className="space-y-6">
        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${selfieUploaded ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-300'}`}>
          {!selfieUploaded ? (
            <div>
              <div className="mb-4 flex justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Take or upload a selfie</p>
              <div className="flex justify-center space-x-3">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => simulateUpload('selfie')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </>
                  )}
                </button>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
                  onClick={() => simulateUpload('selfie')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <p className="text-sm text-green-700 font-medium mb-2">Selfie uploaded successfully</p>
              <button
                className="text-xs text-green-600 hover:text-green-800"
                onClick={() => setSelfieUploaded(false)}
              >
                Take new photo
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg text-blue-700 text-sm flex items-start">
          <HelpCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Tips for a successful selfie:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Make sure your face is clearly visible and well-lit</li>
              <li>Remove sunglasses, hats, or anything that obscures your face</li>
              <li>Look directly at the camera with a neutral expression</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setCurrentStep('document-upload')}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center"
            onClick={goToNextStep}
            disabled={isLoading}
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
      
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
    </div>
  );
  
  // Render the review step
  const renderReviewStep = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Review and Submit</h2>
      <p className="text-gray-600 mb-6">
        Please review your information before submitting for verification.
      </p>
      
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Personal Information</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{personalInfo.dateOfBirth}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{personalInfo.address}</p>
              <p className="font-medium">{personalInfo.city}, {personalInfo.state} {personalInfo.zipCode}</p>
              <p className="font-medium">{personalInfo.country}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Documents</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-800">ID Front</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-800">ID Back</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-green-800">Selfie</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
          <p className="font-medium mb-1">Please note:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verification typically takes 1-2 business days</li>
            <li>You'll receive an email when your verification is complete</li>
            <li>You can still use non-monetary features while verification is pending</li>
          </ul>
        </div>
        
        <div className="flex items-start">
          <input 
            id="consent" 
            type="checkbox" 
            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
            I confirm that all information provided is accurate and belongs to me. I consent to the processing of my personal data for verification purposes.
          </label>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setCurrentStep('selfie')}
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md flex items-center"
            onClick={goToNextStep}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Verification
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
  
  // Render the completion step
  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Submitted!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your identity verification has been submitted successfully. We'll review your information and notify you once the process is complete.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8 text-left max-w-md mx-auto">
        <h3 className="font-medium text-blue-800 mb-2">What happens next:</h3>
        <ul className="space-y-2">
          <li className="flex items-start text-blue-700">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
            Your verification is being processed (typically 1-2 business days)
          </li>
          <li className="flex items-start text-blue-700">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
            You'll receive an email when verification is complete
          </li>
          <li className="flex items-start text-blue-700">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
            Once verified, you can start placing real money bets
          </li>
        </ul>
      </div>
      
      <button
        className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
        onClick={onComplete}
      >
        Return to BetPal
      </button>
    </div>
  );
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return renderIntroStep();
      case 'personal-info':
        return renderPersonalInfoStep();
      case 'document-upload':
        return renderDocumentUploadStep();
      case 'selfie':
        return renderSelfieStep();
      case 'review':
        return renderReviewStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderIntroStep();
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl max-w-3xl mx-auto overflow-hidden">
      {/* Progress bar */}
      {currentStep !== 'intro' && currentStep !== 'complete' && (
        <div className="bg-gray-100 h-2">
          <div 
            className="bg-green-600 h-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      )}
      
      {/* Main content */}
      <div className="p-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default IdentityVerification;