import { tool } from "ai";
import { z } from "zod";

export const sendEmail = tool({
  description: "Send an email to a specified recipient",
  parameters: z.object({
    to: z.string().describe("Email address of the recipient"),
    subject: z.string().describe("Subject of the email"),
    message: z.string().describe("Body content of the email"),
  }),
  execute: async ({ to, subject, message }) => {
    return {
      status: "success",
      message: `Email sent to ${to} with subject "${subject} and message "${message}"`,
    }
  }
});

export type SendEmailParams = z.infer<(typeof sendEmail)["parameters"]>;
