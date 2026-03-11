import { useState } from "react";
import UploadStep1 from "@/components/public/UploadStep1";
import UploadStep2Review from "@/components/public/UploadStep2Review";
import UploadStep3Publish from "@/components/public/UploadStep3Publish";

export default function UploadVideoWizard() {

  const [step, setStep] = useState(1);

  return (
    <>
    
    {step === 1 && (
        <UploadStep1
          goNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <UploadStep2Review
          goNext={() => setStep(3)}
          goBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <UploadStep3Publish
          goBack={() => setStep(2)}
        />
      )}
    </>
  );
}