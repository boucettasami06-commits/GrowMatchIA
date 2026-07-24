import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/src/lib/supabase-server';
import { CoachFeedbackRequestSchema } from '@/src/lib/schemas';
import { buildCoachPrompt } from '@/src/lib/coach-prompt';
import { callOpenAI, extractJSON } from '@/src/lib/openai-client';
import type { CoachFeedbackResponse } from '@/src/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    CoachFeedbackRequestSchema.parse(body);

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const supabase = getSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { program_id, user_message } = body;

    // Verify user owns the program
    const sb = supabase as any;
    const { data: program, error: programError } = await sb
      .from('programs')
      .select('id, program_type, user_id')
      .eq('id', program_id)
      .eq('user_id', user.id)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Fetch questionnaire
    const { data: questionnaire, error: questionnaireError } = await sb
      .from('questionnaires')
      .select('*')
      .eq('program_id', program_id)
      .single();

    if (questionnaireError || !questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      );
    }

    // Fetch routine steps
    const { data: routineSteps, error: stepsError } = await sb
      .from('routine_steps')
      .select('step_type, product_name, step_number')
      .eq('routine_id', (
        await sb
          .from('routines')
          .select('id')
          .eq('program_id', program_id)
          .single()
      ).data?.id);

    if (stepsError) {
      return NextResponse.json(
        { error: 'Failed to fetch routine' },
        { status: 500 }
      );
    }

    // Build coach prompt
    const prompt = buildCoachPrompt(
      questionnaire,
      program.program_type,
      routineSteps || [],
      user_message
    );

    // Call OpenAI
    const openaiResponse = await callOpenAI(prompt);
    const coachMessage = openaiResponse.trim();

    // Save coach message to database
    const { data: message, error: messageError } = await sb
      .from('coach_messages')
      .insert({
        program_id: program_id,
        user_id: user.id,
        user_message: user_message || null,
        coach_message: coachMessage,
      })
      .select('id, created_at')
      .single();

    if (messageError || !message) {
      console.error('Coach message creation error:', messageError);
      return NextResponse.json(
        { error: 'Failed to save coach message' },
        { status: 500 }
      );
    }

    const response: CoachFeedbackResponse = {
      message_id: message.id,
      program_id: program_id,
      user_message: user_message,
      coach_message: coachMessage,
      created_at: message.created_at,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.error('Coach API error:', error.message);
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        );
      }
    }

    console.error('Coach feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to get coach feedback' },
      { status: 500 }
    );
  }
}
