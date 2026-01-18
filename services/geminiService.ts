
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { GradeLevel, Subject, QuizQuestion, Language, AdminSettings } from "../types";

export class GeminiTutorService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private adminSettings: AdminSettings = { globalAnnouncement: '', aiModifier: '' };

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public setAdminSettings(settings: AdminSettings) {
    this.adminSettings = settings;
  }

  private getSystemInstruction(grade: GradeLevel, subject: Subject, language: Language, country: string): string {
    const isMiddleSchool = grade === 'Grade 6-8';
    
    return `
      SYSTEM PROMPT – ELITE STUDY MENTOR
      User Location: ${country}
      Student Level: ${grade}
      Subject: ${subject}
      Language: Always respond in English.

      CEO MODIFIER (STRICTLY FOLLOW THIS): ${this.adminSettings.aiModifier || 'None'}

      CORE TUTORING PHILOSOPHY:
      - Respond in English.
      - Socratic Scaffolding: Never just give the answer. Lead the student there.
      - ${isMiddleSchool ? 'Analogy-First Learning: Use relatable analogies.' : 'First Principles: Explain underlying logic.'}
      - Academic Clarity: Use LaTeX ($...$) for math and science notation.
      - Cultural Context: Since the user is from ${country}, feel free to use local examples if relevant to the topic.

      GRADE 7 / MIDDLE SCHOOL PROTOCOL:
      - Use clear, straightforward language.
      - Break multi-step problems into single chunks.
      - Be extremely encouraging.

      BEHAVIORAL RULES:
      - Always encourage showing work.
    `;
  }

  public async startNewSession(grade: GradeLevel, subject: Subject, language: Language, country: string, initialTopic: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: this.getSystemInstruction(grade, subject, language, country),
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }]
      },
    });

    const prompt = `Welcome the student warmly. Topic: ${initialTopic}. Provide a short intro with an analogy and ask one question to start.`;
    
    return this.streamMessage(prompt);
  }

  public async generateQuizQuestion(grade: GradeLevel, subject: Subject, language: Language, context: string): Promise<QuizQuestion> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a fun multiple choice question in English. 
      Context: ${context}. Subject: ${subject}. Level: ${grade}.
      CEO MODIFIER: ${this.adminSettings.aiModifier}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}') as QuizQuestion;
    } catch (e) {
      return {
        question: "What is $12 + 15$?",
        options: ["25", "27", "30", "22"],
        correctAnswerIndex: 1,
        explanation: "Correct! $12 + 15 = 27$."
      };
    }
  }

  public async sendMessage(message: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    if (!this.chat) throw new Error("Session not started");
    return this.streamMessage(message);
  }

  private async *streamMessage(message: string): AsyncGenerator<GenerateContentResponse> {
    if (!this.chat) return;
    try {
      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) yield chunk as GenerateContentResponse;
    } catch (error) {
      yield { text: "I encountered an error. Let's try again." } as any;
    }
  }
}

export const geminiTutor = new GeminiTutorService();
