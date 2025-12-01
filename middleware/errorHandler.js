export function errorHandler(err, req, res, next) {
  console.error("Error:", err)

  if (err.message.includes("Cannot read property")) {
    return res.status(500).json({
      success: false,
      message: "Database connection error",
    })
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  })
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  })
}
