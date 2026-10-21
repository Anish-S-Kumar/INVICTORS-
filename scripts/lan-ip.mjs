import os from "os"
import qrcode from "qrcode-terminal"

export function getLanIp() {
  const interfaces = os.networkInterfaces()
  let selectedIp = "localhost"

  // Prefer 192.168.x.x or 10.x.x.x or 172.16-31.x.x
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        if (net.address.startsWith("192.168.") || net.address.startsWith("10.")) {
          return net.address
        }
        selectedIp = net.address
      }
    }
  }
  return selectedIp
}

const lanIp = getLanIp()
const port = process.env.PORT || 3000
const url = `http://${lanIp}:${port}`

console.log("\n========================================================")
console.log("📱 INVICTORS CLUB — MOBILE & LOCAL NETWORK ACCESS")
console.log(`🔗 Open on your phone: ${url}`)
console.log("========================================================\n")
console.log("Scan this QR code with your mobile camera:\n")

try {
  qrcode.generate(url, { small: true }, (qr) => {
    console.log(qr)
  })
} catch {
  console.log(`(Direct link: ${url})`)
}
console.log("Ensure your phone is on the same Wi-Fi network.\n")
