import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/src/lib/supabase-server';

export async function GET(request: NextRequest) {
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

    const programId = request.nextUrl.searchParams.get('program_id');
    if (!programId) {
      return NextResponse.json(
        { error: 'program_id query parameter required' },
        { status: 400 }
      );
    }

    const sb = supabase as any;

    // Verify user owns the program
    const { data: program, error: programError } = await sb
      .from('programs')
      .select('user_id')
      .eq('id', programId)
      .eq('user_id', user.id)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Fetch coach messages for this program
    const { data: messages, error: messagesError } = await sb
      .from('coach_messages')
      .select('id, user_message, coach_message, created_at')
      .eq('program_id', programId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (messagesError) {
      console.error('Fetch coach messages error:', messagesError);
      return NextResponse.json(
        { error: 'Failed to fetch coach messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      messages: messages || [],
    });
  } catch (error) {
    console.error('Get coach messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
