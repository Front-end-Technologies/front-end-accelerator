import { Chat, ChatQuickActions } from "@/components/chat";


const quickActions: ChatQuickActions[] = [
  {
    section: 'basic',
    label: 'Get to know Jack Sparrow',
    value: 'Tell me something about Jack Sparrow',
  },
  {
    section: 'tool-calling',
    label: 'Get the weather in Paris',
    value: 'Get the weather in Paris',
  },
  {
    section: 'tool-calling',
    label: 'Get the weather in ...',
    value: 'Get the weather in <city>',
  },
  {
    section: 'tool-calling',
    label: 'Send mail a to ...',
    value: 'Send a mail to <email> with subject <subject> and message <message>',
  },
  {
    section: 'user-interaction',
    label: 'Schedule a team meeting',
    value: 'Schedule a meeting with the team tomorrow at 9am for our standup',
  },
  {
    section: 'user-interaction',
    label: 'Schedule a long meeting',
    value: 'Schedule a meeting with the team tomorrow at 2pm for 2 hours for an integration checkup',
  },
  {
    section: 'user-interaction',
    label: 'Schedule a meeting next week',
    value: 'Schedule a meeting next friday at 2pm for 2 hours for a project review',
  },
  {
    section: 'mcp',
    label: '5 Trivias about gaming',
    value: 'Give me 5 Trivias about gaming',
  },
  {
    section: 'mcp',
    label: '5 Trivias about films',
    value: 'Give me 5 Trivias about films',
  },
  {
    section: 'mcp',
    label: 'Get to know Henry the monkey',
    value: 'Give me details about the monkey named "Henry"',
  }
]



export default async function SectionPage({
    params,
  }: {
    params: Promise<{ section: string }>
  }) {
    const { section } = await params
    const sectionQuickActions = quickActions.filter((action) => action.section === section);
    return <Chat section={section} apiUrl={`/api/chat/${section}`} quickActions={sectionQuickActions} />;
}