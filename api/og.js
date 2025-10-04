import { ImageResponse } from '@vercel/og'

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

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111827',
            backgroundImage: 'linear-gradient(45deg, #1f2937 0%, #111827 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Main Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#ec4899',
              textShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
              marginBottom: 20,
            }}
          >
            $pnkstr burned
          </div>
          
          {/* Burned Amount */}
          <div
            style={{
              fontSize: 120,
              fontWeight: '900',
              background: 'linear-gradient(90deg, #ec4899 0%, #d946ef 50%, #9333ea 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 40,
            }}
          >
            {formattedBurned}
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: '#f3f4f6',
              opacity: 0.8,
            }}
          >
            Real-time burn tracker
          </div>
          
          {/* URL */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: '#9ca3af',
            }}
          >
            pnkster.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
