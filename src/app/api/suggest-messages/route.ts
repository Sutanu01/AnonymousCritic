import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const POST = async (req: Request) => {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Please generate the questions in a single string format, separated by '||' ans do not write anything except the questions themselves or the separator '||'. Do not include any additional text or explanations.Don't even write headers like 'Suggested Messages Response:' or 'Suggested Messages:'. Just return the questions in the specified format.";

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
    });

    const text = response.choices[0]?.message?.content;

    return Response.json(
      {
        success: true,
        message: 'Questions generated successfully.',
        data: text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in Suggesting Messages:', error);
    return Response.json(
      {
        success: false,
        message: 'An error occurred while processing your request.',
      },
      { status: 500 }
    );
  }
};
