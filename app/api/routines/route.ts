import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/src/lib/supabase-server';
import { GenerateRoutineRequestSchema, RoutineSchema } from '@/src/lib/schemas';
import { buildRoutinePrompt } from '@/src/lib/prompt-engineer';
import { callOpenAI, extractJSON } from '@/src/lib/openai-client';
import type { GenerateRoutineResponse } from '@/src/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    GenerateRoutineRequestSchema.parse(body);

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

    const { program_id } = body;

    // Fetch program and questionnaire
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

    // Build prompt and call OpenAI
    const prompt = buildRoutinePrompt(questionnaire, program.program_type);
    const openaiResponse = await callOpenAI(prompt);
    const jsonData = extractJSON(openaiResponse);

    // Parse and validate routine data
    const allSteps = [
      ...jsonData.morning_steps.map((s: any, idx: number) => ({
        step_type: 'morning',
        step_number: idx + 1,
        product_name: s.product_name,
        product_category: s.product_category,
        time_minutes: s.time_minutes,
        instructions: s.instructions,
      })),
      ...jsonData.evening_steps.map((s: any, idx: number) => ({
        step_type: 'evening',
        step_number: idx + 1,
        product_name: s.product_name,
        product_category: s.product_category,
        time_minutes: s.time_minutes,
        instructions: s.instructions,
      })),
      ...(jsonData.bonus_treatments || []).map((s: any, idx: number) => ({
        step_type: 'bonus',
        step_number: idx + 1,
        product_name: s.product_name,
        product_category: s.product_category,
        time_minutes: s.time_minutes,
        instructions: s.instructions,
      })),
    ];

    // Save routine to database
    const { data: routine, error: routineError } = await sb
      .from('routines')
      .insert({
        program_id: program_id,
        expected_results_weeks: 8,
        total_time_morning_minutes: jsonData.total_time_morning_minutes,
        total_time_evening_minutes: jsonData.total_time_evening_minutes,
      })
      .select('id')
      .single();

    if (routineError || !routine) {
      console.error('Routine creation error:', routineError);
      return NextResponse.json(
        { error: 'Failed to create routine' },
        { status: 500 }
      );
    }

    // Save routine steps
    const stepsWithRoutineId = allSteps.map((step) => ({
      ...step,
      routine_id: routine.id,
    }));

    const { error: stepsError } = await sb
      .from('routine_steps')
      .insert(stepsWithRoutineId);

    if (stepsError) {
      console.error('Routine steps error:', stepsError);
      await sb.from('routines').delete().eq('id', routine.id);
      return NextResponse.json(
        { error: 'Failed to save routine steps' },
        { status: 500 }
      );
    }

    const response: GenerateRoutineResponse = {
      routine_id: routine.id,
      program_id: program_id,
      steps: allSteps,
      total_time_morning_minutes: jsonData.total_time_morning_minutes,
      total_time_evening_minutes: jsonData.total_time_evening_minutes,
      expected_results_weeks: 8,
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
      console.error('Routine generation error:', error.message);
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        );
      }
    }

    console.error('Routine API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate routine' },
      { status: 500 }
    );
  }
}
