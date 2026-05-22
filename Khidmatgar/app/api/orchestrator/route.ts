import { runOrchestration } from '../../../lib/agents/orchestrator';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        const onStepUpdate = (step: any, state: any) => {
          // Push event to the client
          const payload = JSON.stringify({ step, state });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        };

        await runOrchestration(userInput, onStepUpdate);
        
        // Signal completion
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
