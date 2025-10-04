export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  try {
    // Fetch current burn data
    const RPC_URL = 'https://rpc.ankr.com/eth/a5738491e6c6cf706f5fe88588fb63e12abc8b9a7076ef9bee8e2f1f8a6462a4'
    const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'
    const TOKEN_CONTRACT = '0xc50673EDb3A7b94E8CAD8a7d4E0cD68864E33eDF'
    const TOKEN_DECIMALS = 18

    // Get burned amount
    const data = `0x70a08231000000000000000000000000${DEAD_ADDRESS.substring(2)}`
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'eth_call',
        params: [{ to: TOKEN_CONTRACT, data }, 'latest']
      }),
    })
    
    const json = await response.json()
    const balanceBigInt = BigInt(json.result)
    const burnedAmount = Number(balanceBigInt) / (10 ** TOKEN_DECIMALS)
    const formattedBurned = burnedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })

    // Create SVG image
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="text" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#d946ef;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <text x="600" y="200" font-family="system-ui, sans-serif" font-size="64" font-weight="bold" fill="#ec4899" text-anchor="middle" filter="drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))">$pnkstr burned</text>
        <text x="600" y="350" font-family="system-ui, sans-serif" font-size="120" font-weight="900" fill="url(#text)" text-anchor="middle">${formattedBurned}</text>
        <text x="600" y="450" font-family="system-ui, sans-serif" font-size="32" fill="#f3f4f6" text-anchor="middle" opacity="0.8">Real-time burn tracker</text>
        <text x="600" y="580" font-family="system-ui, sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle">pnkster.vercel.app</text>
      </svg>
    `

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    })
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
