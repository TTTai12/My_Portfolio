import mongoose from "mongoose";

// Lấy chuỗi kết nối MongoDB từ biến môi trường.
// Dấu '!' trong TypeScript báo hiệu rằng giá trị này sẽ không null hoặc undefined.
const MONGODB_URI = process.env.MONGODB_URI!;

// Kiểm tra tính sẵn có của biến môi trường MONGODB_URI
if (!MONGODB_URI) {
  // Ném lỗi nếu biến môi trường bị thiếu, ngăn ứng dụng chạy khi chưa có thông tin kết nối.
  throw new Error("Missing MONGODB_URI in .env.local");
}
// ----------------------------------------------------
// BỘ NHỚ ĐỆM (CACHING) KẾT NỐI
// Cơ chế này rất quan trọng trong môi trường Serverless (Next.js, Vercel)
// để tránh tạo ra nhiều kết nối database không cần thiết.
// ----------------------------------------------------

// Truy cập vào biến global (toàn cục) của Node.js để lưu trữ kết nối.
// Việc này đảm bảo kết nối được duy trì qua các lần tải lại module (hot-reloading) hoặc các lần gọi hàm serverless.
let cached = (global as any).mongoose;

// Nếu chưa có cache Mongoose trong biến global:
if (!cached) {
  // Khởi tạo đối tượng cache và lưu vào global.mongoose
  cached = (global as any).mongoose = { 
    conn: null,   // conn: Đối tượng kết nối Mongoose đã thiết lập.
    promise: null // promise: Promise của quá trình kết nối đang diễn ra.
  };
}

/**
 * Hàm thiết lập và trả về kết nối database MongoDB (có sử dụng caching).
 * @returns {Promise<typeof mongoose>} Đối tượng kết nối Mongoose đã thiết lập.
 */
export async function connectDB() {
  // [1] TRƯỜNG HỢP 1: Đã có kết nối sẵn trong cache (Cache Hit)
  if (cached.conn) {
    return cached.conn;
  }

  // [2] TRƯỜNG HỢP 2: Cần thiết lập kết nối MỚI
  if (!cached.promise) {
    // Bắt đầu quá trình kết nối Mongoose.
    // Kết quả Promise được lưu lại, đảm bảo nếu có nhiều lời gọi đồng thời,
    // tất cả sẽ chờ đợi (await) Promise này hoàn thành, tránh tạo đa kết nối.
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  // Chờ Promise kết nối hoàn thành (dù là mới tạo hay đã có sẵn)
  cached.conn = await cached.promise;
  
  // Trả về đối tượng kết nối đã được lưu vào cache
  return cached.conn;
}

// ----------------------------------------------------
// CÁCH SỬ DỤNG:
// Trong các file models hoặc API routes, bạn chỉ cần gọi:
// import { connectDB } from './path/to/dbConnect';
// await connectDB();
// ----------------------------------------------------