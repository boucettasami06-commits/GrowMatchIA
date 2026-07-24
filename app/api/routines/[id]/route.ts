import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/src/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
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

    // Fetch routine with program ownership check
    const { data: routine, error: routineError } = await sb
      .from('routines')
      .select('id, program_id, expected_results_weeks, total_time_morning_minutes, total_time_evening_minutes, created_at')
      .eq('id', id)
      .single();

    if (routineError || !routine) {
      return NextResponse.json(
        { error: 'Routine not found' },
        { status: 404 }
      );
    }

    // Verify user owns the program
    const { data: program, error: programError } = await sb
      .from('programs')
      .select('user_id')
      .eq('id', routine.program_id)
      .single();

    if (programError || !program || program.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch routine steps
    const { data: steps, error: stepsError } = await sb
      .from('routine_steps')
      .select('step_type, step_number, product_name, product_category, time_minutes, instructions')
      .eq('routine_id', id)
      .order('step_type', { ascending: true })
      .order('step_number', { ascending: true });

    if (stepsError) {
      console.error('Routine steps error:', stepsError);
      return NextResponse.json(
        { error: 'Failed to fetch routine steps' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      routine,
      steps,
    });
  } catch (error) {
    console.error('Get routine API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
