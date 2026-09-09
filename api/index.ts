export default function handler(req: any, res: any) {
  res.status(200).json({
    status: "ok",
    service: "Cambodia Taxi Cab API",
    time: new Date().toISOString(),
  });
}
