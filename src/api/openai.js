import OpenAI from 'openai';

// Initialize OpenAI client
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Missing OpenAI API key. Check your .env file.');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the server
});

/**
 * Generate licensing request template
 * @param {Object} sampleInfo - Information about the sample
 * @param {Object} userInfo - Information about the user
 * @returns {Promise<Object>} Result object with generated template or error
 */
export const generateLicensingTemplate = async (sampleInfo, userInfo) => {
  try {
    const prompt = `
      Generate a professional licensing request email for a music sample.
      
      Sample details:
      - Original track: ${sampleInfo.originalTrack}
      - Artist: ${sampleInfo.artist || 'Unknown'}
      - Rights holder: ${sampleInfo.rightsHolder || 'Unknown'}
      - Timestamp used: ${sampleInfo.timestamp || 'Unknown'}
      - How it's used: ${sampleInfo.usage || 'As a sample in a new track'}
      
      Requester details:
      - Name: ${userInfo.name || 'Unknown'}
      - Artist name: ${userInfo.artistName || userInfo.name || 'Unknown'}
      - Project: ${userInfo.project || 'Upcoming release'}
      - Distribution plans: ${userInfo.distribution || 'Digital streaming platforms'}
      
      The email should be professional, concise, and include:
      1. A brief introduction of the requester
      2. Clear details about the sample being used
      3. Explanation of how it will be used
      4. Request for licensing terms
      5. Polite closing
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional music licensing assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    return { 
      success: true, 
      data: { 
        template: response.choices[0].message.content.trim() 
      } 
    };
  } catch (error) {
    console.error('OpenAI template generation error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to generate licensing template',
        code: error.code || 'openai_error'
      }
    };
  }
};

/**
 * Generate legal explanation for a specific topic
 * @param {string} topic - Legal topic to explain
 * @returns {Promise<Object>} Result object with explanation or error
 */
export const generateLegalExplanation = async (topic) => {
  try {
    const prompt = `
      Explain the following music licensing concept in clear, easy-to-understand language:
      "${topic}"
      
      The explanation should:
      1. Define the concept
      2. Explain its importance in music licensing
      3. Provide practical implications for remix artists
      4. Include any relevant legal considerations
      5. Be accessible to someone without a legal background
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a music licensing expert explaining legal concepts to remix artists.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.5
    });

    return { 
      success: true, 
      data: { 
        explanation: response.choices[0].message.content.trim() 
      } 
    };
  } catch (error) {
    console.error('OpenAI explanation generation error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to generate legal explanation',
        code: error.code || 'openai_error'
      }
    };
  }
};

/**
 * Generate personalized legal advice based on sample analysis
 * @param {Object} analysisData - Sample analysis data
 * @returns {Promise<Object>} Result object with advice or error
 */
export const generateLegalAdvice = async (analysisData) => {
  try {
    const prompt = `
      Generate personalized legal advice for a remix artist based on the following sample analysis:
      
      Samples found: ${analysisData.samplesFound?.length || 0}
      Risk score: ${analysisData.riskScore || 'Unknown'}
      Risk level: ${analysisData.riskLevel || 'Unknown'}
      
      Sample details:
      ${analysisData.samplesFound?.map(sample => `
        - Original track: ${sample.originalTrack}
        - Status: ${sample.status}
        - Rights holder: ${sample.rightsHolder}
      `).join('\n') || 'No samples found'}
      
      The advice should include:
      1. Assessment of the overall legal risk
      2. Specific recommendations for each sample
      3. Next steps for clearance if needed
      4. Potential alternatives if clearance is difficult
      5. General best practices
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a music licensing expert providing personalized legal advice to remix artists.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.4
    });

    return { 
      success: true, 
      data: { 
        advice: response.choices[0].message.content.trim() 
      } 
    };
  } catch (error) {
    console.error('OpenAI advice generation error:', error);
    return { 
      success: false, 
      error: {
        message: error.message || 'Failed to generate legal advice',
        code: error.code || 'openai_error'
      }
    };
  }
};

export default openai;
