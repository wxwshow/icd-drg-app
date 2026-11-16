import { NextRequest, NextResponse } from 'next/server';
import { executeSearch } from '@/lib/search-local';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  // Empty query returns empty results (not an error)
  if (!q || q.length === 0) {
    return NextResponse.json(
      { results: [], query: '', count: 0 },
      { status: 200 }
    );
  }

  // Sanity limit on query length
  if (q.length > 200) {
    return NextResponse.json(
      { error: 'Search query too long. Maximum 200 characters.' },
      { status: 400 }
    );
  }

  const typeParam = searchParams.get('type');
  const type =
    typeParam === 'diagnosis' || typeParam === 'procedure' ? typeParam : undefined;

  try {
    const results = await executeSearch(q, type);
    return NextResponse.json({
      results,
      query: q,
      count: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}
