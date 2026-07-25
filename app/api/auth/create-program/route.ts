import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/src/lib/supabase-server';

export async function POST(request: NextRequest) {
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

    // Check if user already has a program
    const { data: existingProgram } = await sb
      .from('programs')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (existingProgram) {
      return NextResponse.json(
        { message: 'Program already exists', program_id: existingProgram.id },
        { status: 200 }
      );
    }

    // Create a default anti-acne program for the new user
    const { data: program, error: programError } = await sb
      .from('programs')
      .insert({
        user_id: user.id,
        program_type: 'glow', // Default program type
        status: 'active',
      })
      .select('id')
      .single();

    if (programError || !program) {
      console.error('Program creation error:', programError);
      return NextResponse.json(
        { error: 'Failed to create program' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Program created', program_id: program.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create program API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
