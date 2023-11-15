import { NextResponse } from 'next/server';

export function CreateGET<T>(handler: (params: T) => any) {
  return async function GET(_request: Request, context: { params: T }) {
    const result = await handler(context.params);
    return NextResponse.json(result);
  };
}

export function CreatePOST<T>(handler: (params: T) => any) {
  return async function POST(_request: Request, context: { params: T }) {
    const result = await handler(context.params);
    return NextResponse.json(result);
  };
}
