import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest) {
  try {
    // Look for Video.mp4 in public or workspace root
    let videoPath = path.join(process.cwd(), "public", "Video.mp4")
    if (!fs.existsSync(videoPath)) {
      videoPath = path.join(process.cwd(), "public", "assets", "intro", "Video.mp4")
    }
    if (!fs.existsSync(videoPath)) {
      videoPath = path.join(process.cwd(), "Video.mp4")
    }

    if (!fs.existsSync(videoPath)) {
      return new NextResponse("Video not found", { status: 404 })
    }

    const stat = fs.statSync(videoPath)
    const fileSize = stat.size
    const range = req.headers.get("range")

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = end - start + 1

      const fileStream = fs.createReadStream(videoPath, { start, end })

      // Create a web ReadableStream from the Node read stream
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk))
          fileStream.on("end", () => controller.close())
          fileStream.on("error", (err) => controller.error(err))
        },
        cancel() {
          fileStream.destroy()
        },
      })

      return new NextResponse(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      })
    } else {
      const fileStream = fs.createReadStream(videoPath)
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk))
          fileStream.on("end", () => controller.close())
          fileStream.on("error", (err) => controller.error(err))
        },
        cancel() {
          fileStream.destroy()
        },
      })

      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      })
    }
  } catch (error) {
    console.error("Error streaming video:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
