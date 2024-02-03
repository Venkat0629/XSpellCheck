import React, { useState } from "react";

const XSpellCheck = () => {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState([]);

  const handleTextChange = async (event) => {
    const newText = event.target.value;
    setText(newText);
    const words = newText.split(/[ ,.]+/);

    const correctedWords = await Promise.all(
      words.map(async (word) => {
        const correctedWord = await fetchCorrectedWord(word.toLowerCase());
        return correctedWord || word;
      })
    );

    setCorrections(correctedWords.filter((word, idx) => word !== words[idx]));
  };

  const fetchCorrectedWord = async (word) => {
    try {
      const response = await fetch(
        `https://languagetool.org/api/v2/check?text=${word}&language=en-US`
      );
      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        const firstSuggestion = data.matches[0].replacements[0].value;
        return firstSuggestion;
      }
      return null;
    } catch (error) {
      console.error("Error fetching corrected word:", error);
      return null;
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text here..."
        rows={10}
        cols={50}
      />
      {corrections.length > 0 && (
        <p>
          Did you mean:
          {/* {corrections.map((correction, index) => (
            <span key={index}>
              <strong> {correction}</strong>
              {index < corrections.length - 1 && ", "}
            </span>
          ))} */}
          {<strong> {corrections[0]}</strong>}?
        </p>
      )}
    </div>
  );
};

export default XSpellCheck;
