import React, { useState } from "react";
import html2canvas from "html2canvas";
import "./styles.css";

// Translation object for English and Hindi
const translations = {
  // ... (keep your translations as they are)
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
    score += scoreQuestion(data.clinicalQuestion1, ["Never", "Sometimes", "Often", "Always"]);
    score += scoreQuestion(data.clinicalQuestion2, ["No", "Yes", "Mild", "Severe"]);
    score += scoreQuestion(data.clinicalQuestion3, ["No", "Yes", "Mild", "Severe"]);
    score += scoreQuestion(data.clinicalQuestion4, ["Good", "Fair", "Poor"]);
    score += scoreQuestion(data.clinicalQuestion5, ["No", "Yes", "Mild", "Severe"]);

    return score;
  };

  const scoreQuestion = (answer: string, options: string[]) => {
    return options.indexOf(answer) + 1; // Returns 0 if not found, hence +1 to adjust scoring
  };

  const determineRisk = (score: number) => {
    // ... (keep your risk determination logic as it is)
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
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error downloading scorecard:", error);
        });
    }, 100);
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
          {/* Form Fields with improved styles */}
          <label>
            {translations[language].name}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </label>

          <label>
            {translations[language].address}
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="textarea-field"
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
              className="input-field"
            />
          </label>

          {Array.from({ length: 5 }, (_, i) => (
            <label key={i}>
              {translations[language][`question${i + 1}`]}
              <select
                name={`clinicalQuestion${i + 1}`}
                value={formData[`clinicalQuestion${i + 1}`]}
                onChange={handleChange}
                required
                className="select-field"
              >
                <option value="">Select an option</option>
                {/* Add the relevant options based on the question */}
                {i === 0 && (
                  <>
                    <option value="Never">Never</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                    <option value="Always">Always</option>
                  </>
                )}
                {i > 0 && (
                  <>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Mild">Mild</option>
                    <option value="Severe">Severe</option>
                  </>
                )}
              </select>
            </label>
          ))}

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
            <img src="logo.png" alt="Logo" className="score-logo" />
            <p>
              {translations[language].risk} {riskCategory}
            </p>
            <button onClick={downloadScoreCard} className="download-button">
              {translations[language].download}
            </button>
            <button onClick={closeScoreDialog} className="close-button">
              {translations[language].close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
