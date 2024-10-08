import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./styles.css";

// Translation object for English and Hindi
const translations = {
  en: {
    title: "Post-Pregnancy Health Form",
    name: "Name:",
    address: "Address:",
    dob: "Date of Birth:",
    question1: "How often do you experience fatigue?",
    question2: "Have you experienced any mood swings?",
    question3: "Do you have any issues with breastfeeding?",
    question4: "How would you rate your physical recovery?",
    question5: "Do you experience pain during intercourse?",
    submit: "Submit",
    reset: "Reset",
    score: "Your Health Score",
    risk: "Risk Category:",
    download: "Download Scorecard",
    close: "Close",
    alert: "Please fill all the required fields",
    noRisk: "No Risk",
    possibilityRisk: "Possibility of Risk",
    possibilityMildRisk: "Possibility of Mild Risk",
    possibilityHighRisk: "Possibility of High Risk",
    emergency: "Emergency: You need to see a doctor",
  },
  hi: {
    title: "प्रसव के बाद स्वास्थ्य फॉर्म",
    name: "नाम:",
    address: "पता:",
    dob: "जन्म तिथि:",
    question1: "आपको थकान कितनी बार होती है?",
    question2: "क्या आपने मूड स्विंग का अनुभव किया है?",
    question3: "क्या आपको स्तनपान में कोई समस्या है?",
    question4: "आपकी शारीरिक रिकवरी को आप कैसे रेट करेंगे?",
    question5: "क्या आपको यौन संबंध के दौरान दर्द होता है?",
    submit: "जमा करें",
    reset: "रीसेट करें",
    score: "आपका स्वास्थ्य स्कोर",
    risk: "जोखिम श्रेणी:",
    download: "स्कोरकार्ड डाउनलोड करें",
    close: "बंद करें",
    alert: "कृपया सभी आवश्यक फ़ील्ड भरें",
    noRisk: "कोई जोखिम नहीं",
    possibilityRisk: "जोखिम की संभावना",
    possibilityMildRisk: "हल्के जोखिम की संभावना",
    possibilityHighRisk: "उच्च जोखिम की संभावना",
    emergency: "आपातकाल: आपको डॉक्टर से मिलना चाहिए",
  },
};

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dob: "",
    clinicalQuestion1: "",
    clinicalQuestion2: "",
    clinicalQuestion3: "",
    clinicalQuestion4: "",
    clinicalQuestion5: "",
  });

  const [score, setScore] = useState<number | null>(null);
  const [riskCategory, setRiskCategory] = useState("");
  const [scoreVisible, setScoreVisible] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !formData.name ||
      !formData.address ||
      !formData.dob ||
      !formData.clinicalQuestion1 ||
      !formData.clinicalQuestion2 ||
      !formData.clinicalQuestion3 ||
      !formData.clinicalQuestion4 ||
      !formData.clinicalQuestion5
    ) {
      alert(translations[language].alert);
      return;
    }

    // Calculate score if all fields are filled
    const calculatedScore = calculateScore(formData);
    setScore(calculatedScore);
    setRiskCategory(determineRisk(calculatedScore));
    setScoreVisible(true);

    // Clear form for refill
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      address: "",
      dob: "",
      clinicalQuestion1: "",
      clinicalQuestion2: "",
      clinicalQuestion3: "",
      clinicalQuestion4: "",
      clinicalQuestion5: "",
    });
  };

  const calculateScore = (data: any) => {
    let score = 0;

    // Scoring logic based on clinical questions
    if (data.clinicalQuestion1 === "Always") score += 3;
    else if (data.clinicalQuestion1 === "Often") score += 2;
    else if (data.clinicalQuestion1 === "Sometimes") score += 1;

    if (data.clinicalQuestion2 === "Severe") score += 3;
    else if (data.clinicalQuestion2 === "Yes") score += 2;
    else if (data.clinicalQuestion2 === "Mild") score += 1;

    if (data.clinicalQuestion3 === "Severe") score += 3;
    else if (data.clinicalQuestion3 === "Yes") score += 2;
    else if (data.clinicalQuestion3 === "Mild") score += 1;

    if (data.clinicalQuestion4 === "Poor") score += 3;
    else if (data.clinicalQuestion4 === "Fair") score += 2;
    else if (data.clinicalQuestion4 === "Good") score += 1;

    if (data.clinicalQuestion5 === "Severe") score += 3;
    else if (data.clinicalQuestion5 === "Yes") score += 2;
    else if (data.clinicalQuestion5 === "Mild") score += 1;

    return score;
  };

  const determineRisk = (score: number) => {
    if (score <= 7) {
      return translations[language].noRisk;
    } else if (score > 7 && score <= 10) {
      return translations[language].possibilityRisk;
    } else if (score > 10 && score <= 12) {
      return translations[language].possibilityMildRisk;
    } else if (score > 12 && score < 15) {
      return translations[language].possibilityHighRisk;
    } else if (score === 15) {
      return translations[language].emergency;
    }
    return "";
  };

  const downloadScoreCard = () => {
    // Use a timeout to ensure the score dialog is fully rendered
    setTimeout(() => {
      const scoreCard = document.getElementById("score-dialog");
      html2canvas(scoreCard, { useCORS: true })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = "scorecard.png";
          link.href = canvas.toDataURL("image/png");
          document.body.appendChild(link); // Append the link to the body
          link.click();
          document.body.removeChild(link); // Remove the link after clicking
        })
        .catch((error) => {
          console.error("Error downloading scorecard:", error);
        });
    }, 100); // Delay to ensure rendering
  };

  const closeScoreDialog = () => {
    setScoreVisible(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="app">
      <div className="language-selector">
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
      </div>
      <div className="form-container">
        <div className="logo">
          <img src="logo.png" alt="Logo" />
        </div>
        <h2 className="form-heading">{translations[language].title}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            {translations[language].name}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {translations[language].address}
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          <label>
            {translations[language].dob}
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            {translations[language].question1}
            <select
              name="clinicalQuestion1"
              value={formData.clinicalQuestion1}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Never">Never</option>
              <option value="Sometimes">Sometimes</option>
              <option value="Often">Often</option>
              <option value="Always">Always</option>
            </select>
          </label>

          <label>
            {translations[language].question2}
            <select
              name="clinicalQuestion2"
              value={formData.clinicalQuestion2}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Mild">Mild</option>
              <option value="Severe">Severe</option>
            </select>
          </label>

          <label>
            {translations[language].question3}
            <select
              name="clinicalQuestion3"
              value={formData.clinicalQuestion3}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Mild">Mild</option>
              <option value="Severe">Severe</option>
            </select>
          </label>

          <label>
            {translations[language].question4}
            <select
              name="clinicalQuestion4"
              value={formData.clinicalQuestion4}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Poor">Poor</option>
              <option value="Fair">Fair</option>
              <option value="Good">Good</option>
            </select>
          </label>

          <label>
            {translations[language].question5}
            <select
              name="clinicalQuestion5"
              value={formData.clinicalQuestion5}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Mild">Mild</option>
              <option value="Severe">Severe</option>
            </select>
          </label>

          <button type="submit" className="submit-button">
            {translations[language].submit}
          </button>
          <button type="button" onClick={handleReset} className="reset-button">
            {translations[language].reset}
          </button>
        </form>
      </div>

      {scoreVisible && (
        <div className="dialog-overlay">
          <div className="score-dialog" id="score-dialog">
            <h3>{translations[language].score}</h3>
            <p>Score: {score} / 15</p>
            <img src="logo.png" alt="Logo" className="score-logo" />{" "}
            {/* Use the imported logo here */}
            <p>
              {translations[language].risk} {riskCategory}
            </p>
            <button onClick={downloadScoreCard}>
              {translations[language].download}
            </button>
            <button onClick={closeScoreDialog}>
              {translations[language].close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
