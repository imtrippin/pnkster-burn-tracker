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

    // Create a simple PNG using a reliable image generation service
    // This will work better with Twitter than SVG
    const imageUrl = `https://og-image.vercel.app/$pnkstr%20burned.png?theme=dark&md=1&fontSize=100px&text=${encodeURIComponent(formattedBurned)}`
    
    // Fetch the image and return it directly
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
