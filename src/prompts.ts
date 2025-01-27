export const extract_calendar_event_prompt = `Extract calendar event information from a textual description and output in a structured JSON format that aligns with the specified schema.

- Accurately identify and extract relevant data points from semantic text to populate each field in the JSON schema.
- Pay special attention to required fields: "title," "startDate," and "endDate."
- Consider optional fields while ensuring the extracted data's fidelity to the text.

# Output Format

Provide the extracted data in the following JSON object format:

\`\`\`json
{
  "title": "Example Event Title",
  "startDate": "2023-05-15 09:00:00",
  "endDate": "2023-05-15 10:00:00",
  "notes": "This is a detailed note about the event.",
  "isAllDay": false,
  "url": "http://example.com",
  "location": "123 Example Street",
  "calendarId": "defaultCalendar123",
  "availability": 1,
  "alarms": [-3600, -7200],
  "recurrence": {
    "frequency": "weekly",
    "interval": 1,
    "endDate": "2023-12-31 23:59:59",
    "count": 10
  }
}
\`\`\`

# Notes

- Ensure date and time formats adhere strictly to 'yyyy-MM-dd HH:mm:ss'.
- If any optional data is not present in the text, omit it from the JSON output.
- Use enumerated options accurately for fields such as recurrence frequency and make meaningful defaults for boolean and enumerated fields if text does not specify.

# Examples

### Example 1

**Input Text:**
"Join us for a weekly team sync starting from March 1st, 2023 at 10 AM, happening at the main conference room. Ends on March 29, 2023, and don't forget to bring your own coffee."

**Output JSON:**
\`\`\`json
{
  "title": "Weekly Team Sync",
  "startDate": "2023-03-01 10:00:00",
  "endDate": "2023-03-01 11:00:00",
  "notes": "Don't forget to bring your own coffee.",
  "isAllDay": false,
  "location": "Main conference room",
  "recurrence": {
    "frequency": "weekly",
    "endDate": "2023-03-29 23:59:59"
  }
}
\`\`\`

### Example 2

**Input Text:**
"Attend the annual company gala on December 15, 2023. It's an all-day event at the Hyatt Grand."

**Output JSON:**
\`\`\`json
{
  "title": "Annual Company Gala",
  "startDate": "2023-12-15 00:00:00",
  "endDate": "2023-12-15 23:59:59",
  "isAllDay": true,
  "location": "Hyatt Grand"
}
\`\`\`

(Real examples would be more detailed and vary in complexity, such as having URLs or specific alarms.)



Input:
{{content}}

Important Notes:
1. Time format must be YYYY-MM-DD HH:MM:SS
2. Please calculate times carefully and accurately
3. If no specific time given, default to 08:00:00
4. Current time is {{nowTime}}
5. Include all available event properties from the input text
6. Set reasonable defaults for missing optional properties

Response Language:
Reply in the same language as the input.

Output:`