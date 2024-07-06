import type { NextApiRequest, NextApiResponse } from 'next'
 
type Params = {
  team: string
}
 
export async function GET(request: Request, context: { params: Params }) {
  const team = context.params.team // '1'
  console.log(team)
}