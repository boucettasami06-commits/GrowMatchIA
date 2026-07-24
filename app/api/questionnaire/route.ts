import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/src/lib/supabase-server';
import { QuestionnaireSchema } from '@/src/lib/schemas';
import type { CreateProgramResponse } from '@/src/lib/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = QuestionnaireSchema.parse(body);

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

    const sb = supabase as any;
    const { data: program, error: programError } = await sb
      .from('programs')
      .insert({
        user_id: user.id,
        program_type: validatedData.program_type,
        status: 'active',
      })
      .select('id, created_at')
      .single();

    if (programError || !program) {
      console.error('Program creation error:', programError);
      return NextResponse.json(
        { error: 'Failed to create program' },
        { status: 500 }
      );
    }

    const { error: questionnaireError } = await sb
      .from('questionnaires')
      .insert({
        program_id: program.id,
        age: validatedData.age,
        country: validatedData.country || null,
        skin_type: validatedData.skin_type,
        main_concern: validatedData.main_concern,
        allergies: validatedData.allergies,
        budget_monthly: validatedData.budget_monthly,
        preferred_brands: validatedData.preferred_brands,
        time_available_minutes: validatedData.time_available_minutes,
      });

    if (questionnaireError) {
      console.error('Questionnaire creation error:', questionnaireError);
      await supabase.from('programs').delete().eq('id', program.id);
      return NextResponse.json(
        { error: 'Failed to save questionnaire' },
        { status: 500 }
      );
    }

    const response: CreateProgramResponse = {
      program_id: program.id,
      program_type: validatedData.program_type,
      created_at: program.created_at,
      status: 'active',
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
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Validation failed', details: error.message },
          { status: 400 }
        );
      }
    }

    console.error('Questionnaire API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
